import Image from "next/image";
import Token from "./Token";

type Props = {
  fromETH: boolean;
  onTokenSwap: () => void;
};

export default function TokenSelector({ fromETH, onTokenSwap }: Props) {
  return (
    <div
      className={`w-full mt-4 flex justify-between ${
        fromETH ? "" : "flex-row-reverse"
      }`}
    >
      <div className="w-[200px] flex justify-center">
        <Token token="ETH" />
      </div>

      <div className="w-[100px] flex justify-center">
        <button onClick={() => onTokenSwap()}>
          <Image
            src="/images/other/swap.svg"
            alt="swap"
            width={30}
            height={30}
          />
        </button>
      </div>

      <div className="w-[200px] flex justify-center">
        <Token token="USDC" />
      </div>
    </div>
  );
}
