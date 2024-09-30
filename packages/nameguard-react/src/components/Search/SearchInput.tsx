import React, { ChangeEvent } from "react";

import { useSearchStore } from "../../stores/search";
import { ENSInput } from "@namehash/namekit-react";

export const SearchInput = () => {
  const { name, setName } = useSearchStore();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <ENSInput
      type="text"
      variant="secondary"
      value={name}
      onChange={handleChange}
      placeholder="Enter a name to inspect"
      className="w-full border border-transparent md:border-gray-500 bg-white md:bg-gray-100 rounded-lg text-black placeholder-gray-400 pl-0 md:pl-3 px-3 py-2 ring-0 outline-none focus:border-transparent md:focus:border-gray-500 focus:ring-0 ens-webfont"
      autoComplete="off"
      spellCheck="false"
    />
  );
};
