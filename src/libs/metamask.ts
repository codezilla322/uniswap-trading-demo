import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Web3Provider, TransactionRequest } from "@ethersproject/providers";

const [connector, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

export const getConnector = () => {
  return connector;
};

export const getHooks = () => {
  return hooks;
};

export const sendTransaction = async (
  provider: Web3Provider,
  transactionRequest: TransactionRequest
): Promise<string> => {
  if (!provider) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  const receipt = await provider.send("eth_sendTransaction", [
    transactionRequest,
  ]);

  return receipt;
};
