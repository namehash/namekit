import React, { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import {
  nameguard,
  type BulkConsolidatedNameGuardReport,
} from "@namehash/nameguard";
import { parseName } from "@namehash/nameparser";

import { NameBadge } from "../NameBadge/NameBadge";
import { useSearchStore } from "../../stores/search";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const examples = [
  "culturecafé.eth",
  "моёт.eth",
  "batman十robin.eth",
  "‍420.eth",
  "0x🥷🏼.eth",
  "metaverse‌.eth",
  "🪼jellyfish.eth",
  "español.eth",
  "‍‍‍‍‍‍😎.eth",
  "gm‍.eth",
  "vitalik‍‍‍.eth",
  "♪♪♪.eth",
  "unknоwn.eth",
  "john🇺🇸",
  "7️⃣7️⃣7️⃣.eth",
];

export const SearchEmptyState = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  const { openModal } = useSearchStore();
  const parsedNames = examples.map((n) => parseName(n));

  const { data, isLoading } = useSWR<BulkConsolidatedNameGuardReport>(
    examples.join(),
    (_) => nameguard.bulkInspectNames(parsedNames.map((n) => n.outputName.name))
  );

  useEffect(() => {
    const checkScrollPosition = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setIsAtStart(scrollLeft <= 0);
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
    <div className="w-full px-5 md:px-0 py-16 md:py-32 flex flex-col items-center justify-center text-center h-full space-y-6">
      <div className="relative z-20 space-y-2">
        <p className="text-lg leading-6 font-semibold text-black">
          Search for any ENS name to generate a NameGuard report
        </p>
        <p className="text-sm leading-6 text-gray-500">
          or check out some of the names below to see how it works
        </p>
      </div>

      <div
        className="max-w-2xl mx-auto relative z-10 overflow-x-scroll h-16 scrollbar-hide whitespace-nowrap scroll-smooth w-full"
        ref={sliderRef}
      >
        <div className="inline-flex items-center space-x-1 absolute left-0 w-full">
          {!isAtStart && (
            <div className="md:hidden fixed left-0 z-50">
              <button
                className="appearance-none p-2 bg-white flex items-center justify-center"
                onClick={slideLeft}
              >
                <ChevronLeftIcon className="fill-current text-black w-5 h-5" />
              </button>
            </div>
          )}
          {!isAtEnd && (
            <div className="md:hidden fixed right-0 z-50">
              <button
                className="appearance-none p-2 flex items-center justify-center bg-gradient-to-l from-white via-white to-transparent"
                onClick={slideRight}
              >
                <ChevronRightIcon className="fill-current text-black w-5 h-5" />
              </button>
            </div>
          )}
          {isLoading &&
            examples.map((e, index) => (
              <NameBadge placeholder={e} key={index} />
            ))}
          {data?.results?.map((report, index) => (
            <NameBadge
              key={index}
              data={report}
              onClick={() => openModal(report.name)}
            />
          ))}
        </div>
      </div>
      <div className="fixed inset-0 z-[5] h-full w-full bg-gradient-to-t from-transparent via-transparent to-white"></div>
      <div className="fixed inset-0 z-[5] h-full w-full bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
    </div>
  );
};
