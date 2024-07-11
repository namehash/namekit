import React from "react";

import { SearchInput } from "./SearchInput";
import { SearchShield } from "./SearchShield";
import { SearchCloser } from "./SearchCloser";

export const SearchModalHeader = () => {
  return (
    <div className="h-[56px] md:ng-h-[68px] ng-flex items-center ng-justify-between ng-shadow ng-z-40 ng-absolute ng-top-0 ng-inset-x-0 ng-bg-white">
      <div className="ng-flex ng-items-center ng-justify-center ng-flex-shrink-0 ng-px-3 md:ng-px-5">
        <SearchShield />
      </div>

      <div className="ng-w-full ng-flex-1">
        <SearchInput />
      </div>

      <div className="ng-flex ng-items-center ng-justify-center ng-flex-shrink-0 ng-px-3">
        <SearchCloser />
      </div>
    </div>
  );
};
