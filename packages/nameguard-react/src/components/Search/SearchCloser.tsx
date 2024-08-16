import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button } from "@namehash/namekit-react";

import { useSearchStore } from "../../stores/search";

export const SearchCloser = () => {
  const { closeModal } = useSearchStore();

  return (
    <Button className="!p-2" variant="ghost" size="medium" onClick={closeModal}>
      <XMarkIcon className="w-6 h-6 fill-current text-black" />
    </Button>
  );
};
