import {
  NameGraphCollection,
  NameGraphSortOrderOptions,
  ScrambleMethod,
} from "@namehash/namegraph-sdk/utils";

export const NameRelatedCollectionsTabs = {
  ByMembership: "ByMembership",
  ByConcept: "ByConcept",
} as const;

export type NameRelatedCollectionsTabs =
  (typeof NameRelatedCollectionsTabs)[keyof typeof NameRelatedCollectionsTabs];

export interface CollectionsData {
  sort_order: NameGraphSortOrderOptions;
  related_collections: NameGraphCollection[];
}

export type TabsCollectionsStorage = Record<
  NameRelatedCollectionsTabs,
  undefined | null | Record<number, CollectionsData | null | undefined>
>;

export interface CollectionsState {
  collections: TabsCollectionsStorage;
  loading: Record<NameRelatedCollectionsTabs, boolean>;
}

export interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: Record<NameRelatedCollectionsTabs, number | undefined>;
}

export interface TabNavigationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface UseCollectionsProps {
  label: string;
  navigationConfig: NavigationConfig;
  onUpdateTotalItems: (tab: NameRelatedCollectionsTabs, total: number) => void;
}

export interface NavigationConfigurations {
  itemsPerPage: number;
  totalItemsNumber: Record<NameRelatedCollectionsTabs, undefined | number>;
}

export const MAX_NUMBER_OF_COLLECTIONS_MEMBERSHIP_IN_NAMEGRAPH_API = 1000;
export const DEFAULT_ITEMS_PER_PAGE = 20;
export const DEFAULT_PAGE_NUMBER = 1;

export const FromScrambleMethodToText: Record<ScrambleMethod, string> = {
  [ScrambleMethod["full-shuffle"]]: "Full Shuffle",
  [ScrambleMethod["left-right-shuffle"]]: "Left - Right Shuffle",
  [ScrambleMethod["left-right-shuffle-with-unigrams"]]:
    "Left - Right Shuffle with Unigrams",
};
