"use client";

import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { useCallback, useEffect, useState } from "react";
import AccountInfo from "./AccountInfo";
import SwapPanel from "./SwapPanel";

const [connector, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);
const { useChainId, useAccounts, useIsActive, useProvider } = hooks;

export default function MainPanel() {
  useEffect(() => {
    void connector.connectEagerly().catch(() => {
      console.log("Failed to connect to metamask");
    });
  }, []);

  const chainId = useChainId();
  const accounts = useAccounts();
  const isActive = useIsActive();

  const [Error, setError] = useState<Error | undefined>(undefined);

  const onConnect = useCallback(() => {
    connector
      .activate(parseInt(process.env.chainID || "1"))
      .then(() => {
        setError(undefined);
      })
      .catch(setError);
  }, []);

  return (
    <div className="mt-10 flex flex-col justify-center items-center">
      {isActive ? (
        <>
          {accounts && <AccountInfo account={accounts[0]} />}
          <SwapPanel />
        </>
      ) : (
        <button
          className="py-2 px-8 bg-primary hover:bg-primary-hover active:bg-primary rounded-lg text-black font-semibold capitalize"
          onClick={() => onConnect()}
        >
          Connect Wallet
        </button>
      )}

      {Error && <p className="mt-6 text-error">{Error.message}</p>}
    </div>
  );
}
