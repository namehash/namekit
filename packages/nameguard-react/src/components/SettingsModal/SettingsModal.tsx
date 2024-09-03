import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button, IconButton } from "@namehash/namekit-react";

import { useSettingsStore, type Settings } from "../../stores/settings";

export const SettingsModal = () => {
  const {
    settings: defaultValues,
    updateSettings,
    modalOpen,
    closeModal,
  } = useSettingsStore();

  const [localSettings, setLocalSettings] = useState<Settings>(defaultValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    closeModal();
  };

  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={closeModal}>
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
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="md:opacity-0 md:scale-95"
            enterTo="md:opacity-100 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="md:opacity-100 md:scale-100"
            leaveTo="md:opacity-0 md:scale-95"
          >
            <div className="relative z-50 flex md:items-center justify-center min-h-screen">
              <Dialog.Panel className="w-full max-w-lg mx-auto relative transform overflow-scroll md:rounded-xl bg-white md:shadow-2xl transition-all flex flex-col">
                <div className="h-[56px] md:h-[68px] flex items-center justify-center md:justify-start shadow md:shadow-none px-6 pb-3 md:pb-0 pt-3 md:pt-2 text-center relative">
                  <Dialog.Title className="font-medium text-lg">
                    Search settings
                  </Dialog.Title>
                  <div className="flex items-center right-0 inset-y-0 absolute pr-6 z-20">
                    <IconButton
                      icon={
                        <XMarkIcon className="w-6 h-6 fill-current text-black md:text-gray-400" />
                      }
                      onClick={closeModal}
                      variant="ghost"
                      className="!p-2"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="px-6 flex flex-col justify-between md:justify-start flex-1 pt-4 md:pt-0"
                >
                  <fieldset className="space-y-4">
                    <legend className="text-gray-500 text-sm leading-6">
                      Adjust these settings based on your preferences.
                    </legend>
                    <div className="space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="attempt-ens-normalization"
                            aria-describedby="attempt-ens-normalization-description"
                            name="attempt-ens-normalization"
                            type="checkbox"
                            className="h-4 w-4 rounded border-black text-black focus:ring-black"
                            checked={localSettings.attemptEnsNormalization}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                attemptEnsNormalization: e.target.checked,
                              }))
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="attempt-ens-normalization"
                            className="font-medium text-gray-900"
                          >
                            Attempt normalization
                          </label>
                          <p
                            id="attempt-ens-normalization-description"
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
                            id="assume-tld"
                            aria-describedby="assume-tld-description"
                            name="assume-tld"
                            type="checkbox"
                            className="h-4 w-4 rounded border-black text-black focus:ring-black"
                            checked={localSettings.assumedTld === "eth"}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                assumedTld: e.target.checked ? "eth" : null,
                              }))
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="assume-tld"
                            className="font-medium text-gray-900"
                          >
                            Assume &quot;.eth&quot;
                          </label>
                          <p
                            id="assume-tld-description"
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
                    <Button variant="secondary" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={closeModal}>
                      Save
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
