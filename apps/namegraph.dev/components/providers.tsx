"use client";

import { NameGraphSortOrderOptions } from "@namehash/namegraph-sdk/utils";
import { DEFAULT_PAGE_NUMBER } from "./collections/utils";
import { QueryParamsProvider } from "./use-query-params";
import { NameRelatedCollectionsTabs } from "@/app/name/[name]/name-details-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

export const DEFAULT_SORTING_ORDER = NameGraphSortOrderOptions.AI;
export const DEFAULT_ACTIVE_TAB = NameRelatedCollectionsTabs.ByConcept;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </WagmiProvider>
  );
};
