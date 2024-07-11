import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useSearchStore } from "../../stores/search";

export const SearchCloser = () => {
  const { closeModal } = useSearchStore();

  return (
    <button
      onClick={closeModal}
      className="ng-flex ng-items-center ng-justify-between ng-p-2 ng-appearance-none ng-bg-transparent hover:ng-bg-black/5 ng-transition ng-rounded-md"
    >
      <XMarkIcon className="ng-w-6 ng-h-6 ng-fill-current ng-text-black" />
    </button>
  );
};
