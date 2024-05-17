"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "@namehash/nameguard-react";

import { CopyIcon } from "@/app/atoms/icons/CopyIcon";

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
    <div className="hidden relative z-10 search_bar_change:flex items-center gap-2 py-[9px] pl-4 pr-[14px] rounded-lg bg-black bg-opacity-5 border border-gray-300 gt_mobile:gap-3 gt_mobile:py-[13px] gt_mobile:pl-[20px] gt_mobile:pr-[16px]">
      <p className="text-black leading-6 font-normal text-sm gt_mobile:text-base">
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
