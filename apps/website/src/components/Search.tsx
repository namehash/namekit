"use client";

import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import cc from "classcat";
import { useInspectName } from "@namehash/nameguard-react";
import { DebounceInput } from "react-debounce-input";
import { Report } from "@namehash/nameguard-react";

export function Search() {
  const [open, setOpen] = useState(false);
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
          <span>Search for a name</span>
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className={cc([
            "sm:p-0 md:p-20 lg:p-4 lg:pt-32 fixed inset-0 z-30 overflow-y-hidden",
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
            <div className="relative mx-auto max-w-6xl transform divide-y divide-gray-200 overflow-hidden md:rounded-xl bg-white shadow-2xl transition-all">
              <DebounceInput
                debounceTimeout={300}
                type="text"
                placeholder="Enter a name to inspect"
                value={nameToInspect}
                onChange={(event) => setNameToInspect(event.target.value)}
              />

              <div className="max-h-[calc(100vh-58px)] lg:max-h-[64vh] md:max-h-[76vh] overflow-y-auto p-0">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {data && <Report data={data} />}
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
}
