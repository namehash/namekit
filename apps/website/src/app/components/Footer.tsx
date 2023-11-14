import React from "react";
import { TwitterIcon } from "@/app/components/icons/TwitterIcon";
import { GithubHoverableLogo } from "@/app/components/icons/GithubHoverableLogo";

export const Footer = () => {
  return (
    <footer className="z-10 bg-white relative bot-0 w-full h-fit flex flex-col gap-3 py-5 items-center self-stretch gt_mobile:flex-row gt_mobile:justify-between gt_mobile:py-6 gt_mobile:px-28 gt_mobile:self-stretch border-t border-gray-200">
      <p className="not-italic font-normal text-gray-500 text-sm gt_mobile:text-footer_text gt_mobile:font-light">
        © NameHash Labs. All Rights Reserved
      </p>
      <div className="flex flex-row justify-between gap-3">
        <a href={"https://twitter.com/NamehashLabs"}>
          <TwitterIcon />
        </a>
        <a href={"https://github.com/namehash/nameguard"}>
          <GithubHoverableLogo />
        </a>
      </div>
      <p className="not-italic font-normal text-gray-500 text-sm gt_mobile:text-footer_text gt_mobile:font-light">
        Made with ❤ by{" "}
        <a
          className="text-black underline gt_mobile:underline-offset-[4px] gt_mobile:transition-all gt_mobile:duration-200 gt_mobile:hover:underline-offset-[2px]"
          href={"https://namehashlabs.org"}
        >
          NameHash Labs
        </a>
      </p>
    </footer>
  );
};
