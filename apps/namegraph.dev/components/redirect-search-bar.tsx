"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@namehash/namekit-react";
import { DebounceInput } from "react-debounce-input";
import { PREFERRED_TLD_LOCALSTORAGE_KEY } from "@/components/collections/utils";

export const RedirectSearchBar = ({
  withTitle,
  withSubmitCta,
}: {
  withTitle: boolean;
  withSubmitCta: boolean;
}) => {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const handleSearch = (e: any) => {
    e.preventDefault();
    router.replace(
      `/collections?collectionsSearch=search_${encodeURIComponent(search)}&tld=suffix_${window.localStorage.getItem(PREFERRED_TLD_LOCALSTORAGE_KEY)}`,
    );
  };
  return (
    <div
      className={`px-5 rounded-[12px] w-full ${withTitle ? "bg-gray-50 my-10 py-4" : ""}`}
    >
      {withTitle ? (
        <p className="text-lg font-semibold mb-4">Explore the NameGraph</p>
      ) : null}
      <form
        onSubmit={(e) => handleSearch(e)}
        className="flex flex-col lg:flex-row lg:space-x-3 space-y-3 lg:space-y-0 items-center"
      >
        <div className="w-full flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <DebounceInput
            value=""
            type="text"
            autoComplete="off"
            debounceTimeout={300}
            placeholder="Type something and press enter key"
            onSubmit={(e: any) => handleSearch(e)}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:outline-none w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-4 pl-9"
          />
        </div>

        {withSubmitCta ? (
          <Button
            onSubmit={(e) => handleSearch(e)}
            className="justify-center"
            variant="primary"
            type="submit"
          >
            Explore
          </Button>
        ) : null}
      </form>
    </div>
  );
};
