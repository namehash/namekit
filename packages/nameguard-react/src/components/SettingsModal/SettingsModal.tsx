import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button, IconButton, Checkbox } from "@namehash/namekit-react";

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
                      onClick={closeModal}
                      variant="ghost"
                      className="!p-2"
                    >
                      <XMarkIcon className="w-6 h-6 fill-current text-black md:text-gray-400" />
                    </IconButton>
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
                      <Checkbox
                        id="attempt-ens-normalization"
                        aria-describedby="attempt-ens-normalization-description"
                        name="attempt-ens-normalization"
                        checked={localSettings.attemptEnsNormalization}
                        label="Attempt normalization"
                        description="Attempt ENS Normalization before inspecting search queries. If normalization fails the raw search query will be inspected instead."
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            attemptEnsNormalization: e.target.checked,
                          }))
                        }
                      />

                      <Checkbox
                        id="assume-tld"
                        aria-describedby="assume-tld-description"
                        name="assume-tld"
                        checked={localSettings.assumedTld === "eth"}
                        label='Assume ".eth"'
                        description="Automatically adds “.eth” as an assumed top-level name."
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            assumedTld: e.target.checked ? "eth" : null,
                          }))
                        }
                      />

                      <Checkbox
                        id="trim-whitespace"
                        aria-describedby="trim-whitespace-description"
                        name="trim-whitespace"
                        checked={localSettings.trimWhitespace}
                        label="Trim whitespace"
                        description="Remove any leading or trailing whitespace characters before performing inspection."
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            trimWhitespace: e.target.checked,
                          }))
                        }
                      />
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
