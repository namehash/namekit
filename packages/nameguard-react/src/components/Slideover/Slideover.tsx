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
        <div className="ng-fixed ng-z-50 md:ng-z-30 ng-inset-0 ng-overflow-hidden ng-m-0">
          <Transition.Child
            as={Fragment}
            enter="ng-ease-out ng-duration-300"
            enterFrom="ng-opacity-0"
            enterTo="ng-opacity-100"
            leave="ng-ease-in ng-duration-200"
            leaveFrom="ng-opacity-100"
            leaveTo="ng-opacity-0"
          >
            <div className="ng-fixed ng-inset-0" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ng-ease-out ng-duration-300"
            enterFrom="md:ng-opacity-0 md:ng-translate-x-28"
            enterTo="md:ng-opacity-100 md:ng-translate-x-0"
            leave="ng-ease-in ng-duration-200"
            leaveFrom="md:ng-opacity-100 md:ng-translate-x-0"
            leaveTo="md:ng-opacity-0 md:ng-translate-x-28"
          >
            <div className="ng-relative ng-z-50 md:ng-z-40 ng-flex ng-justify-end ng-h-full md:ng-pt-[68px] md:ng-pb-[53px]">
              <div
                className="ng-w-full lg:ng-max-w-[668px] ng-transform ng-overflow-y-auto ng-bg-white md:ng-shadow-2xl ng-transition-all ng-h-full ng-flex ng-flex-col"
                ref={ref}
              >
                <div className="ng-h-[56px] md:ng-h-[68px] ng-flex ng-items-center ng-justify-center ng-shadow ng-px-6 ng-py-5 ng-flex-none ng-relative ng-bg-white ng-z-40">
                  <h2 className="ng-font-medium ng-text-lg">{title}</h2>
                  <div className="ng-flex ng-items-center ng-right-0 md:ng-left-0 md:ng-right-auto ng-inset-y-0 ng-absolute ng-pr-3 md:ng-pr-0 md:ng-pl-3 ng-z-20">
                    <button
                      onClick={onClose}
                      className="ng-flex ng-items-center ng-justify-between ng-p-2 ng-appearance-none ng-bg-transparent hover:ng-bg-black/5 ng-transition ng-rounded-md"
                    >
                      <ChevronDoubleRightIcon className="ng-hidden md:ng-block ng-w-6 ng-h-6 ng-fill-current ng-text-black" />
                      <XMarkIcon className="md:ng-hidden ng-w-6 ng-h-6 ng-fill-current ng-text-black md:ng-text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="ng-h-full">{children}</div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>
    );
  },
);

Slideover.displayName = "Slideover";
