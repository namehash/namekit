"use client";

import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import cc from "classcat";
import { useInspectName } from "@namehash/nameguard-react";
import { DebounceInput } from "react-debounce-input";
import { Report } from "@namehash/nameguard-react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

export function Search() {
  const [open, setOpen] = useState(true);
  const [nameToInspect, setNameToInspect] = useState("");

  const onCloseModal = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement && !open) {
      document.activeElement.blur();
    }
  }, [open]);

  const { loading, error, data } = useInspectName(nameToInspect);

  return (
    <Fragment>
      <div className="lg:block relative hidden">
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
          onClose={onCloseModal}
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
            <div className="relative transform overflow-hidden md:rounded-xl bg-white shadow-2xl transition-all">
              <div className="h-[68px] flex items-center shadow-sm px-6 space-x-3">
                <div className="flex items-center justify-center flex-shrink-0">
                  <MagnifyingGlassIcon className="w-5 h-5 fill-current text-gray-500" />
                </div>
                <div className="w-full flex-1">
                  <div className="max-w-6xl mx-auto px-6">
                    <DebounceInput
                      debounceTimeout={300}
                      type="text"
                      placeholder="Enter a name to inspect"
                      value={nameToInspect}
                      onChange={(event) => setNameToInspect(event.target.value)}
                      className="w-full border border-gray-500 bg-gray-100 rounded-lg text-black placeholder-gray-400 px-3 py-2 ring-0 outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center flex-shrink-0">
                  <button
                    onClick={onCloseModal}
                    className="flex items-center justify-between p-2"
                  >
                    <XMarkIcon className="w-5 h-5 fill-current text-black" />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-68px)] md:max-h-[76vh] lg:max-h-[64vh] overflow-y-auto">
                <div className="max-w-6xl mx-auto py-12 space-y-12 px-6">
                  {/* TODO: Move to component */}
                  {!loading && !error && !data && (
                    <div className="w-full py-16 md:py-40 flex-col items-center text-center">
                      <p className="text-[18px] leading-6 font-semibold text-black">
                        Start typing or check out what&apos;s hot
                      </p>
                      <p className="mx-6 mt-3 md:mt-2 mb-5 md:mb-4 text-sm font-normal md:font-medium leading-6 text-gray-500">
                        Check out some collections from the community or start
                        your search
                      </p>
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
                  <a href="#" className="text-sm text-black underline">
                    Chat with us
                  </a>
                  <button className="text-sm text-black underline appearance-none">
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
    </Fragment>
  );
}
