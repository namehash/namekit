"use client";

import Link from "next/link";

import { GithubIcon, NGSearchIcon } from "@/components/atoms";
import { NGSearch } from "@/components/molecules";
import MobileMenu from "./MobileMenu";
import { CalButton } from "../atoms";
import { Button, IconButton } from "@namehash/namekit-react";

export const Header = () => {
  return (
    <header className="sticky bg-white top-0 w-full z-20 border-b border-gray-300 h-[56px] py-[9px] sm:h-[70px] sm:py-4 select-none">
      <div className="max-w-7xl mx-auto items-center justify-between flex flex-row px-6">
        <div className="flex flex-row lg:gap-2 xl:gap-7 justify-between items-center">
          <div className="flex flex-row justify-between items-center gap-1 cursor-pointer">
            <Link
              href="/"
              className="text-black not-italic font-bold text-[22.683px] leading-[22.683px] tracking-[-0.907px] sm:text-[27.816px] sm:leading-[27.816px] sm:tracking-[-1.113px]"
            >
              NameGuard
            </Link>
            <Link href="/">
              <div className="relative -top-1.5 bg-black w-fit h-fit p-[2.8px] rounded-[2.8px] flex-shrink-0">
                <p className="text-white not-italic font-semibold pb-[0.5px] text-[6.857px] leading-[7.619px] sm:text-[8.409px] sm:leading-[9.343px]">
                  beta
                </p>
              </div>
            </Link>
          </div>
          <div className="lg:flex sm:w-full sm:h-full sm:p-0 sm:m-0 hidden">
            <NGSearch />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between md:gap-5 h-[40px]">
          <div className="hidden items-center justify-center lg:flex gap-0.5">
            <a
              href="https://api.nameguard.io/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost">Docs</Button>
            </a>

            <a
              href="https://github.com/namehash/nameguard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton
                variant="ghost"
                icon={
                  <GithubIcon className="hidden md:block text-[#0F172A] fill-current" />
                }
              >
                Github
              </IconButton>
            </a>

            <a href="/contact">
              <Button variant="ghost">Contact</Button>
            </a>

            <CalButton>Discuss an integration</CalButton>
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
