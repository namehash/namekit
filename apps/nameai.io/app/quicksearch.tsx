"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@namehash/namekit-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface QuickSearchProps {
  handleClick: (example: string) => void;
}

export function QuickSearch({ handleClick }: QuickSearchProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  const examples = [
    "namechain",
    "ensserviceprovider",
    "makotoinoue",
    "myfamilyandi❤️all12months",
    "spencecoin",
    "chainlinkgod",
    "ceresstation",
    "garypalmerjr",
    "spikewatanabe",
    "fireeyesdao",
    "ethlimo",
    "ensecosystemworkinggroup",
    "adamscochran",
    "proofofattendanceprotocol",
  ];

  useEffect(() => {
    const checkScrollPosition = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setIsAtStart(scrollLeft <= 60);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
      }
    };

    const slider = sliderRef.current;
    slider?.addEventListener("scroll", checkScrollPosition);

    checkScrollPosition();

    return () => {
      slider?.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 350;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 350;
    }
  };

  return (
    <div className="mb-10">
      <p className="text-sm mb-3 text-center text-gray-500">
        or try one of the example labels below
      </p>

      <div className="relative max-w-lg mx-auto h-9 w-full">
        <div className="absolute top-0 z-20 inset-x-0 w-full h-full pointer-events-none shadow-[inset_45px_0_25px_-20px_rgba(249,250,251,0.97),inset_-45px_0_25px_-20px_rgba(249,250,251,0.97)]"></div>

        <div
          className="relative z-10 overflow-x-scroll scrollbar-hide whitespace-nowrap scroll-smooth w-full h-full"
          ref={sliderRef}
        >
          {/* <div className="inline-flex items-center space-x-1 absolute left-0 w-full pl-6 pr-10 z-50 top-4">
            {!isAtStart && (
              <div className="md:hidden fixed left-0 z-50">
                <IconButton onClick={slideLeft} variant="ghost" size="small">
                  <ChevronLeftIcon className="fill-current text-black w-5 h-5" />
                </IconButton>
              </div>
            )}
            {!isAtEnd && (
              <div className="md:hidden fixed right-0 z-50">
                <IconButton onClick={slideRight} variant="ghost" size="small">
                  <ChevronRightIcon className="fill-current text-black w-5 h-5" />
                </IconButton>
              </div>
            )}
          </div> */}
          <div className="w-[200%] group flex flex-nowrap justify-center items-center space-x-1 animate-carousel hover:pause-on-hover">
            {examples.map((example, index) => (
              // @ts-expect-error
              <Button
                key={index}
                variant="secondary"
                size="small"
                onClick={() => handleClick(example)}
                className="!py-1 !px-2 text-sm"
              >
                {example}
              </Button>
            ))}
            {examples.map((example, index) => (
              // @ts-expect-error
              <Button
                key={index}
                variant="secondary"
                size="small"
                onClick={() => handleClick(example)}
                className="!py-1 !px-2 text-sm"
              >
                {example}
              </Button>
            ))}
            <div className="w-5 flex-shrink-0 relative">
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
