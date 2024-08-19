"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CalButton, NameHashLabsLogo } from "../1 - atoms";
import Link from "next/link";

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
      {/* Hamburguer button  */}
      <button className="block md:hidden" onClick={() => toggleMenu()}>
        <Bars3Icon className="w-6 h-6 text-black" />
      </button>

      {/* Menu Overlay  */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-black z-50 transform ease-in-out transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex w-full justify-between items-center">
            <Link
              href="/"
              aria-label="Home page"
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
            >
              <NameHashLabsLogo className="text-white" />
            </Link>
            <button
              className="p-3 hover:bg-white hover:bg-opacity-10 rounded-[6px] transition-colors duration-200"
              onClick={() => toggleMenu()}
            >
              <XMarkIcon className="w-5 h-5 text-white" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>

          <nav className="flex flex-col justify-center flex-grow gap-1">
            <Link
              className="block text-base leading-6 font-medium py-2 text-white hover:bg-opacity-10 hover:bg-white transition-color duration-300 px-3 rounded-[8px]"
              href="/"
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
            >
              Home
            </Link>
            <Link
              className="block text-base leading-6 font-medium py-2 text-white hover:bg-opacity-10 hover:bg-white transition-color duration-300 px-3 rounded-[8px]"
              href="/ens-referral-program"
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
            >
              ENS Referral Program
            </Link>
            <Link
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
              className="block text-base leading-6 font-medium py-2 text-white hover:bg-opacity-10 hover:bg-white transition-color duration-300 px-3 rounded-[8px]"
              href="/careers"
            >
              Open positions
            </Link>
          </nav>
          <CalButton variant="secondary">Schedule a call</CalButton>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
