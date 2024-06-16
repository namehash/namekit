import { HeroCarousel } from "./HeroCarousel";
import { HeroStartCommand } from "../molecules/HeroStartCommand";
import { NGSearch } from "../molecules/NGSearch";
import {
  CheckShieldLarge,
  CheckShieldOutline,
  UnknownShieldLargeIcon,
  UnknownShieldSmallIcon,
  WarningShieldLarge,
  WarningShieldOrangeOutline,
  WarningShieldRedOutline,
  WarningShieldSmall,
} from "../atoms";

export function Hero() {
  return (
    <div className="relative bg-hero_background bg-no-repeat bg-center bg-contain">
      <section className="md:min-h-[800px] xl:min-h-[960px] box-border relative z-10 w-full h-full py-[61px] sm:py-24 px-5 flex flex-col items-center justify-center md:px-10 md:pb-32">
        <div className="inline-flex flex-col items-center gap-5 w-full h-fit relative z-20">
          <div className="flex flex-col gap-2 w-fit h-fit">
            <p className="text-center not-italic uppercase text-gray-500 text-xs tracking-[0.3px] font-medium">
              An open source public good
            </p>
            <h1 className="text-black text-center not-italic font-bold text-4xl leading-10 gt_mobile:text-5xl gt_mobile:leading-[52px]">
              Protect your community <br className="hidden md:block" />
              with NameGuard for ENS
            </h1>
          </div>
          <p className="text-center not-italic font-normal text-gray-500 text-lg leading-7 gt_mobile:text-base gt_mobile:leading-6 gt_mobile:font-light">
            Guard your users from heartbreak and keep ENS usage safe across web3
          </p>
          <HeroStartCommand />
          <a
            href="https://api.nameguard.io/docs"
            className="hidden search_bar_change:block relative z-10"
          >
            <button className="flex justify-center items-center px-[25px] py-[13px] rounded-lg bg-black z-10 shadow-sm transition hover:bg-gray-800 cursor-pointer">
              <p className="text-white not-italic font-medium text-base leading-6">
                View the docs
              </p>
            </button>
          </a>
          <div className="flex search_bar_change:hidden flex-col items-center gap-3 self-stretch">
            <NGSearch />
            <p className="w-full h-fit text-gray-500 text-sm leading-6 font-normal text-center gt_mobile:font-light">
              or
            </p>
            <a
              href="https://api.nameguard.io/docs"
              className="relative z-10 w-full h-fit max-w-xs"
            >
              <button className="w-full h-fit box-border flex justify-center items-center self-stretch px-[17px] py-[9px] rounded-lg bg-black z-10 shadow-sm transition hover:bg-gray-800 cursor-pointer">
                <p className="text-white not-italic font-medium text-base leading-6">
                  View the docs
                </p>
              </button>
            </a>
          </div>
        </div>

        <div className="absolute z-0 top-0 left-0 h-full w-full box-border bg-center bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="box-border flex flex-col items-center justify-center w-full h-full">
          <WarningShieldOrangeOutline className="absolute z-10 hidden lg:block top-[5%] left-[20%]" />
          <WarningShieldOrangeOutline className="absolute z-10 hidden lg:block top-[6%] right-[22%]" />
          <CheckShieldLarge className="absolute z-10 hidden xl:block top-[7%] left-[60%]" />
          <WarningShieldSmall className="absolute z-10 hidden lg:block top-[7%] right-[5%]" />
          <UnknownShieldSmallIcon className="absolute z-10 hidden xl:block top-[11%] left-[42%]" />
          <CheckShieldLarge className="absolute z-10 hidden lg:block top-[12%] left-[7%]" />
          <UnknownShieldLargeIcon className="absolute z-10 hidden lg:block top-[18%] right-[12%]" />
          <WarningShieldSmall className="absolute z-10 hidden xl:block top-[37%] left-[20%]" />
          <WarningShieldRedOutline className="absolute z-10 hidden lg:block top-[45%] right-[5%]" />
          <CheckShieldOutline className="absolute z-10 hidden lg:block top-[50%] left-[6%]" />
          <WarningShieldSmall className="absolute z-10 hidden lg:block bottom-[47%] right-[20%]" />
          <UnknownShieldSmallIcon className="absolute z-10 hidden lg:block bottom-[40%] left-[25%]" />
          <WarningShieldLarge className="absolute z-10 hidden lg:block bottom-[22%] left-[6%]" />
          <CheckShieldLarge className="absolute z-10 hidden xl:block bottom-[25%] right-[30%]" />
          <UnknownShieldSmallIcon className="absolute z-10 hidden xl:block bottom-[19%] left-[43%]" />
          <WarningShieldLarge className="absolute z-10 hidden lg:block bottom-[15%] right-[6%]" />
          <WarningShieldRedOutline className="absolute z-10 hidden lg:block bottom-[15%] left-[30%]" />
          <WarningShieldOrangeOutline className="absolute z-10 hidden lg:block bottom-[12%] right-[41%]" />
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-6 space-y-10">
        <p className="text-center not-italic font-light text-gray-500 text-lg leading-7">
          Identify hidden risks or limitations in an ENS name
        </p>
        <div className="relative overflow-x-hidden w-full h-10 group">
          <div className="z-10 absolute top-0 w-full h-full pointer-events-none shadow-[inset_45px_0_25px_-20px_rgba(249,250,251,0.97),inset_-45px_0_25px_-20px_rgba(249,250,251,0.97)]"></div>
          <HeroCarousel />
        </div>
      </div>
    </div>
  );
}
