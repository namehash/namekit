"use client";

import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

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
    <section className="text-center px-5 py-20 w-full flex flex-col relative items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-3 mb-[60px] lg:mx-10 md:pb-10">
        <div className="px-4 py-2 gap-2 bg-black bg-opacity-5 flex border rounded-full">
          <RocketLaunchIcon className="w-5 h-5 text-gray-500" />
          <p className="text-sm leading-5 font-medium">The vision</p>
        </div>
        <h2 className="text-4xl leading-10 font-bold">
          Bring ENS to millions of people where they already are
        </h2>
        <p className="text-lg leading-7 font-normal text-gray-500">
          Directly embed ENS onboarding into every wallet, app, and game.
        </p>
      </div>
      <Lottie
        className="xSmall:w-[552px] xSmall:h-[245px] small:w-[668px] small:h-[297px] medium2x:w-[801px] medium2x:h-[355px] w-[460px] h-[204px] sm:w-[735px] sm:h-[327px] md:w-[764px] md:h-[339px] lg:w-[984px] lg:h-[437px] xl:w-[1400px] xl:h-[622px]"
        animationData={animationData}
        loop={true}
      />
    </section>
  );
};
