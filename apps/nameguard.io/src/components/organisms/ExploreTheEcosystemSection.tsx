import Image from "next/image";
import { IntegrationIcon } from "@components/atoms";

export function ExploreTheEcosystemSection() {
  return (
    <section className="relative z-10 hidden lg:flex flex-col justify-end items-center gap-[60px] pt-[100px] pb-20 bg-gray-50 box-border">
      <div className="flex flex-col items-center max-w-[1216px] gap-[60px]">
        <div className="flex flex-col justify-center items-center gap-5 max-w-[608px]">
          <div className="inline-flex px-4 py-2 bg-black bg-opacity-5 rounded-3xl gap-2 justify-center items-center z-10">
            <IntegrationIcon />
            <span className="text-black text-center text-sm leading-5 not-italic font-medium z-10">
              Architecture Overview
            </span>
          </div>
          <h1 className="text-black text-center not-italic z-10 text-2xl leading-8 font-bold md:text-4xl md:leading-10">
            Explore the NameGuard ecosystem
          </h1>
          <p className="text-center not-italic text-gray-500 text-lg leading-7 font-normal sm:font-light">
            NameGuard is an ecosystem of libraries and services that work
            together to help keep the web3 community safe.
          </p>
        </div>
        <Image
          src={"/assets/ecosystem_scheme.png"}
          alt="ecosystem image"
          className="z-10 relative w-full h-full max-w-[1820px]"
          width={2592}
          height={1614}
          quality={100}
        />
      </div>
    </section>
  );
}
