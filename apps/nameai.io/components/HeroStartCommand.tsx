"use client";

import { useEffect, useState } from "react";
import { CopyIcon } from "./CopyIcon";
import { CheckIcon } from "@heroicons/react/24/solid";

const npmCommand = "npm install @namehash/nameai";

export function HeroStartCommand() {
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

  const displayCopiedFor = 4000;

  useEffect(() => {
    if (copiedToClipboard) {
      const timer = setTimeout(() => {
        setCopiedToClipboard(false);
      }, displayCopiedFor);
      return () => clearTimeout(timer);
    }
  }, [copiedToClipboard]);

  return (
    <div className="hidden relative z-10 lg:flex items-center gap-2 py-[9px] pl-4 pr-[14px] rounded-lg bg-gray-100 border border-gray-300 sm:gap-3 sm:py-[13px] sm:pl-[20px] sm:pr-[16px]">
      <p className="text-black leading-6 font-normal text-sm sm:text-base">
        {npmCommand}
      </p>

      <div
        className="w-fit h-fit z-10 cursor-pointer"
        onClick={() => {
          setCopiedToClipboard(true);
          navigator.clipboard.writeText(npmCommand);
        }}
      >
        {copiedToClipboard ? (
          <CheckIcon className="w-5 h-5 text-black" />
        ) : (
          <CopyIcon />
        )}
      </div>
    </div>
  );
}
