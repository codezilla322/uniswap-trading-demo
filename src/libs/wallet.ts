import { Currency } from "@uniswap/sdk-core";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  TransactionState,
  WETH_ABI,
  WETH_CONTRACT_ADDRESS,
} from "./constants";
import { fromReadableAmount, toReadableAmount } from "./utils";
import { sendTransaction } from "./metamask";

export async function getCurrencyBalance(
  provider: Web3Provider,
  address: string,
  currency: Currency
): Promise<string> {
  if (!provider || !address) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  // Handle ETH directly
  if (currency.isNative) {
    return ethers.utils.formatEther(await provider.getBalance(address));
  }

  // Get currency otherwise
  const currencyContract = new ethers.Contract(
    currency.address,
    ERC20_ABI,
    provider
  );
  const balance: number = await currencyContract.balanceOf(address);
  const decimals: number = await currencyContract.decimals();

  // Format with proper units
  return toReadableAmount(balance, decimals).toString();
}

// wraps ETH (rounding up to the nearest ETH for decimal places)
export async function wrapETH(
  provider: Web3Provider | undefined,
  address: string | undefined,
  eth: number
): Promise<string> {
  if (!provider || !address) {
    throw new Error("Cannot wrap ETH without a provider and wallet address");
  }

  const wethContract = new ethers.Contract(
    WETH_CONTRACT_ADDRESS,
    WETH_ABI,
    provider
  );

  const transaction = {
    data: wethContract.interface.encodeFunctionData("deposit"),
    value: fromReadableAmount(eth, 18).toHexString(),
    from: address,
    to: WETH_CONTRACT_ADDRESS,
  };

  return await sendTransaction(provider, transaction);
}

// unwraps ETH (rounding up to the nearest ETH for decimal places)
export async function unwrapETH(
  provider: Web3Provider | undefined,
  address: string | undefined,
  eth: number
) {
  if (!provider || !address) {
    throw new Error("Cannot unwrap ETH without a provider and wallet address");
  }

  const wethContract = new ethers.Contract(
    WETH_CONTRACT_ADDRESS,
    WETH_ABI,
    provider
  );

  const transaction = {
    data: wethContract.interface.encodeFunctionData("withdraw", [
      fromReadableAmount(eth, 18).toHexString(),
    ]),
    from: address,
    to: WETH_CONTRACT_ADDRESS,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  return await sendTransaction(provider, transaction);
}
