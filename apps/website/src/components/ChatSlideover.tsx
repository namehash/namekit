"use client";

import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";
import {
  ChevronDoubleRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

import Avatars from "../../public/avatars.png";

export function ChatSlideover({ open, onClose }: any) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <div className="absolute z-40 inset-0 overflow-hidden">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 backdrop-blur-sm" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-x-28"
          enterTo="opacity-100 translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-28"
        >
          <div className="relative z-40 flex justify-end h-full">
            <div className="w-full lg:max-w-[668px] transform overflow-y-auto bg-white md:shadow-2xl transition-all h-full flex flex-col">
              <div className="flex items-center justify-center shadow px-6 py-5 relative bg-white z-40">
                <h2 className="font-medium text-lg">Search settings</h2>
                <div className="flex items-center left-0 inset-y-0 absolute pl-3 z-20">
                  <button
                    onClick={onClose}
                    className="flex items-center justify-between p-2"
                  >
                    <ChevronDoubleRightIcon className="w-6 h-6 fill-current text-black" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center h-full py-12">
                <div className="space-y-5 text-center">
                  <Image
                    src={Avatars}
                    role="presentation"
                    alt="Avatars"
                    className="h-10 w-auto mx-auto"
                  />
                  <div className="space-y-2">
                    <p className="text-black font-semibold text-lg leading-6">
                      Contact nameguard.eth using XMTP
                    </p>
                    <p className="text-gray-400 leading-5 text-sm">
                      We&apos;re happy to hear your feedback
                    </p>
                  </div>
                  <a
                    href="https://google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-black border border-black text-white px-5 py-2 font-medium leading-6 inline-flex items-center space-x-3"
                  >
                    <span>Open XMTP.chat</span>
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 fill-current" />
                  </a>
                  <p className="text-gray-400 leading-5 text-sm">OR</p>
                  <p className="text-gray-400 leading-6 text-sm">
                    You can contact us using any XMTP chat app, including:{" "}
                    <br />
                    <a
                      href="https://google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-black"
                    >
                      Coinbase Wallet
                    </a>
                    <span className="text-black">&nbsp;and&nbsp;</span>
                    <a
                      href="https://google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-black"
                    >
                      Converse
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
}
