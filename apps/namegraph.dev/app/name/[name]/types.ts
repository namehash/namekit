import {
  NameGraphCollection,
  NameGraphFindCollectionsResponse,
  NameGraphSortOrderOptions,
  NameGraphSuggestion,
  ScrambleMethod,
} from "@namehash/namegraph-sdk/utils";

export const DEFAULT_ITEMS_PER_PAGE = 20;

export const NameRelatedCollectionsTabs = {
  ByConcept: "ByConcept",
  ByMembership: "ByMembership",
} as const;

export type NameRelatedCollectionsTabs =
  keyof typeof NameRelatedCollectionsTabs;

export const DEFAULT_ACTIVE_TAB = NameRelatedCollectionsTabs.ByConcept;

export interface PagedCollections {
  [page: number]: CollectionsData | null | undefined;
}

export interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: {
    [K in NameRelatedCollectionsTabs]?: number;
  };
}

export interface SuggestionsData {
  suggestions: NameGraphSuggestion[];
}

export interface CollectionsData {
  sort_order: NameGraphSortOrderOptions;
  related_collections: NameGraphCollection[];
  other_collections: NameGraphCollection[] | null;
}

export interface CollectionState {
  collection: NameGraphCollection | null | undefined;
  collectionMembers: {
    [K in NameRelatedCollectionsTabs]?: PagedCollections;
  };
  relatedCollections: NameGraphFindCollectionsResponse | null | undefined;
  scrambledNameIdeas: NameGraphSuggestion[] | null | undefined;
  sampledNameIdeas: NameGraphSuggestion[] | null | undefined;
}

export interface LoadingState {
  collection: boolean;
  collectionMembers: boolean;
  scramble: boolean;
  ideate: boolean;
}

export interface CollectionsSearchParams {
  search: string;
  page?: number;
  orderBy?: NameGraphSortOrderOptions;
  activeTab?: NameRelatedCollectionsTabs;
}

export const FromScrambleMethodToText: Record<ScrambleMethod, string> = {
  [ScrambleMethod["full-shuffle"]]: "Full Shuffle",
  [ScrambleMethod["left-right-shuffle"]]: "Left - Right Shuffle",
  [ScrambleMethod["left-right-shuffle-with-unigrams"]]:
    "Left - Right Shuffle with Unigrams",
};

export const FromTabNameToTabLabel: {
  [K in NameRelatedCollectionsTabs]: string;
} = {
  ByConcept: "By concept",
  ByMembership: "By membership",
};
