import { useState } from "react";
import Image from "next/image";
import Token from "./Token";

type TokenSelectorProps = {
  startToken: string;
  setStartToken: (token: string) => void;
  endToken: string;
  setEndToken: (token: string) => void;
};

export default function TokenSelector({
  startToken,
  setStartToken,
  endToken,
  setEndToken,
}: TokenSelectorProps) {
  const [fromETH, setFromETH] = useState(true);

  const onSwapSelector = () => {
    setFromETH(!fromETH);
    const temp = startToken;
    setStartToken(endToken);
    setEndToken(temp);
  };

  return (
    <div className={`mt-4 flex space-around ${!fromETH && "flex-row-reverse"}`}>
      <div className="w-[200px] flex justify-center">
        <Token token="ETH" selected />
      </div>

      <div className="w-[100px] flex justify-center">
        <button onClick={() => onSwapSelector()}>
          <Image
            src="/images/other/swap.svg"
            alt="swap"
            width={30}
            height={30}
          />
        </button>
      </div>

      <div className="w-[200px] flex justify-center gap-4">
        {["USDT", "WBTC"].map((token) => (
          <Token
            token={token}
            setToken={fromETH ? setEndToken : setStartToken}
            selected={startToken === token || endToken === token}
          />
        ))}
      </div>
    </div>
  );
}
