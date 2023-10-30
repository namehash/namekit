"use client";

import { Fragment, useState, useMemo } from "react";
import { Transition, Dialog } from "@headlessui/react";
import cc from "classcat";
import { parseName, ParsedName } from "@namehash/nameparser";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { ChatModal } from "./ChatModal";
import { useSearchSettings } from "./use-search-settings";
import { useOutsideClick } from "./use-outslide-click";
import { SearchLauncherInput } from "./SearchLauncherInput";
import { SearchFooter } from "./SearchFooter";
import { WritersBlock } from "./WritersBlock";
import { NewReport } from "./NewReport";
import { useChatModal } from "./use-chat-modal";

export function SearchModal() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("ΞSK3NDER");
  const { open: settingsOpen, settings } = useSearchSettings();
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

  const showWritersBlock = parseNameResponse.outputName.name === ".eth";

  return (
    <Fragment>
      <SearchLauncherInput handleClick={handleSearchOpen} />

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className={cc([
            "sm:p-0 md:p-20 lg:p-4 xl:p-16 fixed inset-0 z-30 overflow-y-hidden",
          ])}
          open={open}
          onClose={handleSearchClose}
        >
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
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="max-w-7xl mx-auto relative transform overflow-hidden md:rounded-xl bg-white shadow-2xl transition-all flex flex-col h-full md:h-auto">
              <div className="h-[56px] md:h-[68px] flex items-center shadow relative z-40">
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

              <div className="flex-1 md:max-h-[76vh] lg:max-h-[84vh] overflow-y-auto relative">
                <ChatModal ref={chatRef} />
                <div className="max-w-6xl mx-auto p-6 md:py-12 space-y-8 h-full">
                  {showWritersBlock && <WritersBlock />}
                  {!showWritersBlock && <NewReport name={parseNameResponse} />}
                </div>
              </div>
              <SearchFooter />
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
}
