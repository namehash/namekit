"use client";

import { Search } from "lucide-react";
import { useRef } from "react";
import { DebounceInput } from "react-debounce-input";

interface SearchFieldProps {
  search: string;
  onSearch: (value: string, submission: boolean) => void;
  children?: React.ReactNode;
}

export const SearchField = ({
  search,
  onSearch,
  children,
}: SearchFieldProps) => {
  const inputRef = useRef(null);

  return (
    <>
      <div className="w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <DebounceInput
          id="query"
          type="text"
          name="query"
          ref={inputRef}
          autoComplete="off"
          value={search || ""}
          debounceTimeout={300}
          placeholder="Type something"
          onChange={(e) => onSearch(e.target.value, false)}
          onKeyDown={() => {
            if (inputRef.current) {
              onSearch((inputRef.current as HTMLInputElement).value, true);
            }
          }}
          className="focus:outline-none w-full text-sm bg-white border border-gray-300 hover:shadow hover:transition transition rounded-md py-2 px-4 pl-9 pr-20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {children}
        </div>
      </div>
    </>
  );
};
