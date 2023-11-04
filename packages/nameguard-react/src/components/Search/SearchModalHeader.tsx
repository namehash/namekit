import React from "react";

import { SearchInput } from "./SearchInput";
import { SearchShield } from "./SearchShield";
import { SearchCloser } from "./SearchCloser";

export const SearchModalHeader = () => {
  return (
    <div className="h-[56px] md:h-[68px] flex items-center justify-between shadow z-40 absolute top-0 inset-x-0 bg-white">
      <div className="flex items-center justify-center flex-shrink-0 px-3 md:px-5">
        <SearchShield />
      </div>

      <div className="w-full flex-1">
        <SearchInput />
      </div>

      <div className="flex items-center justify-center flex-shrink-0 px-3">
        <SearchCloser />
      </div>
    </div>
  );
};
