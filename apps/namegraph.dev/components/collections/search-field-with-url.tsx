"use client";

import { useQueryParams } from "@/components/use-query-params";
import { ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchField } from "./search-field";
import { NameRelatedCollectionsTabs } from "@/app/name/[name]/types";
import { DEFAULT_PAGE_NUMBER } from "./utils";

interface SearchFieldWithUrlProps {
  onSearch?: (value: string) => void;
}

export const SearchFieldWithUrl = ({ onSearch }: SearchFieldWithUrlProps) => {
  const { params, setParams } = useQueryParams();
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
  };

  const goToCollections = () => {
    router.push(
      `/?${new URLSearchParams({
        tld: `suffix_${params.tld.suffix}`,
        nameDetails: `page_${params.nameDetails.page}.activeTab_${params.nameDetails.activeTab}.orderBy_${params.nameDetails.orderBy}`,
        collectionsSearch: `search_${params.collectionsSearch.search}.page_${params.collectionsSearch.page}.orderBy_${params.collectionsSearch.orderBy}}`,
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
      <Button
        onClick={goToCollections}
        className="bg-white hover:bg-transparent text-black shadow-none p-0 ml-2"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </SearchField>
  );
};
