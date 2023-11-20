import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { useSearchStore } from "../../stores/search";

export const Search = () => {
  const { openModal } = useSearchStore();

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[15px]">
        <MagnifyingGlassIcon className="h-5 w-5 fill-current text-gray-400" />
      </div>
      <button
        onClick={() => openModal()}
        className="w-80 xl:w-96 flex h-10 cursor-text appearance-none items-center justify-between rounded-md border border-gray-300 bg-white py-2 pr-2 pl-10 text-left text-sm text-gray-500 shadow-sm ring-0 hover:border-gray-400 focus:border-gray-300 focus:outline-none focus:ring-0 placeholder-gray-400"
      >
        Inspect any ENS name
      </button>
    </div>
  );
};
