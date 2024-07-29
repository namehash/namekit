"use client";

import Link from "next/link";

import { NameHashLabsLogo, CalButton } from "../1 - atoms";
import MobileMenu from "./mobile-menu";

export const Header = () => {
  return (
    <nav className="lg:px-[112px] px-5 w-full h-20 flex items-center justify-center border-b border-black border-opacity-10 z-20">
      <div className="w-full flex items-center justify-between py-5 max-w-[1216px]">
        <Link href="/" aria-label="NameHash Labs">
          <NameHashLabsLogo />
        </Link>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/ens-referral-program"
            className="hidden md:block mr-[18px] hover:underline transition text-sm font-medium"
          >
            ENS Referral Program
          </Link>
          <Link
            href="/careers"
            className="hidden md:inline px-[16px] py-[9px] bg-white text-black border border-gray-300 rounded-[8px] text-sm leading-5 font-medium hover:bg-gray-50 transition-colors duration-200"
            style={{
              boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            }}
          >
            Open positions
          </Link>
          <CalButton className="hidden md:inline px-[16px] py-[9px] bg-black text-white border border-black rounded-[8px] text-sm leading-5 font-medium hover:bg-gray-800 transition-colors duration-200">
            Schedule a call
          </CalButton>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};
