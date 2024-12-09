"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import cc from "classcat";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

enum Color {
  Blue = "blue",
  Red = "red",
  Green = "green",
}

const colors: Color[] = [Color.Red, Color.Blue, Color.Green];

export const BuildUiSection = () => {
  const [colorIndex, setColorIndex] = useState(1);

  return (
    <section className="justify-center relative w-full lg:pt-[100px] pt-10 lg:px-28 px-5 flex items-start overflow-hidden">
      <div className="h-full flex flex-col w-full items-center justify-between z-20">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl leading-8 lg:text-4xl lg:leading-10 font-bold text-center">
            Customize to match your brand and UI
          </h2>
          <p className="mt-5 text-lg leading-7 font-normal text-gray-500 text-center">
            Integrate into your “host app” via UI Kit, SDK, or APIs depending on
            preference
          </p>

          <div className="rounded-[32px] border border-gray-200 bg-white inline-flex p-2 gap-2 lg:mt-8 mt-5">
            <button
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #D63171 0%, #F2A3F6 100%)",
              }}
              onClick={() => {
                setColorIndex(0);
              }}
              className="w-7 rounded-full h-7 flex justify-center items-center"
            >
              {colors[colorIndex] === Color.Red && (
                <CheckIcon className="w-4 h-4 text-white" />
              )}
              <span className="sr-only">Select red UI</span>
            </button>
            <button
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #407FDB 0%, #9EC6FF 100%)",
              }}
              onClick={() => {
                setColorIndex(1);
              }}
              className="w-7 rounded-full h-7 flex justify-center items-center"
            >
              {colors[colorIndex] === Color.Blue && (
                <CheckIcon className="w-4 h-4 text-white" />
              )}
              <span className="sr-only">Select blue UI</span>
            </button>
            <button
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #69E175 0%, #D3FFD8 100%)",
              }}
              onClick={() => {
                setColorIndex(2);
              }}
              className="w-7 rounded-full h-7 flex justify-center items-center"
            >
              {colors[colorIndex] === Color.Green && (
                <CheckIcon className="w-4 h-4 text-white" />
              )}
              <span className="sr-only">Select green UI</span>
            </button>
            <p className="text-gray-500">+ more</p>
          </div>
        </div>
        <div className="relative w-full max-w-[1216px] mt-5 lg:mt-16">
          <button
            onClick={() => {
              setColorIndex((prev) => (prev + 1) % colors.length);
            }}
            className="top-1/2 translate-y-[-20px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 absolute right-[-56px] translate-x-[20px] border rounded-full border-gray-200 p-2.5 z-20"
          >
            <ChevronRightIcon className="h-5 w-5" />
            <span className="sr-only">Move right</span>
          </button>
          <button
            onClick={() => {
              setColorIndex(
                (prev) => (prev - 1 + colors.length) % colors.length,
              );
            }}
            className="flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 absolute left-[-56px] translate-x-[-20px] border rounded-full border-gray-200 p-2.5 top-1/2 translate-y-[-20px] z-20"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="sr-only">Move left</span>
          </button>

          <Image
            width={1216}
            height={640}
            src="/images/namekit/customize-ui-bg-blue.png"
            alt="hero"
            className={cc([
              "transition-all ease-linear duration-300 bottom-0 left-0 w-full",
              colors[colorIndex] === Color.Blue
                ? "opacity-100"
                : "opacity-0 z-[-1] absolute delay-300",
            ])}
          />
          <Image
            width={1216}
            height={640}
            src="/images/namekit/customize-ui-bg-pink.png"
            alt="hero"
            className={cc([
              "transition-all ease-linear duration-300 bottom-0 left-0 w-full",
              colors[colorIndex] === Color.Red
                ? "opacity-100"
                : "opacity-0 z-[-1] absolute delay-300",
            ])}
          />
          <Image
            width={1216}
            height={640}
            src="/images/namekit/customize-ui-bg-green.png"
            alt="hero"
            className={cc([
              "transition-all ease-linear duration-300 bottom-0 left-0 w-full",
              colors[colorIndex] === Color.Green
                ? "opacity-100"
                : "opacity-0 z-[-1] absolute delay-300",
            ])}
          />
        </div>
      </div>
      <div
        className={cc([
          "absolute transition-all duration-300 bottom-0 left-0 w-full h-full",
          colors[colorIndex] === Color.Green
            ? "opacity-100"
            : "opacity-0 z-[-1]",
        ])}
      >
        <div
          style={{
            opacity: 0.15,
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0.05%, #FFFFFF 99.95%), #69E175",
          }}
          className="w-full h-full"
        />
      </div>
      <div
        className={cc([
          "absolute transition-all duration-300 bottom-0 left-0 w-full h-full",
          colors[colorIndex] === Color.Blue
            ? "opacity-100"
            : "opacity-0 z-[-1]",
        ])}
      >
        <div
          style={{
            opacity: 0.15,
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0.05%, #FFFFFF 99.95%), #2081E2",
          }}
          className="absolute transition-all duration-300 bottom-0 left-0 w-full h-full"
        />
      </div>
      <div
        className={cc([
          "absolute transition-all duration-300 bottom-0 left-0 w-full h-full",
          colors[colorIndex] === Color.Red ? "opacity-100" : "opacity-0 z-[-1]",
        ])}
      >
        <div
          style={{
            opacity: 0.15,
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0.05%, #FFFFFF 99.95%), #D63171",
          }}
          className="absolute transition-all duration-300 bottom-0 left-0 w-full h-full"
        />
      </div>
    </section>
  );
};
