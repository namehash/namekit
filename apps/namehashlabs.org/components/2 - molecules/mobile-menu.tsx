"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import NextLink from "next/link";
import { Button, IconButton } from "@namehash/namekit-react";

import { NameHashLabsLogo } from "../1 - atoms";
import { CalendarButton } from "@namehash/internal";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    if (isOpen) {
      enableScroll();
    } else {
      disableScroll();
    }
    setIsOpen(!isOpen);
  };

  const enableScroll = () => {
    document.body.style.overflow = "";
  };

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };

  return (
    <div className="z-50">
      <div className="block md:hidden">
        <IconButton variant="ghost" onClick={() => toggleMenu()}>
          <Bars3Icon className="w-6 h-6 text-black" />
        </IconButton>
      </div>

      <div
        className={`fixed top-0 right-0 w-full h-full bg-black z-50 transform ease-in-out transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex w-full justify-between items-center">
            <NextLink
              href="/"
              aria-label="Home page"
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
            >
              <NameHashLabsLogo className="text-white" />
            </NextLink>
            <IconButton onClick={() => toggleMenu()} className="-mr-1">
              <XMarkIcon className="w-5 h-5 text-white" />
              <span className="sr-only">Toggle menu</span>
            </IconButton>
          </div>

          <nav className="flex flex-col justify-center flex-grow gap-1">
            <Button variant="primary" asChild>
              <NextLink
                href="/"
                onClick={() => {
                  toggleMenu();
                  enableScroll();
                }}
              >
                Home
              </NextLink>
            </Button>
            <Button variant="primary" asChild>
              <NextLink
                href="/ens-referral-program"
                onClick={() => {
                  toggleMenu();
                  enableScroll();
                }}
              >
                ENS Referral Program
              </NextLink>
            </Button>
            <Button variant="primary" asChild>
              <NextLink
                onClick={() => {
                  toggleMenu();
                  enableScroll();
                }}
                href="/careers"
              >
                Open positions
              </NextLink>
            </Button>
          </nav>
          <CalendarButton link="namehashlabs/namehashlabs" variant="secondary">
            Schedule a call
          </CalendarButton>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
