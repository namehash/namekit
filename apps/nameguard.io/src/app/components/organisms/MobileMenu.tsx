import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Link from "next/link";
import { CalButton } from "../atoms";
import { NameHashLabsLogo } from "../atoms/icons/NamehashLabsLogo";

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
      <button className="block" onClick={() => toggleMenu()}>
        <Bars3Icon className="w-6 h-6 text-black" />
      </button>

      {/* Menu Overlay  */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-black z-50 transform ease-in-out transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex w-full justify-between items-center p-4">
            <Link
              href="/"
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
            </button>
          </div>

          <nav className="flex flex-col justify-center flex-grow gap-1 mx-2">
            <Link
              className="block text-base leading-6 font-medium py-2 text-white hover:bg-opacity-10 hover:bg-white transition-color duration-300 px-3 rounded-[8px]"
              href="https://api.nameguard.io/docs"
              target="_blank"
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
            >
              Docs
            </Link>
            <Link
              className="block text-base leading-6 font-medium py-2 text-white hover:bg-opacity-10 hover:bg-white transition-color duration-300 px-3 rounded-[8px]"
              href="https://github.com/namehash/nameguard"
              target="_blank"
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
            >
              Github
            </Link>
            <Link
              onClick={() => {
                toggleMenu();
                enableScroll();
              }}
              className="block text-base leading-6 font-medium py-2 text-white hover:bg-opacity-10 hover:bg-white transition-color duration-300 px-3 rounded-[8px]"
              href="/contact"
            >
              Contact
            </Link>
          </nav>
          <div className="p-4 w-full flex items-center justify-center">
            <CalButton className="w-full block text-base leading-6 font-medium py-2 text-black bg-white hover:bg-opacity-90 hover:bg-white transition-color duration-300 px-3 rounded-[8px] text-center">
              Discuss an integration
            </CalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
