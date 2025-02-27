import { Button, Link } from "@namehash/namekit-react";

export const OtherSupporters = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-4 bg-white py-8 px-10 border border-gray-200 rounded-[8px] order-last lg:order-none">
      <p className="text-lg leading-6 font-semibold text-center">ENS DAO</p>
      <p className="font-semibold text-center text-[50px] leading-[30px]">💖</p>
      <p className="text-lg leading-6 font-normal text-gray-500">
        and so many others
      </p>
      <Button asChild>
        <Link href="https://snapshot.org/#/ens.eth/proposal/0x6ba81cd2997288cc49ae1b95921ec8f107e8ffb9733321d53d488e2b30710b86">
          View more <Link.ExternalIcon />
        </Link>
      </Button>
    </div>
  );
};
