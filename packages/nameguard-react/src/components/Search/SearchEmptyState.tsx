import React, { useRef } from "react";
import useSWR from "swr";
import {
  nameguard,
  type BulkConsolidatedNameGuardReport,
} from "@namehash/nameguard";
import { parseName } from "@namehash/nameparser";

import { NameBadge } from "../NameBadge/NameBadge";
import { useSearchStore } from "../../stores/search";

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

  const { openModal } = useSearchStore();
  const parsedNames = examples.map((n) => parseName(n));

  const { data } = useSWR<BulkConsolidatedNameGuardReport>(
    examples.join(),
    (_) => nameguard.bulkInspectNames(parsedNames.map((n) => n.outputName.name))
  );

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 500;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 500;
    }
  };

  return (
    <div className="w-full px-5 md:px-0 py-16 md:py-32 flex flex-col items-center justify-center text-center h-full">
      <div className="relative z-20 space-y-2">
        <p className="text-lg leading-6 font-semibold text-black">
          Search for any ENS name to generate a NameGuard report
        </p>
        <p className="text-sm leading-6 text-gray-500">
          or check out some of the names below to see how it works
        </p>
      </div>

      <div
        className="max-w-2xl mx-auto relative z-10 overflow-x-scroll py-6 scrollbar-hide whitespace-nowrap scroll-smooth"
        ref={sliderRef}
      >
        <div className="absolute left-0 z-20">
          <button onClick={slideLeft}>&larr;</button>
        </div>
        <div className="inline-flex items-center space-x-1">
          {data?.results?.map((report, index) => (
            <NameBadge
              key={index}
              {...report}
              onClick={() => openModal(report.name)}
            />
          ))}
        </div>
        <div className="absolute right-0 z-20">
          <button onClick={slideRight}>&rarr;</button>
        </div>
      </div>
      <div className="absolute inset-0 z-1 h-full w-full bg-gradient-to-t from-transparent to-white"></div>
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
    </div>
  );
};
