import Image from "next/image";

type Props = {
  token: string;
  selected: boolean;
  setToken?: (token: string) => void;
};

export default function Token({ token, selected, setToken }: Props) {
  return (
    <button
      className={`w-12 h-12 p-1 flex items-center justify-center border rounded-md border-grey hover:bg-grey-hover active:bg-grey-active cursor-pointer ${
        selected && "bg-grey-hover"
      }`}
      onClick={() => {
        setToken && setToken(token);
      }}
    >
      <Image
        width={40}
        height={40}
        src={`/images/tokens/${token}.svg`}
        alt={token}
      />
    </button>
  );
}
