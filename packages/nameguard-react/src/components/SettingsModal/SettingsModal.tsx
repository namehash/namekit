import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

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
      <Dialog as="div" className="ng-relative ng-z-40" onClose={closeModal}>
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
          <Transition.Child
            as={Fragment}
            enter="ng-ease-out ng-duration-300"
            enterFrom="md:ng-opacity-0 md:ng-scale-95"
            enterTo="md:ng-opacity-100 md:ng-scale-100"
            leave="ng-ease-in ng-duration-200"
            leaveFrom="md:ng-opacity-100 md:ng-scale-100"
            leaveTo="md:ng-opacity-0 md:ng-scale-95"
          >
            <div className="ng-relative ng-z-50 ng-flex md:ng-items-center ng-justify-center ng-min-h-screen">
              <Dialog.Panel className="ng-w-full ng-max-w-lg ng-mx-auto ng-relative ng-transform ng-overflow-scroll md:ng-rounded-xl ng-bg-white md:ng-shadow-2xl ng-transition-all ng-flex ng-flex-col">
                <div className="ng-h-[56px] md:ng-h-[68px] ng-flex ng-items-center ng-justify-center md:ng-justify-start ng-shadow md:ng-shadow-none ng-px-6 ng-pb-3 md:ng-pb-0 ng-pt-3 md:ng-pt-2 ng-text-center ng-relative">
                  <Dialog.Title className="ng-font-medium ng-text-lg">
                    Search settings
                  </Dialog.Title>
                  <div className="ng-flex ng-items-center ng-right-0 ng-inset-y-0 ng-absolute ng-pr-6 ng-z-20">
                    <button
                      onClick={closeModal}
                      className="ng-flex ng-items-center ng-justify-between ng-p-2 ng--mr-3 ng-appearance-none ng-bg-transparent hover:ng-bg-black/5 ng-transition ng-rounded-md"
                    >
                      <XMarkIcon className="ng-w-6 ng-h-6 ng-fill-current ng-text-black md:ng-text-gray-400" />
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="ng-px-6 ng-flex ng-flex-col ng-justify-between md:ng-justify-start ng-flex-1 ng-pt-4 md:ng-pt-0"
                >
                  <fieldset className="ng-space-y-4">
                    <legend className="ng-text-gray-500 ng-text-sm ng-leading-6">
                      Adjust these settings based on your preferences.
                    </legend>
                    <div className="ng-space-y-4">
                      <div className="ng-relative ng-flex ng-items-start">
                        <div className="ng-flex ng-h-6 ng-items-center">
                          <input
                            id="attempt-ens-normalization"
                            aria-describedby="attempt-ens-normalization-description"
                            name="attempt-ens-normalization"
                            type="checkbox"
                            className="ng-h-4 ng-w-4 ng-rounded ng-border-black ng-text-black focus:ng-ring-black"
                            checked={localSettings.attemptEnsNormalization}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                attemptEnsNormalization: e.target.checked,
                              }))
                            }
                          />
                        </div>
                        <div className="ng-ml-3 ng-text-sm ng-leading-6">
                          <label
                            htmlFor="attempt-ens-normalization"
                            className="ng-font-medium ng-text-gray-900"
                          >
                            Attempt normalization
                          </label>
                          <p
                            id="attempt-ens-normalization-description"
                            className="ng-text-gray-500 ng-text-sm ng-leading-5"
                          >
                            Attempt ENS Normalization before inspecting search
                            queries. If normalization fails the raw search query
                            will be inspected instead.
                          </p>
                        </div>
                      </div>

                      <div className="ng-relative ng-flex ng-items-start">
                        <div className="ng-flex ng-h-6 ng-items-center">
                          <input
                            id="assume-tld"
                            aria-describedby="assume-tld-description"
                            name="assume-tld"
                            type="checkbox"
                            className="ng-h-4 ng-w-4 ng-rounded ng-border-black ng-text-black focus:ng-ring-black"
                            checked={localSettings.assumedTld === "eth"}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                assumedTld: e.target.checked ? "eth" : null,
                              }))
                            }
                          />
                        </div>
                        <div className="ng-ml-3 ng-text-sm ng-leading-6">
                          <label
                            htmlFor="assume-tld"
                            className="ng-font-medium ng-text-gray-900"
                          >
                            Assume &quot;.eth&quot;
                          </label>
                          <p
                            id="assume-tld-description"
                            className="ng-text-gray-500 ng-text-sm ng-leading-5"
                          >
                            Automatically adds “.eth” as an assumed top-level
                            name.
                          </p>
                        </div>
                      </div>

                      <div className="ng-relative ng-flex ng-items-start">
                        <div className="ng-flex ng-h-6 ng-items-center">
                          <input
                            id="trim-whitespace"
                            aria-describedby="trim-whitespace-description"
                            name="trim-whitespace"
                            type="checkbox"
                            className="ng-h-4 ng-w-4 ng-rounded ng-border-black ng-text-black focus:ng-ring-black"
                            checked={localSettings.trimWhitespace}
                            onChange={(e) =>
                              setLocalSettings((prev) => ({
                                ...prev,
                                trimWhitespace: e.target.checked,
                              }))
                            }
                          />
                        </div>
                        <div className="ng-ml-3 ng-text-sm ng-leading-6">
                          <label
                            htmlFor="ng-trim-whitespace"
                            className="ng-ng-font-medium ng-text-gray-900"
                          >
                            Trim whitespace
                          </label>
                          <p
                            id="trim-whitespace-description"
                            className="ng-text-gray-500 ng-text-sm ng-leading-5"
                          >
                            Remove any leading or trailing whitespace characters
                            before performing inspection.
                          </p>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <div className="ng-flex ng-items-center ng-justify-end ng-space-x-3 ng-mt-8 ng-pb-6">
                    <button
                      className="ng-rounded-md ng-text-sm ng-bg-white ng-shadow-sm ng-border ng-border-gray-300 ng-text-black ng-px-4 ng-py-1.5 ng-font-medium ng-leading-6 ng-transition hover:bg-gray-50"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ng-rounded-md ng-text-sm ng-bg-black ng-border ng-border-black ng-text-white ng-px-4 ng-py-1.5 ng-font-medium ng-leading-6 ng-transition hover:bg-gray-900"
                    >
                      Save
                    </button>
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
