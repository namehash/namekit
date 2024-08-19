import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@namehash/namekit-react";

import { useSearchStore } from "../../stores/search";

export const SearchCloser = () => {
  const { closeModal } = useSearchStore();

  return (
    <IconButton
      icon={<XMarkIcon className="w-6 h-6 fill-current text-black" />}
      className="!p-2"
      variant="ghost"
      size="medium"
      onClick={closeModal}
    />
  );
};
