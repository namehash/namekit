import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { useSearchStore } from "../../stores/search";

export const SearchCloser = () => {
  const { closeModal } = useSearchStore();

  return (
    <button
      onClick={closeModal}
      className="flex items-center justify-between p-2 appearance-none bg-transparent hover:bg-black/5 transition rounded-md"
    >
      <XMarkIcon className="w-6 h-6 fill-current text-black" />
    </button>
  );
};
