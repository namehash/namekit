"use client";

import { IconButton } from "@namehash/namekit-react";
import { ChevronDown, BeansBg } from "../1 - atoms";
import { Balancer } from "react-wrap-balancer";
import { CalendarButton } from "@namehash/internal";

export const HeroSection = () => {
  return (
    <div className="z-10 bg-white overflow-hidden h-screen w-full flex flex-col relative items-center justify-center landscape:mt-20 tall:landscape:mt-0">
      <div className="flex flex-col items-center max-w-[600px] z-20 animate-fadeIn">
        <h1 className="lg:text-[100px] text-5xl text-center font-bold lg:leading-[120px]">
          Helping ENS grow
        </h1>
        <div
          role="text"
          className="text-lg text-center text-gray-500 font-normal leading-7 mt-4 max-w-[500px]"
        >
          <Balancer>
            We build open source infrastructure to support the global adoption of ENS
          </Balancer>
        </div>
        <div className="flex items-center justify-center mt-10">
          <CalendarButton link="namehashlabs/namehashlabs">
            Integrate with ENS
          </CalendarButton>
        </div>
      </div>
      <BeansBg className="absolute right-0 top-0 h-full w-full z-10 animate-spinSlow" />

      <div
        className="absolute bottom-0 left-0 w-full h-[140px] bg-white z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)",
        }}
      />

      <div
        className="w-[100vw] h-[100vh] absolute opacity-70"
        style={{
          background:
            "linear-gradient(90deg, rgba(221, 160, 233, 0.00) -1.42%, rgba(93, 128, 219, 0.20) 100%), linear-gradient(180deg, #FDE8FB 0%, #DFA4EA 33.33%, #9981D4 64.06%, #9DB9DD 95.83%)",
        }}
      />
      <div className="border rounded-full min-w-[1832px] min-h-[1832px] w-[120vw] h-[120vw] opacity-50 absolute bottom-0 translate-y-[50%] bg-white" />

      <div
        className="min-w-[1440px] min-h-[1440px] w-[95vw] h-[95vw] absolute bottom-0 translate-y-[50%]"
        style={{
          borderRadius: "1401.845px",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.50) 48.96%)",
        }}
      />

      <div className="z-20 absolute bottom-10 landscape:bottom-0 tall:landscape:bottom-0">
        <IconButton
          variant="secondary"
          className="!px-20 !rounded-full"
          size="large"
          onClick={() => {
            const productsSection = document.getElementById("productsSection");
            if (productsSection) {
              productsSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <ChevronDown />
        </IconButton>
      </div>
    </div>
  );
};
