"use client";

import { NameGraphSortOrderOptions } from "@namehash/namegraph-sdk/utils";
import { QueryParamsProvider } from "./use-query-params";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import {
  DEFAULT_PAGE_NUMBER,
  NameRelatedCollectionsTabs,
  NameSuggestionsTabs,
} from "./collections/utils";

const queryClient = new QueryClient();

export const DEFAULT_SORTING_ORDER = NameGraphSortOrderOptions.AI;
export const DEFAULT_COLLECTIONS_TAB = NameRelatedCollectionsTabs.ByConcept;
export const DEFAULT_SUGGESTIONS_TAB = NameSuggestionsTabs.Names;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <QueryParamsProvider
          defaultValues={{
            collectionsSearch: {
              search: "",
              page: {
                [NameRelatedCollectionsTabs.ByConcept]: undefined,
                [NameRelatedCollectionsTabs.ByMembership]: undefined,
              },
              tab: DEFAULT_COLLECTIONS_TAB,
              orderBy: NameGraphSortOrderOptions.AI,
            },
            tld: {
              suffix: undefined,
            },
            collectionDetails: {
              page: DEFAULT_PAGE_NUMBER,
            },
            nameDetails: {
              page: {
                [NameRelatedCollectionsTabs.ByConcept]: undefined,
                [NameRelatedCollectionsTabs.ByMembership]: undefined,
              },
              tab: DEFAULT_COLLECTIONS_TAB,
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
