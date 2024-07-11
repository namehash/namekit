import React, { ChangeEvent } from "react";

import { useSearchStore } from "../../stores/search";

export const SearchInput = () => {
  const { name, setName } = useSearchStore();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <input
      type="text"
      value={name}
      onChange={handleChange}
      placeholder="Enter a name to inspect"
      className="ng-w-full ng-border ng-border-transparent md:ng-border-gray-500 ng-bg-white md:ng-bg-gray-100 ng-rounded-lg ng-text-black ng-placeholder-gray-400 ng-pl-0 md:ng-pl-3 ng-px-3 ng-py-2 ng-ring-0 ng-outline-none focus:ng-border-transparent md:focus:ng-border-gray-500 focus:ng-ring-0 ng-ens-webfont"
      autoComplete="off"
      spellCheck="false"
    />
  );
};
