import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Web3Provider, TransactionRequest } from "@ethersproject/providers";
import { TransactionState } from "./constants";

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
): Promise<TransactionState> => {
  if (!provider) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  const receipt = await provider.send("eth_sendTransaction", [
    transactionRequest,
  ]);

  if (receipt) {
    return TransactionState.Sent;
  } else {
    return TransactionState.Failed;
  }
};
