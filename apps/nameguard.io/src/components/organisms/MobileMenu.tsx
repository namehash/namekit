"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CalendarButton, NameGuardLogo } from "@/components/atoms";
import { Button, IconButton } from "@namehash/namekit-react";

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
      {/* Hamburguer button  */}

      <IconButton
        className="!p-2"
        onClick={() => toggleMenu()}
        icon={<Bars3Icon className="w-6 h-6 text-black" />}
        variant="ghost"
      />

      {/* Menu Overlay  */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-black z-50 transform ease-in-out transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex w-full justify-between items-center p-4">
            <a
              href="/"
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
            >
              <NameGuardLogo className="text-white" />
            </a>

            <IconButton
              className="!p-2"
              onClick={() => toggleMenu()}
              icon={<XMarkIcon className="w-5 h-5 text-white" />}
            />
          </div>

          <nav className="flex flex-col justify-center flex-grow gap-1 mx-2">
            <a target="_blank" href="https://api.nameguard.io/docs">
              <Button
                onClick={() => {
                  toggleMenu();
                  enableScroll();
                }}
                className="!w-full !justify-start"
              >
                Docs
              </Button>
            </a>
            <a href="https://github.com/namehash/nameguard" target="_blank">
              <Button
                onClick={() => {
                  toggleMenu();
                  enableScroll();
                }}
                className="!w-full !justify-start"
              >
                Github
              </Button>
            </a>
            <a href="/contact">
              <Button
                onClick={() => {
                  toggleMenu();
                  enableScroll();
                }}
                className="!w-full !justify-start"
              >
                Contact
              </Button>
            </a>
          </nav>
          <div className="p-4 w-full flex items-center justify-center">
            <CalendarButton variant="secondary" className="!w-full">
              Discuss an integration
            </CalendarButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
