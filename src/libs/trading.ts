import {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import {
  FeeAmount,
  Pool,
  Route,
  SwapOptions,
  SwapQuoter,
  SwapRouter,
  Trade,
} from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import JSBI from "jsbi";

import {
  ERC20_ABI,
  QUOTER_CONTRACT_ADDRESS,
  SWAP_ROUTER_ADDRESS,
} from "./constants";
import { getPoolInfo } from "./pool";
import { fromReadableAmount } from "./utils";
import { sendTransaction } from "./metamask";

export type TokenTrade = Trade<Token, Token, TradeType>;

export type TradeInput = {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: number;
  address: string;
};

export async function createTrade(
  provider: Web3Provider,
  tradeInput: TradeInput
): Promise<TokenTrade> {
  const poolInfo = await getPoolInfo(
    provider,
    tradeInput.tokenIn,
    tradeInput.tokenOut
  );

  const pool = new Pool(
    tradeInput.tokenIn,
    tradeInput.tokenOut,
    FeeAmount.MEDIUM,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );

  const swapRoute = new Route([pool], tradeInput.tokenIn, tradeInput.tokenOut);

  const amountOut = await getOutputQuote(provider, swapRoute, tradeInput);

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      tradeInput.tokenIn,
      fromReadableAmount(
        tradeInput.amountIn,
        tradeInput.tokenIn.decimals
      ).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      tradeInput.tokenOut,
      JSBI.toNumber(JSBI.BigInt(amountOut))
    ),
    tradeType: TradeType.EXACT_INPUT,
  });

  return uncheckedTrade;
}

export async function executeTrade(
  provider: Web3Provider,
  trade: TokenTrade,
  tradeInput: TradeInput
) {
  if (!provider || !tradeInput.address) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  // Give approval to the router to spend the token
  const approvalTxHash = await getTokenTransferApproval(provider, tradeInput);

  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: tradeInput.address,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: tradeInput.address,
  };

  return await sendTransaction(provider, tx);
}

// Helper Quoting and Pool Functions

async function getOutputQuote(
  provider: Web3Provider,
  route: Route<Currency, Currency>,
  tradeInput: TradeInput
) {
  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      tradeInput.tokenIn,
      fromReadableAmount(
        tradeInput.amountIn,
        tradeInput.tokenIn.decimals
      ).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });

  return ethers.utils.defaultAbiCoder.decode(["uint256"], quoteCallReturnData);
}

export async function getTokenTransferApproval(
  provider: Web3Provider,
  tradeInput: TradeInput
): Promise<string> {
  if (!provider || !tradeInput.address) {
    throw new Error("No Provider Found");
  }

  const tokenContract = new ethers.Contract(
    tradeInput.tokenIn.address,
    ERC20_ABI,
    provider
  );

  const transaction = await tokenContract.populateTransaction.approve(
    SWAP_ROUTER_ADDRESS,
    fromReadableAmount(
      tradeInput.amountIn,
      tradeInput.tokenIn.decimals
    ).toString()
  );

  return sendTransaction(provider, {
    ...transaction,
    from: tradeInput.address,
  });
}
