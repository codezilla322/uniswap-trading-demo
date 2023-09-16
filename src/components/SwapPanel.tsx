import { useState } from "react";
import TokenSelector from "./TokenSelector";

export default function SwapPanel() {
  const [startToken, setStartToken] = useState("ETH");
  const [endToken, setEndToken] = useState("USDT");

  return (
    <div className="w-[600px] mt-6 py-4 flex flex-col justify-center items-center border-2 rounded-xl border-white">
      <h3 className="my-2 text-lg uppercase">
        Select a token to swap with ETH
      </h3>

      <TokenSelector
        startToken={startToken}
        setStartToken={setStartToken}
        endToken={endToken}
        setEndToken={setEndToken}
      />
    </div>
  );
}
