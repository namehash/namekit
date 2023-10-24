import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useSearchSettings, type SearchSettings } from "./use-search-settings";

export function SearchSettingsModal({ open, onClose }: any) {
  const { settings: defaultValues, setSettings } = useSearchSettings();
  const [localSettings, setLocalSettings] =
    useState<SearchSettings>(defaultValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(localSettings);
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        open={open}
        onClose={onClose}
        className="fixed z-50 inset-0 overflow-y-auto"
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
          <div className="relative z-50 flex md:items-center justify-center min-h-screen">
            <div className="w-full max-w-lg mx-auto relative transform overflow-hidden md:rounded-xl bg-white md:shadow-2xl transition-all">
              <div className="flex items-center justify-center shadow md:shadow-none px-6 pb-3 md:pb-0 pt-3 md:pt-2">
                <Dialog.Title className="font-medium text-lg">
                  Search settings
                </Dialog.Title>
                <div className="flex items-center justify-between flex-shrink-0 ml-auto">
                  <button
                    onClick={onClose}
                    className="flex items-center justify-between p-2 -mr-3"
                  >
                    <XMarkIcon className="w-6 h-6 fill-current text-gray-400" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="px-6 flex flex-col justify-between md:justify-start pt-6 md:pt-1"
              >
                <fieldset className="space-y-4">
                  <legend className="text-gray-500 text-sm leading-6">
                    Adjust these settings based on your preferences.
                  </legend>
                  <div className="space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="attempt-normalization"
                          aria-describedby="attempt-normalization-description"
                          name="attempt-normalization"
                          type="checkbox"
                          className="h-4 w-4 rounded border-black text-black focus:ring-black"
                          checked={localSettings.attemptNormalization}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              attemptNormalization: e.target.checked,
                            }))
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor="attempt-normalization"
                          className="font-medium text-gray-900"
                        >
                          Attempt normalization
                        </label>
                        <p
                          id="attempt-normalization-description"
                          className="text-gray-500 text-sm leading-5"
                        >
                          Attempt ENS Normalization before inspecting search
                          queries. If normalization fails the raw search query
                          will be inspected instead.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="assume-eth"
                          aria-describedby="assume-eth-description"
                          name="assume-eth"
                          type="checkbox"
                          className="h-4 w-4 rounded border-black text-black focus:ring-black"
                          checked={localSettings.assumeEth}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              assumeEth: e.target.checked,
                            }))
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor="assume-eth"
                          className="font-medium text-gray-900"
                        >
                          Assume &quot;.eth&quot;
                        </label>
                        <p
                          id="assume-eth-description"
                          className="text-gray-500 text-sm leading-5"
                        >
                          Automatically adds “.eth” as an assumed top-level
                          name.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="trim-whitespace"
                          aria-describedby="trim-whitespace-description"
                          name="trim-whitespace"
                          type="checkbox"
                          className="h-4 w-4 rounded border-black text-black focus:ring-black"
                          checked={localSettings.trimWhitespace}
                          onChange={(e) =>
                            setLocalSettings((prev) => ({
                              ...prev,
                              trimWhitespace: e.target.checked,
                            }))
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor="trim-whitespace"
                          className="font-medium text-gray-900"
                        >
                          Trim whitespace
                        </label>
                        <p
                          id="trim-whitespace-description"
                          className="text-gray-500 text-sm leading-5"
                        >
                          Remove any leading or trailing whitespace characters
                          before performing inspection.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div className="flex items-center justify-end space-x-3 mt-8 pb-6">
                  <button
                    className="rounded-md text-sm bg-white shadow-sm border border-gray-300 text-black px-4 py-1.5 font-medium leading-6"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md text-sm bg-black border border-black text-white px-4 py-1.5 font-medium leading-6"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
