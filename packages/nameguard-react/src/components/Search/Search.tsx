import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { useSearchStore } from "../../stores/search";

export const Search = () => {
  const { openModal } = useSearchStore();

  return (
    <div className="ng-relative">
      <div className="ng-pointer-events-none ng-absolute ng-inset-y-0 ng-left-0 ng-flex ng-items-center ng-pl-[15px]">
        <MagnifyingGlassIcon className="ng-h-5 ng-w-5 ng-fill-current ng-text-gray-400" />
      </div>
      <button
        onClick={() => openModal()}
        className="ng-w-80 xl:ng-w-96 ng-flex ng-h-10 ng-cursor-text ng-appearance-none ng-items-center ng-justify-between ng-rounded-md ng-border ng-border-gray-300 ng-bg-white ng-py-2 ng-pr-2 ng-pl-10 ng-text-left ng-text-sm ng-text-gray-500 ng-shadow-sm ng-ring-0 hover:ng-border-gray-400 focus:ng-border-gray-300 focus:ng-outline-none focus:ng-ring-0 ng-placeholder-gray-400"
      >
        Inspect any ENS name
      </button>
    </div>
  );
};
