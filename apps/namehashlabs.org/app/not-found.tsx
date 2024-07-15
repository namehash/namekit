import { type Metadata } from "next";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import React from "react";

import { Title404 } from "@/components/1 - atoms/404-title";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function NotFound() {
  return (
    <section className="px-5 h-screen w-full flex flex-col relative items-center justify-center overflow-hidden landscape:mt-20 tall:landscape:mt-0">
      <div className="flex flex-col items-center  max-w-[600px] z-20 animate-fadeIn">
        <Title404 className="w-full max-w-[500px] mb-[60px]" />
        <h3 className="text-4xl leading-10 font-bold mb-3">Page not found</h3>
        <div
          role="text"
          className="text-sm leading-6 font-normal text-gray-500"
        >
          <Balancer>
            We can&apos;t seem to find the page you&apos;re looking for
          </Balancer>
        </div>
        <div className="flex items-center justify-center mt-5">
          <Link
            href="/"
            className="py-[9px] hover:bg-gray-50 transition-colors duration-200 px-[17px] border rounded-[8px] flex bg-white border-gray-300 lg:leading-6"
          >
            Back to homepage
          </Link>
        </div>
      </div>
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
    </section>
  );
}
