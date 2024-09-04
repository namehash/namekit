import React, { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import {
  nameguard,
  type BulkConsolidatedNameGuardReport,
} from "@namehash/nameguard";
import { buildENSName } from "@namehash/ens-utils";

import { ReportModalNameBadge } from "../Report/ReportModalNameBadge";
import { useSearchStore } from "../../stores/search";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@namehash/namekit-react";

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
  "extremelylongnamethatgoesonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandon.eth",
].map((name) => buildENSName(name));

export const SearchEmptyState = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  const { openModal } = useSearchStore();
  const exampleNames = examples.map((n) => n.name);

  const {
    data,
    isLoading,
    error: hadLoadingError,
  } = useSWR<BulkConsolidatedNameGuardReport>(
    exampleNames.join(),
    (_) => nameguard.bulkInspectNames(exampleNames),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

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
    <div className="w-full px-5 md:px-0 py-16 md:py-32 flex flex-col items-center justify-center text-center h-full space-y-6">
      <div className="relative z-20 space-y-2">
        <p className="text-lg leading-6 font-semibold text-black">
          Search for any ENS name to generate a NameGuard report
        </p>
        <p className="text-sm leading-6 text-gray-500">
          or check out some of the names below to see how it works
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto h-9 w-full">
        <div className="z-10 absolute top-0 z-20 inset-x-0 w-full h-full pointer-events-none shadow-[inset_45px_0_25px_-20px_rgba(255,255,255,0.97),inset_-45px_0_25px_-20px_rgba(255,255,255,0.97)]"></div>
        <div
          className="relative z-10 overflow-x-scroll scrollbar-hide whitespace-nowrap scroll-smooth w-full h-full"
          ref={sliderRef}
        >
          <div className="inline-flex items-center space-x-1 absolute left-0 w-full pl-6 pr-10">
            {!isAtStart && (
              <div className="md:hidden fixed left-0 z-50">
                <IconButton
                  onClick={slideLeft}
                  variant="ghost"
                  size="small"
                  className="!p-2"
                  icon={
                    <ChevronLeftIcon className="fill-current text-black w-5 h-5" />
                  }
                />
              </div>
            )}
            {!isAtEnd && (
              <div className="md:hidden fixed right-0 z-50">
                <IconButton
                  onClick={slideRight}
                  variant="ghost"
                  size="small"
                  className="!p-2"
                  icon={
                    <ChevronRightIcon className="fill-current text-black w-5 h-5" />
                  }
                />
              </div>
            )}
            {(hadLoadingError || isLoading) &&
              examples.map((_, index) => (
                <ReportModalNameBadge
                  hadLoadingError={hadLoadingError}
                  ensName={examples[index]}
                  key={index}
                />
              ))}
            {data?.results?.map((report, index) => (
              <ReportModalNameBadge
                key={index}
                hadLoadingError={hadLoadingError}
                ensName={examples[index]}
                data={report}
              />
            ))}
            <div className="w-5 flex-shrink-0 relative">
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-[5] h-full w-full bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
    </div>
  );
};
