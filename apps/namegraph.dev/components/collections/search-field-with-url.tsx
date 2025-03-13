"use client";

import { useQueryParams } from "@/components/use-query-params";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchField } from "./search-field";
import { NameRelatedCollectionsTabs, DEFAULT_PAGE_NUMBER } from "./utils";

interface SearchFieldWithUrlProps {
  onSearch?: (value: string) => void;
}

export const SearchFieldWithUrl = ({ onSearch }: SearchFieldWithUrlProps) => {
  const { params, setParams } = useQueryParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (value: string) => {
    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        search: value,
        page: {
          [NameRelatedCollectionsTabs.ByConcept]: DEFAULT_PAGE_NUMBER,
          [NameRelatedCollectionsTabs.ByMembership]: DEFAULT_PAGE_NUMBER,
        },
      },
    });
    onSearch?.(value);

    if (pathname !== "/") {
      goToCollections(value);
    }
  };

  const goToCollections = (value = "") => {
    router.push(
      `/?${new URLSearchParams({
        tld: `suffix_${params.tld.suffix}`,
        collectionsSearch: `search_${params.collectionsSearch.search || value}`,
      }).toString()}`,
    );
  };

  return (
    <SearchField
      search={params.collectionsSearch.search}
      onSearch={handleSearch}
    >
      {params.collectionsSearch.search ? (
        <Button
          onClick={() => handleSearch("")}
          className="bg-white hover:bg-transparent text-black shadow-none p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </SearchField>
  );
};
