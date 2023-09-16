import Image from "next/image";

export default function Footer() {
  return (
    <div className="my-16">
      <button className="flex items-center gap-2 px-6 py-1 border-white rounded-lg border-2 hover:bg-grey active:bg-grey-active">
        <span className="capitalize">Join our community</span>
        <Image
          src="/images/other/discord.png"
          width={30}
          height={30}
          alt="Join Community"
        />
      </button>
    </div>
  );
}
