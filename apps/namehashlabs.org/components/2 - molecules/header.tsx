"use client";

import { Button, Link } from "@namehash/namekit-react";

import { NameHashLabsLogo, CalendarButton } from "../1 - atoms";
import MobileMenu from "./mobile-menu";

export const Header = () => {
  return (
    <nav className="lg:px-[112px] px-5 w-full h-20 flex items-center justify-center border-b border-black border-opacity-10 z-20">
      <div className="w-full flex items-center justify-between py-5 max-w-[1216px]">
        <Link href="/" aria-label="NameHash Labs">
          <NameHashLabsLogo />
        </Link>

        <div className="flex items-center justify-center gap-3">
          <a href="/ens-referral-program" className="hidden md:block">
            <Button variant="ghost" size="medium">
              ENS Referral Program
            </Button>
          </a>

          <a className="hidden md:block" href="/careers">
            <Button variant="secondary" size="medium">
              Open positions
            </Button>
          </a>

          <div className="hidden md:inline">
            <CalendarButton>Schedule a call</CalendarButton>
          </div>

          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};
