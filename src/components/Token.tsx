import Image from "next/image";

type Props = {
  token: string;
};

export default function Token({ token }: Props) {
  return (
    <button className="w-12 h-12 p-1 flex items-center justify-center border rounded-md border-grey hover:bg-grey-hover cursor-pointer">
      <Image
        width={40}
        height={40}
        src={`/images/tokens/${token}.svg`}
        alt={token}
      />
    </button>
  );
}
