"use client";

import { useSearchStore } from "@namehash/nameguard-react";
import { Error404IconLarge, Error404IconSmall } from "./atoms";

export default function NotFound() {
  const { openModal } = useSearchStore();

  return (
    <>
      <div className="relative w-full h-[calc(100vh-185px)] gt_mobile:h-[calc(100vh-144px)] flex flex-col justify-center items-center px-5 pt-[108px] pb-[85px] gt_mobile:p-0 bg-error404_background_mobile gt_mobile:bg-error404_background_desktop bg-contain bg-no-repeat ">
        <div className="relative z-10 w-full h-fit max-w-[500px] inline-flex flex-col items-center justify-center gap-10 md:gap-[60px]">
          <Error404IconSmall />
          <Error404IconLarge />
          <div className="w-full h-full flex flex-col items-center justify-center gap-5">
            <div className="w-fit h-fit flex flex-col items-center justify-center gap-3">
              <h2 className="text-black text-center not-italic text-2xl leading-8 font-semibold md:text-4xl md:leading-10 md:font-bold">
                Page not found
              </h2>
              <p className="text-center text-gray-500 not-italic text-base leading-6 font-normal px-10 gt_mobile:px-5 md:px-0 gt_mobile:font-light gt_mobile:text-sm">
                We can&apos;t seem to find the page you&apos;re looking for
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex justify-center items-center px-[17px] py-[9px] bg-white rounded-lg border border-gray-300 shadow-sm pointer-cursor hover:bg-gray-50 transition-colors"
            >
              <p className="text-black text-base leading-6 font-medium gt_mobile:text-sm gt_mobile:leading-5">
                Inspect any ENS name
              </p>
            </button>
          </div>
        </div>
        <div className="fixed inset-0 z-0 h-full w-[100vw] max-w-[100vw] overflow-x-hidden bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
      </div>
    </>
  );
}
