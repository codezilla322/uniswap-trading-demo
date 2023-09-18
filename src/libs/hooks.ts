import { useEffect, useState } from "react";
import { ChainId, Token } from "@uniswap/sdk-core";
import { Web3Provider } from "@ethersproject/providers";
import { getConnector, getHooks } from "@/libs/metamask";
import { getCurrencyBalance } from "@/libs/wallet";

export const useBalance = (token: Token) => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const connector = getConnector();
  const { useProvider, useChainId, useAccounts } = getHooks();
  const provider = useProvider();
  const metamaskChainId = useChainId();
  const accounts = useAccounts();
  const address = accounts ? accounts[0] : undefined;

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    async function initializeConnector() {
      if (metamaskChainId !== ChainId.GOERLI) {
        await connector.activate(ChainId.GOERLI);
      }

      intervalId = setInterval(async () => {
        const balance = await getCurrencyBalance(
          provider as Web3Provider,
          address as string,
          token
        );
        setTokenBalance(parseFloat(balance));
      }, 1000);
    }

    if (connector && provider && address) initializeConnector();

    return () => clearInterval(intervalId);
  }, [token, provider, address]);

  return tokenBalance;
};
