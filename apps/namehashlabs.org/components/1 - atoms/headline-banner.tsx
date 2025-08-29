import { MegaphoneIcon } from "@heroicons/react/24/outline";
import { CalendarButton } from "@namehash/internal";
import { Link } from "@namehash/namekit-react";
import Balancer from "react-wrap-balancer";

export const HeadlineBanner = () => {
  return (
    <div className="px-5 text-white justify-center items-center sm:h-[44px] w-full bg-[#3B0D48] space-x-1 py-4 text-sm relative z-20 flex">
      <div className="flex space-x-3 items-center">
        <MegaphoneIcon className="flex shrink-0 w-6 h-6 opacity-50 -mr-1" />
        <p className=" sm:pr-0">
          <Balancer>Meet us at Devconnect Nov 17-22</Balancer>
        </p>
      </div>

      <CalendarButton
        className="flex items-center"
        asChild
        variant="ghost"
        link="namehashlabs/namehashlabs"
      >
        <Link target="_blank" variant="underline" size="small">
          Book a meeting
        </Link>
      </CalendarButton>
    </div>
  );
};
