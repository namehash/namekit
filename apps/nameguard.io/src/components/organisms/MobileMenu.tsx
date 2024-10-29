"use client";

import NextLink from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { NameGuardLogo } from "@/components/atoms";
import { Button, IconButton, Link } from "@namehash/namekit-react";
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
    <div className="z-50 lg:hidden">
      <IconButton
        className="-mr-3"
        onClick={() => toggleMenu()}
        variant="ghost"
      >
        <Bars3Icon className="w-5 h-5 text-black" />
      </IconButton>

      <div
        className={`fixed top-0 right-0 w-full h-full bg-black z-50 transform ease-in-out transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex w-full justify-between items-center p-4">
            <NextLink
              href="/"
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
            >
              <NameGuardLogo className="text-white" />
            </NextLink>

            <IconButton className="-mr-1" onClick={() => toggleMenu()}>
              <XMarkIcon className="w-5 h-5 text-white" />
            </IconButton>
          </div>

          <nav className="flex flex-col justify-center flex-grow gap-1 mx-2">
            <Button
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
              className="!w-full !justify-start"
              asChild
            >
              <Link href="https://api.nameguard.io/docs">Docs</Link>
            </Button>

            <Button
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
              className="!w-full !justify-start"
              asChild
            >
              <Link href="https://github.com/namehash/namekit">Github</Link>
            </Button>

            <Button
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
              className="!w-full !justify-start"
              asChild
            >
              <NextLink href="/contact">Contact</NextLink>
            </Button>
          </nav>
          <div className="p-4 w-full flex items-center justify-center">
            <CalendarButton
              variant="secondary"
              className="!w-full"
              link="namehashlabs/nameguard"
            >
              Discuss an integration
            </CalendarButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
