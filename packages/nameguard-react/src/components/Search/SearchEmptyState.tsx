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
    <div className="ng-w-full ng-px-5 md:ng-px-0 ng-py-16 md:ng-py-32 ng-flex ng-flex-col ng-items-center ng-justify-center ng-text-center ng-h-full ng-space-y-6">
      <div className="ng-relative ng-z-20 ng-space-y-2">
        <p className="ng-text-lg ng-leading-6 ng-font-semibold ng-text-black">
          Search for any ENS name to generate a NameGuard report
        </p>
        <p className="ng-text-sm ng-leading-6 ng-text-gray-500">
          or check out some of the names below to see how it works
        </p>
      </div>

      <div className="ng-relative ng-max-w-3xl ng-mx-auto ng-h-9 ng-w-full">
        <div className="ng-absolute ng-top-0 ng-z-20 ng-inset-x-0 ng-w-full ng-h-full ng-pointer-events-none ng-shadow-[inset_45px_0_25px_-20px_rgba(255,255,255,0.97),inset_-45px_0_25px_-20px_rgba(255,255,255,0.97)]"></div>
        <div
          className="ng-relative ng-z-10 ng-overflow-x-scroll ng-scrollbar-hide ng-whitespace-nowrap ng-scroll-smooth ng-w-full ng-h-full"
          ref={sliderRef}
        >
          <div className="ng-inline-flex ng-items-center ng-space-x-1 ng-absolute ng-left-0 ng-w-full ng-pl-6 ng-pr-10">
            {!isAtStart && (
              <div className="md:ng-hidden ng-fixed ng-left-0 ng-z-50">
                <button
                  className="ng-appearance-none ng-p-2 ng-bg-white ng-flex ng-items-center ng-justify-center"
                  onClick={slideLeft}
                >
                  <ChevronLeftIcon className="ng-fill-current ng-text-black ng-w-5 ng-h-5" />
                </button>
              </div>
            )}
            {!isAtEnd && (
              <div className="md:ng-hidden ng-fixed ng-right-0 ng-z-50">
                <button
                  className="ng-appearance-none ng-p-2 ng-flex ng-items-center ng-justify-center ng-bg-gradient-to-l ng-from-white ng-via-white ng-to-transparent"
                  onClick={slideRight}
                >
                  <ChevronRightIcon className="ng-fill-current ng-text-black ng-w-5 ng-h-5" />
                </button>
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
            <div className="ng-w-5 ng-flex-shrink-0 ng-relative">
              <span className="ng-sr-only"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="ng-fixed ng-inset-0 ng-z-[5] ng-h-full ng-w-full ng-bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] ng-opacity-70"></div>
    </div>
  );
};
