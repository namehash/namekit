"use client";

import React, { useEffect, useState } from "react";
import {
  BulkConsolidatedNameGuardReport,
  nameguard,
} from "@namehash/nameguard";
import { buildENSName } from "@namehash/ens-utils";
import { ReportModalNameBadge } from "@namehash/nameguard-react";

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

export function HeroCarousel() {
  const [data, setData] = useState<BulkConsolidatedNameGuardReport>();
  const ensNames = examples.map((n) => buildENSName(n));

  useEffect(() => {
    async function fetchData() {
      const result = await nameguard.bulkInspectNames(examples);
      setData(result);
    }

    fetchData();
  }, []);

  if (!data) {
    return <div className="bg-gray-100 rounded-md h-8 w-full"></div>;
  }

  return (
    <div className="w-[200%] group flex flex-nowrap justify-center items-center space-x-1 animate-carousel group-hover:pause-on-hover">
      {/*
        This carousel component needs lots of badges in order
        to look good in the Ui, we are, then, duplicating the
        badges displayed to enhance badges number.
      */}
      {data?.results?.map((report, index) => (
        <ReportModalNameBadge
          name={ensNames[index]}
          data={report}
          displayUnnormalizedNames={true}
          key={`carousel-item-${index}`}
        />
      ))}
      {/*
        This carousel component needs lots of badges in order
        to look good in the Ui, we are, then, duplicating the
        badges displayed to enhance badges number.
      */}
      {data?.results?.map((report, index) => (
        <ReportModalNameBadge
          name={ensNames[index]}
          data={report}
          displayUnnormalizedNames={true}
          key={`carousel-item-${index}`}
        />
      ))}
    </div>
  );
}
