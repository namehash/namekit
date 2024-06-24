import React from "react";

import {
  EmailIcon,
  FarcasterIcon,
  GithubIcon,
  TelegramIcon,
  TwitterIcon,
} from "@components/atoms";

export const Footer = () => {
  return (
    <footer className="z-10 bg-white relative bot-0 w-full h-fit flex flex-col gap-3 py-5 items-center self-stretch md:flex-row sm:justify-between sm:py-6 sm:px-28 sm:self-stretch border-t border-gray-200">
      <p className="not-italic font-normal text-gray-500 text-sm sm:text-footer_text sm:font-light">
        &copy; NameHash Labs. All Rights Reserved
      </p>
      <div className="flex flex-row justify-between gap-3">
        <a
          href="https://twitter.com/NamehashLabs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon className="sm:transition sm:hover:fill-black text-[#AFAFAF] fill-current transition-all duration-200" />
        </a>
        <a
          href="https://github.com/namehash/nameguard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="sm:hover:fill-black text-[#AFAFAF] fill-current transition-all duration-200" />
        </a>

        <a
          href="https://warpcast.com/namehash"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FarcasterIcon className="hover:text-black text-[#AFAFAF] transition-all duration-200" />
        </a>

        <a
          href="https://t.me/namehash"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon className="sm:hover:fill-black text-[#AFAFAF] fill-current transition-all duration-200" />
        </a>
        <a href="mailto:hello@namehashlabs.org">
          <EmailIcon className="sm:hover:fill-black text-[#AFAFAF] fill-current transition-all duration-200" />
        </a>
      </div>
      <p className="not-italic font-normal text-gray-500 text-sm sm:text-footer_text sm:font-light">
        Made with ❤ by{" "}
        <a
          className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
          href="https://namehashlabs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          NameHash Labs
        </a>
      </p>
    </footer>
  );
};
