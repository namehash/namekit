"use client";

import { Balancer } from "react-wrap-balancer";
import { PreSectionText } from "@/components/1 - atoms";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Heading, Text } from "@namehash/namekit-react";

export const TheVisionSection = () => {
  const [errorLoadingAnimation, setErrorLoadingAnimation] = useState(false);
  const [animationData, setAnimationData] = useState<null | JSON>(null);

  useEffect(() => {
    fetch("/api/apps-animation")
      .then((animation) => animation.json())
      .then((animationJSON) => setAnimationData(animationJSON))
      .catch((err) => {
        console.log(err);
        setErrorLoadingAnimation(true);
      });
  }, []);

  if (errorLoadingAnimation) return null;

  return (
    <section
      id="theVisionSection"
      className="z-20 bg-white px-5 py-20 w-full flex flex-col relative items-center justify-center overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center gap-3 mb-[60px] lg:mx-10 md:pb-10">
        <PreSectionText>THE VISION</PreSectionText>

        <Heading as="h1">
          <Balancer>
            Bring ENS to millions of people where they already are
          </Balancer>
        </Heading>

        <Text as="p" className="text-lg text-gray-500">
          <Balancer>
            Directly embed ENS onboarding into every wallet, app, and game.
          </Balancer>
        </Text>
      </div>
      <Lottie
        className="w-[460px] h-[204px] xSmall:w-[552px] xSmall:h-[245px] small:w-[668px] small:h-[297px] sm:w-[735px] sm:h-[327px] md:w-[764px] md:h-[339px] medium2x:w-[801px] medium2x:h-[355px] lg:!w-[984px] lg:!h-[437px] xl:!w-[1400px] xl:!h-[622px]"
        animationData={animationData}
        loop={true}
      />
    </section>
  );
};
