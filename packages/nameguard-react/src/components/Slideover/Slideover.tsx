import React, { forwardRef, Fragment, type Ref, ReactNode } from "react";
import { Transition } from "@headlessui/react";
import { ChevronDoubleRightIcon, XMarkIcon } from "@heroicons/react/24/solid";

type SlideoverProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Slideover = forwardRef(
  (props: SlideoverProps, ref: Ref<HTMLDivElement>) => {
    const { title, isOpen, onClose, children } = props;

    return (
      <Transition.Root show={isOpen} as={Fragment}>
        <div className="fixed z-50 md:z-30 inset-0 overflow-hidden m-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="md:opacity-0 md:translate-x-28"
            enterTo="md:opacity-100 md:translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="md:opacity-100 md:translate-x-0"
            leaveTo="md:opacity-0 md:translate-x-28"
          >
            <div className="relative z-50 md:z-40 flex justify-end h-full md:pt-[68px] md:pb-[53px]">
              <div
                className="w-full lg:max-w-[668px] transform overflow-y-auto bg-white md:shadow-2xl transition-all h-full flex flex-col"
                ref={ref}
              >
                <div className="h-[56px] md:h-[68px] flex items-center justify-center shadow px-6 py-5 relative bg-white z-40">
                  <h2 className="font-medium text-lg">{title}</h2>
                  <div className="flex items-center right-0 md:left-0 md:right-auto inset-y-0 absolute pr-3 md:pr-0 md:pl-3 z-20">
                    <button
                      onClick={onClose}
                      className="flex items-center justify-between p-2 appearance-none bg-transparent hover:bg-black/5 transition rounded-md"
                    >
                      <ChevronDoubleRightIcon className="hidden md:block w-6 h-6 fill-current text-black" />
                      <XMarkIcon className="md:hidden w-6 h-6 fill-current text-black md:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="h-full">{children}</div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>
    );
  }
);

Slideover.displayName = "Slideover";
