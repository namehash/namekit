import React, { Fragment, useRef, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";

import { useSettingsStore } from "../../stores/settings";
import { useSearchStore } from "../../stores/search";
import { useChatModalStore } from "../../stores/chat";

import { Report } from "../Report/Report";
import { SearchModalHeader } from "./SearchModalHeader";
import { SearchModalFooter } from "./SearchModalFooter";

export const SearchModal = () => {
  const { name, modalOpen, closeModal } = useSearchStore();
  const { settings, modalOpen: settingsModalOpen } = useSettingsStore();

  const ref = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (settingsModalOpen) return;

    closeModal();
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [name]);

  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog as="div" onClose={handleClose} className="ng-relative ng-z-20">
        <Transition.Child
          as={Fragment}
          enter="ng-ease-out ng-duration-300"
          enterFrom="ng-opacity-0"
          enterTo="ng-opacity-100"
          leave="ng-ease-in ng-duration-200"
          leaveFrom="ng-opacity-100"
          leaveTo="ng-opacity-0"
        >
          <Dialog.Overlay className="ng-fixed ng-inset-0 ng-bg-black/50 ng-backdrop-blur-sm" />
        </Transition.Child>

        <div className="ng-fixed ng-inset-0 ng-z-20 ng-overflow-y-auto">
          <div className="ng-flex ng-items-start ng-justify-start md:ng-items-start ng-w-full ng-max-w-7xl ng-mx-auto ng-absolute ng-inset-0 md:ng-py-12 md:ng-px-6">
            <Transition.Child
              as={Fragment}
              enter="ng-ease-out ng-duration-300"
              enterFrom="md:ng-opacity-0 md:ng-scale-95"
              enterTo="md:ng-opacity-100 md:ng-scale-100"
              leave="ng-ease-in ng-duration-200"
              leaveFrom="md:ng-opacity-100 md:ng-scale-100"
              leaveTo="md:ng-opacity-0 md:ng-scale-95"
            >
              <Dialog.Panel className="ng-mx-auto ng-w-full ng-relative ng-transform ng-overflow-hidden md:ng-rounded-xl ng-bg-white ng-shadow-2xl ng-transition-all ng-flex ng-flex-col ng-h-full md:ng-h-auto ng-max-h-full ng-pt-[56px] md:ng-pt-[68px]">
                <SearchModalHeader />
                <div
                  className="ng-overflow-y-scroll ng-relative ng-px-6 ng-py-6 md:ng-py-10 ng-h-full"
                  ref={ref}
                >
                  <Report
                    name={name}
                    settings={settings}
                    useChatModalStore={useChatModalStore}
                  />
                </div>
                <SearchModalFooter useChatModalStore={useChatModalStore} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
