"use client";

import { IconMenu, NamekitLogo, GithubIcon } from "../atoms";
import { Popover, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import Link from "next/link";
import cc from "classcat";
import { Button, IconButton } from "@namehash/namekit-react";

export const Header = () => {
  const NamekitMobileNavigationLinks = [
    {
      element: <Link href="/explore-web3">Explore Web3</Link>,
    },
    {
      element: (
        <Link href="https://github.com/namehash/namekit" target="_blank">
          GitHub
        </Link>
      ),
    },
    {
      element: (
        <Link target="_blank" href="https://alpha.namekit.io">
          Try the Alpha
        </Link>
      ),
    },
  ];

  const NamekitDesktopNavigationLinks = [
    {
      element: <>Explore Web3</>,
      href: "/explore-web3",
    },
    {
      element: (
        <div className="flex items-center justify-center gap-2">
          {" "}
          <GithubIcon className="w-6 h-6" />
          GitHub
        </div>
      ),
      href: "https://github.com/namehash/namekit",
    },
  ];

  return (
    <Popover
      as="header"
      className={({ open }) =>
        cc([
          "sticky w-full top-0 z-30 lg:overflow-y-visible",
          {
            "fixed inset-0 bg-black lg:bg-white lg:shadow": open,
            "bg-white shadow": !open,
          },
        ])
      }
    >
      {({ open }) => (
        <Fragment>
          {/* TIP: This component renders 2 different markups, one for mobile and other for desktop devices */}
          <div className="lg:px-0 mx-auto max-w-[1216px] px-6">
            <div className="flex h-[56px] items-center lg:h-[70px]">
              {/* Shared markup */}
              <div
                role="button"
                className={cc([
                  "left-0 top-0 fixed w-screen h-screen z-20",
                  { hidden: !open },
                ])}
              >
                <Popover.Overlay className="fixed inset-0 bg-black opacity-80 z-20 pointer-events-none" />
              </div>

              <div className="inline-flex">
                {/* Mobile markup */}
                <Popover.Button className="lg:hidden relative z-30 mr-4 focus:outline-none focus-visible:outline-2 focus-visible:outline-black">
                  <IconButton variant="ghost">
                    <span className="sr-only">Open menu</span>
                    <IconMenu
                      className="w-5 stroke-current"
                      aria-hidden="true"
                    />
                  </IconButton>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease duration-250 transform"
                  enterFrom="opacity-0 -translate-x-full"
                  enterTo="opacity-100 translate-x-0"
                  leave="transition ease duration-300 transform"
                  leaveFrom="opacity-100 translate-x-0"
                  leaveTo="opacity-0 -translate-x-full"
                >
                  <Popover.Panel className="[min-1180px]:hidden fixed inset-0 z-30 h-full w-4/5 bg-black max-w-[390px]">
                    return (
                    <div className="flex h-full flex-col justify-between">
                      <div className="bg-black w-full justify-between flex absolute p-4 top-0 left-0 max-w-[390px]">
                        <Link href="/">
                          <NamekitLogo
                            textcolor={"white"}
                            backgroundcolor={"black"}
                          />
                        </Link>
                        <Popover.Button>
                          <IconButton>
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon
                              className="block h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </IconButton>
                        </Popover.Button>
                      </div>
                      <div
                        className={cc([
                          "max-[375px]:py-4 pb-[120px] verySmallScreens:block flex flex-col h-full justify-center p-6 pt-[60px] overflow-y-auto scrollbar-styled verySmallScreens:overflow-y-scroll",
                          ,
                        ])}
                      >
                        <ul className="max-[320px]:space-y-3 space-y-6">
                          {NamekitMobileNavigationLinks.map((link, idx) => (
                            <li
                              key={String(link.element) + idx}
                              className="cursor-pointer text-lg font-medium text-white w-full"
                            >
                              <Button className="w-full" asChild>
                                {link.element}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    );
                  </Popover.Panel>
                </Transition>

                {/* Shared markup */}
                <Link
                  href="/"
                  aria-label={"Namekit Logo"}
                  className="focus:outline-none focus-visible:outline-black focus-visible:outline-offset-4 lg:pl-4 xl:pl-0"
                >
                  <NamekitLogo />
                </Link>
              </div>

              {/* Desktop markup */}
              <div className="flex w-full items-center justify-end space-x-2 lg:pr-2 xl:pr-0">
                <IconButton asChild variant="ghost">
                  <Link
                    aria-label="GitHub link"
                    href={"https://github.com/namehash/namekit"}
                    target="_blank"
                    className="p-[7px]"
                  >
                    <GithubIcon className="w-5 h-5 lg:hidden" />
                  </Link>
                </IconButton>

                <nav className="lg:flex hidden lg:items-center">
                  {NamekitDesktopNavigationLinks.map((link, idx) => (
                    <Button variant="ghost" asChild key={idx}>
                      <Link target="_blank" href={link.href}>
                        {link.element}
                      </Link>
                    </Button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Popover>
  );
};
