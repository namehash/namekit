import Image from "next/image";

export function NamespaceLogo() {
  return (
    <div className="flex gap-1 justify-center items-center">
      <Image
        src="/images/namekit/namespace-logo.png"
        alt="namespace logo"
        width={32}
        height={32}
      />
      <p className="text-[18px] font-bold">NameSpace</p>
    </div>
  );
}

export default NamespaceLogo;
