"use client";

import { useCallback, useEffect, useState } from "react";
import { ChainId } from "@uniswap/sdk-core";

import AccountInfo from "./AccountInfo";
import SwapPanel from "./SwapPanel";
import { getConnector, getHooks } from "@/libs/metamask";

export default function MainPanel() {
  const connector = getConnector();
  const { useIsActive } = getHooks();

  useEffect(() => {
    void connector.connectEagerly().catch(() => {
      console.log("Failed to connect to metamask");
    });
  }, []);

  const isActive = useIsActive();

  const [Error, setError] = useState<Error | undefined>(undefined);

  const onConnect = useCallback(() => {
    connector
      .activate(ChainId.GOERLI)
      .then(() => {
        setError(undefined);
      })
      .catch(setError);
  }, [connector]);

  return (
    <div className="mt-10 flex flex-col justify-center items-center">
      {isActive ? (
        <>
          <AccountInfo />
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

      {Error && (
        <p className="mt-6 text-error">
          {Error.message.slice(0, 40)}
          {"..."}
        </p>
      )}
    </div>
  );
}
