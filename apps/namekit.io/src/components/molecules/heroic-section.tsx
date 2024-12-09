"use client";

import { DotPattern } from "@/components/atoms/icons/explore-web3-lp/pattern";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { MirrorLogo } from "@/components/atoms/icons/explore-web3-lp/mirror-logo";
import { IconWrapper } from "@/components/atoms/icons/explore-web3-lp/icon-wrapper";
import { NamehashLogo } from "@/components/atoms/icons/explore-web3-lp/namehash-logo";
import { XLogo } from "@/components/atoms/icons/explore-web3-lp/x-logo";
import { CowboyLogo } from "@/components/atoms/icons/explore-web3-lp/cowboy-logo";
import { SkiffLogo } from "@/components/atoms/icons/explore-web3-lp/skiff-logo";
import { DecentralandLogo } from "@/components/atoms/icons/explore-web3-lp/decentraland-logo";
import { MonumentLogo } from "@/components/atoms/icons/explore-web3-lp/monument-logo";

export const HeroicSection = () => {
  return (
    <section className="bg-gradient-colorful px-5 lg:p-0 relative h-screen w-full bg-noise-texture bg-no-repeat bg-cover overflow-hidden">
      <DotPattern className="opacity-5 absolute top-0" />

      <div className="animate-fadeIn z-10 absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-white" />
      <div className="absolute w-full z-20 h-full flex items-center justify-center invisible lg:visible opacity-0 lg:opacity-100">
        <div className=" relative animate-fadeIn border-black border-opacity-10 w-[884px] h-[884px] rounded-full border">
          <Image
            src="/images/explore-web3/rainbow-circle-icon.svg"
            width={80}
            height={80}
            alt="RainbowKit Icon"
            className="animate-fadeIn absolute right-[-30px] top-[340px]"
          />
          <IconWrapper additionalStyle="animate-fadeIn absolute right-[80px] bottom-[100px] bg-[#2081E2]">
            <MirrorLogo />
          </IconWrapper>
          <IconWrapper additionalStyle="animate-fadeIn absolute left-[80px] top-[100px] bg-[#FF8B36]">
            <NamehashLogo />
          </IconWrapper>
          <IconWrapper additionalStyle="animate-fadeIn absolute left-[-40px] bottom-[400px] bg-[#31006E]">
            <XLogo />
          </IconWrapper>
        </div>
      </div>
      <div className="transform-all animate-fadeIn z-20 absolute w-full h-full flex items-center overflow-hidden justify-center invisible opacity-0 lg:visible lg:opacity-100 duration-500 ">
        <div className="animate-fadeIn relative border-black border-opacity-10  w-[1270px] h-[1270px] rounded-[2270px] border">
          <IconWrapper additionalStyle="animate-fadeIn absolute left-[-10px] top-[400px] bg-[#FFEBB8]">
            <CowboyLogo />
          </IconWrapper>
          <IconWrapper additionalStyle="animate-fadeIn absolute left-[10px] bottom-[350px] bg-[#EF5A3C]">
            <SkiffLogo />
          </IconWrapper>
          <DecentralandLogo className="animate-fadeIn absolute right-[-30px] bottom-[472px]" />
          <IconWrapper additionalStyle="animate-fadeIn absolute right-[35px] top-[300px] bg-[#8A63D2]">
            <MonumentLogo />
          </IconWrapper>
        </div>
      </div>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="max-w-screen-sm z-20 h-full flex flex-col items-center justify-center">
          <h1 className="transform-all text-4xl leading-10 lg:leading-[60px] text-center animate-fadeIn duration-500 lg:text-5xl font-extrabold">
            🚀 Explore the Exciting World of Web3
          </h1>
          <p className="transform-all animate-fadeIn duration-500 mt-5 text-center font-inter text-lg lg:text-lg font-light leading-7 text-gray-500">
            Acquiring a .eth name is only the beginning of your web3 journey.
            Explore many of the fun and useful ways to make use of your web3
            identity powered by ENS.
          </p>

          <button
            onClick={() => {
              const target = document.getElementById("target-section");
              if (target) {
                target.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
            className="transform-colors flex justify-center items-center animate-fadeIn duration-300 hover:bg-gray-50 absolute border border-black border-opacity-10 lg:bottom-[110px] bottom-[90px] bg-transparent rounded-full px-20 py-[10px] text-white"
          >
            <ChevronDownIcon className="w-4 text-black font-bold" />
          </button>
        </div>
      </div>
    </section>
  );
};
