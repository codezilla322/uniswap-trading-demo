import { useState } from "react";
import { ChainId } from "@uniswap/sdk-core";
import { Web3Provider } from "@ethersproject/providers";

import TokenSelector from "./TokenSelector";
import { getConnector, getHooks } from "@/libs/metamask";
import { Tokens } from "@/libs/constants";
import { wrapETH } from "@/libs/wallet";
import { formatBalance } from "@/libs/utils";
import { createTrade, executeTrade } from "@/libs/trading";
import { useBalance } from "@/libs/hooks";

export default function SwapPanel() {
  const connector = getConnector();
  const { useProvider, useAccounts } = getHooks();
  const provider = useProvider();
  const accounts = useAccounts();
  const address = accounts ? accounts[0] : undefined;

  const [error, setError] = useState<Error | undefined>(undefined);
  const [tokenIn, setTokenIn] = useState<"WETH" | "USDC">("WETH");
  const [tokenOut, setTokenOut] = useState<"WETH" | "USDC">("USDC");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapInfo, setSwapInfo] = useState<string | undefined>();
  const balanceIn = useBalance(Tokens[tokenIn]);
  const balanceOut = useBalance(Tokens[tokenOut]);
  const [resultTxHash, setResultTxHash] = useState<string | undefined>();

  const onTokenSwap = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);

    setSwapInfo("");
    setError(undefined);
  };

  const onSwap = async () => {
    try {
      setIsSwapping(true);
      setError(undefined);
      setSwapInfo(undefined);
      setResultTxHash(undefined);

      // wrap ether to weth
      if (tokenIn === "WETH" && balanceIn < 0.001) {
        await connector.activate(ChainId.GOERLI);
        setSwapInfo("Trying to wrapping eth...");
        const wrapTxHash = await wrapETH(provider, address, 0.001);
        if (wrapTxHash) {
          setSwapInfo("Wrapping succeed");
        }
      }

      if (tokenIn === "USDC" && balanceIn < 450000) {
        throw new Error("Balance is insufficient");
      }

      const tradeData = {
        tokenIn: Tokens[tokenIn],
        tokenOut: Tokens[tokenOut],
        amountIn: tokenIn === "WETH" ? 0.001 : 450000,
        address: address as string,
      };
      const tokenTrade = await createTrade(provider as Web3Provider, tradeData);
      setSwapInfo("Trade is created");

      const tradeTxHash = await executeTrade(
        provider as Web3Provider,
        tokenTrade,
        tradeData
      );

      if (tradeTxHash) {
        setIsSwapping(false);
        setSwapInfo(undefined);
        setResultTxHash(tradeTxHash);
      }
    } catch (error) {
      setError(error as Error);
      setIsSwapping(false);
    }
  };

  return (
    <div className="w-[600px] mt-6 p-4 flex flex-col justify-center items-center border-2 rounded-xl border-white">
      <h3 className="my-2">Swap 0.001 ETH or 450,000 USDC</h3>
      <TokenSelector onTokenSwap={onTokenSwap} fromETH={tokenIn === "WETH"} />

      <div className="w-full flex justify-between mt-4">
        <div className="w-[200px] flex justify-center">
          <span>{`${formatBalance(balanceIn, 6)} ${tokenIn}`}</span>
        </div>

        <div className="w-[200px] flex justify-center">
          <span>{`${formatBalance(balanceOut, 6)} ${tokenOut}`}</span>
        </div>
      </div>

      <div className="mt-4">
        {error?.message && (
          <p className="my-2 text-error">
            {error.message.slice(0, 40)}
            {"..."}
          </p>
        )}
        {!error && swapInfo && <p className="my-2 text-info">{swapInfo}</p>}
        {resultTxHash && (
          <p className="my-2 text-info">
            Trade is finished:{" "}
            <a
              href={`https://goerli.etherscan.io/tx/${resultTxHash}`}
              target="_blank"
            >
              {`${resultTxHash.substring(0, 6)}...${resultTxHash.slice(-4)}`}
            </a>
          </p>
        )}
      </div>

      <div className="mt-6">
        <button
          className="py-2 px-8 bg-primary hover:bg-primary-hover active:bg-primary disabled:bg-grey rounded-lg text-black font-semibold"
          disabled={isSwapping}
          onClick={() => onSwap()}
        >
          SWAP
        </button>
      </div>
    </div>
  );
}
