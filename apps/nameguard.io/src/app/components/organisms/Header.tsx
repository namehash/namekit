"use client";

import Link from "next/link";
import { GithubIcon } from "@/app/components/atoms/icons/GithubIcon";
import { NGSearchIcon } from "@/app/components/atoms/icons/NGSearchIcon";
import { NGSearch } from "@/app/components/molecules/NGSearch";
import MobileMenu from "./MobileMenu";
import { CalButton } from "../atoms";

export const Header = () => {
  return (
    <header className="sticky bg-white top-0 w-full z-20 border-b border-gray-300 h-[56px] py-[9px] gt_mobile:h-[70px] gt_mobile:py-4 select-none">
      <div className="max-w-7xl mx-auto items-center justify-between flex flex-row px-6">
        <div className="flex flex-row gap-7 justify-between items-center">
          <div className="flex flex-row justify-between items-center gap-1 cursor-pointer">
            <Link
              href="/"
              className="text-black not-italic font-bold text-[22.683px] leading-[22.683px] tracking-[-0.907px] gt_mobile:text-[27.816px] gt_mobile:leading-[27.816px] gt_mobile:tracking-[-1.113px]"
            >
              NameGuard
            </Link>
            <Link href="/">
              <div className="relative -top-1.5 bg-black w-fit h-fit p-[2.8px] rounded-[2.8px] flex-shrink-0">
                <p className="text-white not-italic font-semibold pb-[0.5px] text-[6.857px] leading-[7.619px] gt_mobile:text-[8.409px] gt_mobile:leading-[9.343px]">
                  beta
                </p>
              </div>
            </Link>
          </div>
          <div className="lg:flex gt_mobile:w-full gt_mobile:h-full gt_mobile:p-0 gt_mobile:m-0 hidden">
            <NGSearch />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between md:gap-5 h-[40px]">
          <div className="hidden items-center justify-center lg:flex gap-1">
            <a
              className="px-[10px] py-[9px] not-italic text-black font-medium text-sm leading-5 rounded-md gt_mobile:hover:bg-gray-100"
              href="https://api.nameguard.io/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
            <a
              className="rounded-md gt_mobile:hover:bg-gray-100"
              href="https://github.com/namehash/nameguard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-row justify-between items-center gap-2 py-[7px] px-[10px]">
                <GithubIcon className="hidden md:block text-[#0F172A] fill-current" />
                <p className="not-italic text-black font-medium text-sm leading-5">
                  Github
                </p>
              </div>
            </a>
            <Link
              className="px-[10px] py-[9px] not-italic text-black font-medium text-sm leading-5 rounded-md gt_mobile:hover:bg-gray-100"
              href="/contact"
              rel="noopener noreferrer"
            >
              Contact
            </Link>
            <CalButton className="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-800 transition-all duration-300 whitespace-nowrap">
              Discuss an integration
            </CalButton>
          </div>

          <div className="flex lg:hidden justify-center align-center p-[7px]">
            <NGSearchIcon />
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
};
