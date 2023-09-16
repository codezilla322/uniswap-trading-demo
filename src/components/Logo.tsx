import Image from "next/image";

export default function Logo() {
  return (
    <div className="lg:w-[1000px] h-64 bg-logoBG bg-center bg-cover flex justify-center items-center mt-10">
      <div className="relative w-[300px] h-[215px]">
        <Image src="/images/logo.png" fill alt="Logo" />
      </div>
    </div>
  );
}
