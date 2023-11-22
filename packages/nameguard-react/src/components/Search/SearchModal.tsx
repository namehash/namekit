import React, { Fragment } from "react";
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

  const handleClose = () => {
    if (settingsModalOpen) return;

    closeModal();
  };

  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex items-start justify-start md:items-start w-full max-w-7xl mx-auto absolute inset-0 md:py-12 md:px-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="md:opacity-0 md:scale-95"
              enterTo="md:opacity-100 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="md:opacity-100 md:scale-100"
              leaveTo="md:opacity-0 md:scale-95"
            >
              <Dialog.Panel className="mx-auto w-full relative transform overflow-hidden md:rounded-xl bg-white shadow-2xl transition-all flex flex-col h-full md:h-auto max-h-full pt-[56px] md:pt-[68px]">
                <SearchModalHeader />
                <div className="overflow-y-scroll relative px-6 py-6 md:py-10 h-full">
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
