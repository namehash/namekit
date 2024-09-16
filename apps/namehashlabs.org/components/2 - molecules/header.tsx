"use client";

import NextLink from "next/link";
import { Button } from "@namehash/namekit-react";

import { NameHashLabsLogo, CalendarButton } from "../1 - atoms";
import MobileMenu from "./mobile-menu";

export const Header = () => {
  return (
    <nav className="lg:px-[112px] px-5 w-full h-20 flex items-center justify-center border-b border-black border-opacity-10 z-20">
      <div className="w-full flex items-center justify-between py-5 max-w-[1216px]">
        <NextLink href="/" aria-label="NameHash Labs">
          <NameHashLabsLogo />
        </NextLink>

        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="medium" asChild>
            <NextLink href="/ens-referral-program" className="hidden md:block">
              ENS Referral Program
            </NextLink>
          </Button>

          <Button variant="secondary" size="medium" asChild>
            <NextLink className="hidden md:block" href="/careers">
              Open positions
            </NextLink>
          </Button>

          <div className="hidden md:inline">
            <CalendarButton>Schedule a call</CalendarButton>
          </div>

          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};
