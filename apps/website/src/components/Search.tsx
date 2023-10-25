"use client";

import { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import cc from "classcat";
import { DebounceInput } from "react-debounce-input";
import { useInspectName, Report, Shield } from "@namehash/nameguard-react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { ChatSlideover } from "./ChatSlideover";
import { SearchSettingsProvider } from "./use-search-settings";
import { SearchSettingsModal } from "./SearchSettingsModal";
import { useOutsideClick } from "./use-outslide-click";

export function Search() {
  const [open, setOpen] = useState(true);
  const [nameToInspect, setNameToInspect] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleChatClose = () => {
    if (chatOpen) {
      setChatOpen(false);
    }
  };

  const handleSearchClose = () => {
    if (settingsOpen) return;

    setOpen(false);
    setChatOpen(false);
  };

  const chatRef = useOutsideClick(handleChatClose);

  const { loading, error, data } = useInspectName(nameToInspect);

  return (
    <SearchSettingsProvider>
      <Fragment>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-4 w-4 fill-current text-gray-400"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2ZM0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 7.29583 11.5892 8.49572 10.8907 9.47653L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L9.47653 10.8907C8.49572 11.5892 7.29583 12 6 12C2.68629 12 0 9.31371 0 6Z"
              />
            </svg>
          </div>

          <button
            onClick={() => setOpen(true)}
            data-testid="instant-search-button"
            className="w-80 xl:w-96 flex h-10 cursor-text appearance-none items-center justify-between rounded-md border border-gray-300 bg-white py-2 pr-2 pl-9 text-left text-sm text-gray-500 shadow-sm ring-0 hover:border-gray-400 focus:border-gray-300 focus:outline-none focus:ring-0"
          >
            <span>Inspect any ENS name</span>
          </button>
        </div>

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
                  <div className="flex items-center justify-center flex-shrink-0 pl-6 pr-3 md:px-5">
                    {data ? (
                      <Shield size="small" status={data.rating} />
                    ) : (
                      <MagnifyingGlassIcon className="w-6 h-6 fill-current text-gray-500" />
                    )}
                  </div>
                  <div className="w-full flex-1">
                    <DebounceInput
                      debounceTimeout={300}
                      type="text"
                      placeholder="Enter a name to inspect"
                      value={nameToInspect}
                      onChange={(event) => setNameToInspect(event.target.value)}
                      onFocus={() => {
                        if (chatOpen) setChatOpen(false);
                      }}
                      className="w-full border border-transparent md:border-gray-500 bg-white md:bg-gray-100 rounded-lg text-black placeholder-gray-400 pl-0 md:pl-3 px-3 py-2 ring-0 outline-none focus:border-transparent md:focus:border-gray-500"
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

                {/* <div className="max-h-[calc(100vh-120px)] md:max-h-[76vh] lg:max-h-[84vh] overflow-y-auto relative"> */}
                <div className="md:max-h-[76vh] lg:max-h-[84vh] overflow-y-auto relative">
                  <ChatSlideover
                    open={chatOpen}
                    onClose={handleChatClose}
                    ref={chatRef}
                  />
                  <div className="max-w-6xl mx-auto p-6 md:py-12 space-y-8 xl:px-0">
                    {/* TODO: Move to component */}
                    {!loading && !error && !data && (
                      <div className="w-full py-16 md:py-32 lg:py-40 flex-col items-center text-center">
                        <div className="relative z-20 space-y-2">
                          <p className="text-lg leading-6 font-semibold text-black">
                            Search for any ENS name to generate a NameGuard
                            report
                          </p>
                          <p className="text-sm leading-6 text-gray-500">
                            or check out some of the names below to see how it
                            works
                          </p>
                        </div>
                        <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
                      </div>
                    )}
                    {/* TODO: Move to component */}
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {data && <Report data={data} />}
                  </div>
                </div>
                {/* TODO: Move to component */}
                <div className="bg-gray-100 flex items-center justify-between px-5 py-4 border-t border-gray-300">
                  <div className="flex items-center space-x-3">
                    <button
                      className="text-xs text-black underline leading-5 appearance-none"
                      onClick={() => setChatOpen(true)}
                    >
                      Chat with us
                    </button>
                    <button
                      className="text-xs text-black underline leading-5 appearance-none"
                      onClick={() => setSettingsOpen(true)}
                    >
                      Search settings
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Made with ❤️ by{" "}
                    <a
                      href="https://namehash.io"
                      className="text-sm text-black underline"
                    >
                      NameHash
                    </a>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>

        {settingsOpen && (
          <SearchSettingsModal
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </Fragment>
    </SearchSettingsProvider>
  );
}
