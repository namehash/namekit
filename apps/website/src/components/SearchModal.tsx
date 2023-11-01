"use client";

import { Fragment, useState, useMemo } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { parseName } from "@namehash/nameparser";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { ChatModal } from "./ChatModal";
import { useSettings } from "./use-settings";
import { useOutsideClick } from "./use-outslide-click";
import { SearchLauncherInput } from "./SearchLauncherInput";
import { SearchFooter } from "./SearchFooter";
import { WritersBlock } from "./WritersBlock";
import { NewReport } from "./NewReport";
import { useChatModal } from "./use-chat-modal";

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { open: settingsOpen, settings } = useSettings();
  const { closeModal: closeChatModal } = useChatModal();

  const parseNameResponse = useMemo(() => {
    return parseName(input, settings);
  }, [input, settings]);

  const handleSearchOpen = () => {
    if (open) return;

    setOpen(true);
  };

  const handleSearchClose = () => {
    if (settingsOpen) return;

    setOpen(false);
    closeChatModal();
  };

  const chatRef = useOutsideClick(closeChatModal);

  const showWritersBlock = parseNameResponse.outputName.name.length === 0;

  return (
    <Fragment>
      <SearchLauncherInput handleClick={handleSearchOpen} />

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" open={open} onClose={handleSearchClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed z-10 inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-20 overflow-y-auto">
            <div className="flex items-start justify-start md:items-start w-full max-w-7xl mx-auto absolute inset-0 md:py-12 md:px-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="mx-auto w-full relative transform overflow-hidden md:rounded-xl bg-white shadow-2xl transition-all flex flex-col h-full md:h-auto max-h-full pb-20 md:pb-0">
                  <div className="h-[56px] md:h-[68px] flex items-center shadow z-40 absolute top-0 inset-x-0 bg-white">
                    <div className="flex items-center justify-center flex-shrink-0 pl-5 pr-3 md:px-5">
                      {/* {data ? (
                    <Shield size="small" status={data.rating} />
                  ) : ( */}
                      <MagnifyingGlassIcon className="w-6 h-6 fill-current text-gray-500" />
                      {/* )} */}
                    </div>
                    <div className="w-full flex-1">
                      <input
                        type="text"
                        placeholder="Enter a name to inspect"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onFocus={closeChatModal}
                        className="w-full border border-transparent md:border-gray-500 bg-white md:bg-gray-100 rounded-lg text-black placeholder-gray-400 pl-0 md:pl-3 px-3 py-2 ring-0 outline-none focus:border-transparent md:focus:border-gray-500 focus:ring-0"
                      />
                    </div>
                    <div className="flex items-center justify-center flex-shrink-0 px-3">
                      <button
                        onClick={handleSearchClose}
                        className="flex items-center justify-between p-2 appearance-none bg-transparent hover:bg-black/5 transition rounded-md"
                      >
                        <XMarkIcon className="w-6 h-6 fill-current text-black" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-scroll relative">
                    <div className="px-6 pt-20 md:py-24 space-y-8 h-full">
                      {showWritersBlock && <WritersBlock />}
                      {!showWritersBlock && (
                        <NewReport name={parseNameResponse} />
                      )}
                    </div>
                  </div>
                  <ChatModal ref={chatRef} />
                  <div className="absolute bottom-0 inset-x-0 z-20">
                    <SearchFooter />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
}
