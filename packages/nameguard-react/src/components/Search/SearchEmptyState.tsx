import React from "react";

import { NameBadge } from "../NameBadge/NameBadge";

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
  return (
    <div className="w-full px-5 md:px-0 py-16 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center h-full">
      <div className="relative z-20 space-y-2">
        <p className="text-lg leading-6 font-semibold text-black">
          Search for any ENS name to generate a NameGuard report
        </p>
        <p className="text-sm leading-6 text-gray-500">
          or check out some of the names below to see how it works
        </p>
      </div>
      <div className="relative z-10">
        {examples.map((name) => (
          <span className="m-1">
            <NameBadge name={name} />
          </span>
        ))}
      </div>
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
    </div>
  );
};
