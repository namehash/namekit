"use client";

import { Balancer } from "react-wrap-balancer";
import Lottie from "lottie-react";
import waveAnimation from "./../../../public/animations/wave-animation.json";
import { PreSectionText, SectionText, SectionTitle } from "@/components/atoms";

export const IntroducingNamekit = () => {
  return (
    <section
      id="introducingNamekit"
      className="bg-white z-20 px-5 py-20 w-full flex flex-col relative items-center justify-center overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center gap-3 mb-[60px] max-w-[650px] md:pb-10">
        <PreSectionText>WHAT WE&apos;RE BUILDING</PreSectionText>
        <SectionTitle>Introducing NameKit</SectionTitle>
        <SectionText className="text-center">
          <Balancer>
            Dedicated 100% to the growth of ENS. NameKit includes sub-modules
            such as ENSNode or NameGuard that can also be used independently.
          </Balancer>
        </SectionText>
      </div>
      <Lottie
        className="w-[480px] h-[212px] xSmall:w-[576px] xSmall:h-[255px] small:w-[634px] small:h-[281px] sm:w-[697px] sm:h-[309px] md:w-[728px] md:h-[323px] medium2x:w-[767px] medium2x:h-[340px] lg:!w-[984px] lg:!h-[437px] xl:!w-[1400px] xl:!h-[622px]"
        animationData={waveAnimation}
        loop={true}
      />
    </section>
  );
};
