import Image from "next/image";

type Props = {
  account: string;
};

export default function AccountInfo({ account }: Props) {
  return (
    <div className="flex items-center gap-4 px-6 py-2 border-white rounded-lg border-2">
      <Image
        src="/images/tokens/ETH.svg"
        width={20}
        height={20}
        alt="ethereum"
      />
      <span>Ethereum</span>
      <span className="w-4 h-4 bg-primary border-3 rounded-full border-primary-active">
        {" "}
      </span>
      <span>{`${account.substring(0, 6)}...${account.slice(-4)}`}</span>
    </div>
  );
}
