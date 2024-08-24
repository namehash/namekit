"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "@namehash/namekit-react";
import { CopyIcon } from "@/components/atoms";

const npmCommand = "npm install @namehash/nameguard";

export function HeroStartCommand() {
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

  const copiedText = <>Copied!</>;
  const copyText = <>Copy to Clipboard</>;

  const displayCopiedFor = 4000;

  useEffect(() => {
    setTimeout(() => {
      setCopiedToClipboard(false);
    }, displayCopiedFor);
  }, [copiedToClipboard]);

  return (
    <div className="hidden relative z-10 lg:flex items-center gap-2 py-[9px] pl-4 pr-[14px] rounded-lg bg-black bg-opacity-5 border border-gray-300 sm:gap-3 sm:py-[13px] sm:pl-[20px] sm:pr-[16px]">
      <p className="text-black leading-6 font-normal text-sm sm:text-base">
        {npmCommand}
      </p>
      <Tooltip
        trigger={
          <div
            className="w-fit h-fit z-10 cursor-pointer"
            onClick={() => {
              setCopiedToClipboard(true);
              navigator.clipboard.writeText(npmCommand);
            }}
          >
            <CopyIcon />
          </div>
        }
      >
        {copiedToClipboard ? copiedText : copyText}
      </Tooltip>
    </div>
  );
}
