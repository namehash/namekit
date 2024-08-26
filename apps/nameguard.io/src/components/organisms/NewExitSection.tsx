import { NGSearch } from "../molecules/NGSearch";
import { CalendarButton } from "@/components/atoms";

export function NewExitSection() {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center py-5 px-5 gap-5 z-10 bg-white md:bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] md:[background-size:24px_24px] md:px-[112px] lg:pt-10 lg:pb-[45px] lg:flex-row lg:gap-10">
      <div className="m-auto flex items-center justify-center flex-col lg:flex-row w-full max-w-[1216px] gap-10">
        <div className="flex flex-col justify-center items-center h-full max-h-[334px] md:max-h-[315px] w-full max-w-3xl rounded-xl border border-gray-200 bg-generate_raport_background bg-no-repeat bg-top bg-[length:180%_200%] lg:bg-[length:100%_250%]">
          <div className="w-full h-full flex flex-col justify-center items-center gap-6 py-[63px] px-5 box-border lg:py-[60px] lg:max-w-[508px] lg:w-full lg:px-10">
            <div className="flex flex-col gap-4 items-center">
              <h1 className="text-center text-black not-italic text-3xl leading-9 font-bold ">
                Generate a report
              </h1>
              <p className="text-center text-gray-500 not-italic text-lg leading-7 font-normal sm:font-light lg:leading-8">
                Search for any ENS name to generate a report. Share NameGuard
                reports with frENS.
              </p>
            </div>
            <NGSearch />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center h-full max-h-[334px] md:max-h-[315px] w-full max-w-3xl rounded-xl border border-gray-200 bg-in_touch_background bg-no-repeat bg-top bg-[length:180%_200%] lg:bg-[length:100%_250%]">
          <div className="h-full w-full inline-flex flex-col justify-center items-center gap-10 py-10 px-5 box-border flex-shrink-0 lg:max-w-[508px] lg:w-full lg:px-10">
            <div className="flex flex-col h-fit w-full max-w-[295px] sm:max-w-full items-center justify-center gap-6">
              <div className="flex flex-col gap-4 items-center">
                <h1 className="text-center text-black not-italic text-3xl leading-9 font-bold ">
                  Get in touch
                </h1>
                <p className="text-center text-gray-500 not-italic text-lg leading-7 font-normal sm:font-light lg:leading-8">
                  Keep your users safe with NameGuard, the choice of leading
                  web3 teams. Ready for seamless integration into your web3 app?
                  Our team is here to assist you.
                </p>
              </div>
              <CalendarButton variant="secondary">
                Schedule a call
              </CalendarButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
