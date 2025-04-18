"use client";

import NextLink from "next/link";
import { Button } from "@namehash/namekit-react";

import { NameHashLabsLogo } from "../1 - atoms";
import MobileMenu from "./mobile-menu";
import { CalendarButton } from "@namehash/internal";

export const Header = () => {
  return (
    <nav className="lg:px-[50px] px-5 w-full h-20 flex items-center justify-center border-b border-black border-opacity-10 z-20">
      <div className="w-full flex items-center justify-between py-5 max-w-[1216px]">
        <NextLink href="/" aria-label="NameHash Labs">
          <NameHashLabsLogo />
        </NextLink>

        <div className="hidden md:flex items-center justify-end gap-3">
          <Button variant="ghost" size="medium" asChild>
            <NextLink href="/ens-v2-referral-programs">
              ENSv2 Referral Programs
            </NextLink>
          </Button>

          <Button
            variant="secondary"
            size="medium"
            asChild
            className="hidden md:block"
          >
            <NextLink href="/careers">Open positions</NextLink>
          </Button>

          <CalendarButton link="namehashlabs/namehashlabs">
            Schedule a call
          </CalendarButton>
        </div>
      </div>
      <MobileMenu />
    </nav>
  );
};
