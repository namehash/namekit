"use client";

import { NameGraphSortOrderOptions } from "@namehash/namegraph-sdk/utils";
import { DEFAULT_PAGE_NUMBER } from "./collections/utils";
import { QueryParamsProvider } from "./use-query-params";
import { NameRelatedCollectionsTabs } from "@/app/name/[name]/name-details-page";

export const DEFAULT_SORTING_ORDER = NameGraphSortOrderOptions.AI;
export const DEFAULT_ACTIVE_TAB = NameRelatedCollectionsTabs.ByConcept;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryParamsProvider
      defaultValues={{
        collectionsSearch: {
          search: "",
          page: DEFAULT_PAGE_NUMBER,
          orderBy: NameGraphSortOrderOptions.AI,
          exactMatch: false,
        },
        tld: {
          suffix: undefined,
        },
        collectionDetails: {
          page: DEFAULT_PAGE_NUMBER,
        },
        nameDetails: {
          page: {
            [NameRelatedCollectionsTabs.ByConcept]: DEFAULT_PAGE_NUMBER,
            [NameRelatedCollectionsTabs.ByMembership]: DEFAULT_PAGE_NUMBER,
          },
          activeTab: DEFAULT_ACTIVE_TAB,
          orderBy: DEFAULT_SORTING_ORDER,
        },
      }}
    >
      {children}
    </QueryParamsProvider>
  );
};
