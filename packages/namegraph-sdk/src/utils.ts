/**
 * NameGraph default endpoint
 **/
export const DEFAULT_ENDPOINT = "https://api.namegraph.dev/";

/**
 * NameGraph grouping categories
 **/
export const NameGraphGroupingCategory = {
  related: "related",
  wordplay: "wordplay",
  alternates: "alternates",
  emojify: "emojify",
  community: "community",
  expand: "expand",
  gowild: "gowild",
  other: "other",
} as const;

export type NameGraphGroupingCategory =
  (typeof NameGraphGroupingCategory)[keyof typeof NameGraphGroupingCategory];

/**
 * NameGraph params for querying grouping categories suggestions
 **/
export type NameGraphGroupingCategoryParams = {
  min_suggestions: number;
  max_suggestions: number;
};

export type NameGraphOtherCategoryParams = NameGraphGroupingCategoryParams & {
  min_total_suggestions: number;
};

export type NameGraphRelatedCategoryParams = {
  max_related_collections: number;
  max_labels_per_related_collection: number;
  max_recursive_related_collections: number;
  enable_learning_to_rank: boolean;
  label_diversity_ratio: number | null;
  max_per_type: number | null;
};

export type TypedNameGraphGroupingCategoriesParams = {
  [NameGraphGroupingCategory.related]: NameGraphRelatedCategoryParams;
  [NameGraphGroupingCategory.wordplay]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.alternates]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.emojify]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.community]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.expand]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.gowild]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.other]: NameGraphOtherCategoryParams;
};

/**
 * NameGraph API Response types
 **/
export type NameGraphSuggestion = {
  label: string;
  tokenized_label: string[];
  metadata: {
    pipeline_name: string;
    interpretation: (string | null)[];
    cached_status: string;
    categories: string[];
    cached_sort_score: number | null;
    applied_strategies: string[][];
    collection_title: string | null;
    collection_id: string | null;
    grouping_category: string | null;
  };
};

export type NameGraphRelatedCollectionResponse = {
  collection_id: string;
  collection_title: string;
  collection_members_count: number;
};

export type NameGraphGroupedByCategoryResponse = {
  categories: NameGraphFetchTopCollectionMembersResponse[];
  all_tokenizations: string[][];
};

export type NameGraphFetchTopCollectionMembersResponse = {
  suggestions: NameGraphSuggestion[];
  name: string;
  type: string;
  collection_id?: string;
  collection_title?: string;
  collection_members_count?: number;
  related_collections?: NameGraphRelatedCollectionResponse[];
};

export type NameGraphCountCollectionsResponse = {
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  count: number;
};

export type NameGraphCollectionByMemberResponse = {
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  collections: NameGraphCollection[];
};

export type NameGraphCollection = {
  collection_id: string;
  title: string;
  owner: string;
  number_of_labels: number;
  last_updated_timestamp: number;
  top_labels: [
    {
      label: string;
    },
  ];
  types: [string];
  avatar_emoji: string;
  avatar_image: string;
};

export type NameGraphFindCollectionsResponse = {
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  related_collections: NameGraphCollection[];
  other_collections: NameGraphCollection[];
};

/**
 * NameGraph Class related code
 **/
export class NameGraphError extends Error {
  constructor(
    public status: number,
    message?: string,
  ) {
    super(message);
  }
}

export type NameGraphOptions = {
  namegraphEndpoint?: string;
};

/**
 * NameGraph Endpoints related code
 **/
export const DEFAULT_METADATA = true;
export const DEFAULT_MIN_SUGGESTIONS = 100;
export const DEFAULT_MAX_SUGGESTIONS = 100;
export const DEFAULT_FULL_MODE = "full";
export const DEFAULT_INSTANT_MODE = "instant";
export const DEFAULT_ENABLE_LEARNING_TO_RANK = true;
export const DEFAULT_LABEL_DIVERSITY_RATIO = 0.5;
export const DEFAULT_MAX_PER_TYPE = 2;
export const NameGraphSortOrderOptions = {
  /** Use intelligent endpoint-specific ranking (e.g. with Learning to Rank) */
  AI: "AI",
  /** Sort by title alphabetically ascending */
  AZ: "A-Z",
  /** Sort by title alphabetically descending */
  ZA: "Z-A",
  /** Use relevance ranking */
  RELEVANCE: "Relevance",
} as const;
export type NameGraphSortOrderOptions =
  (typeof NameGraphSortOrderOptions)[keyof typeof NameGraphSortOrderOptions];

/**
 * Writers block suggestions and collections
 */
export type WritersBlockSuggestion = {
  collectionName: string;
  suggestedName: string;
  tokenizedSuggestedName: string[];
};

export type WritersBlockName = {
  normalized_name: string;
  tokenized_name: string[];
};

export type WritersBlockCollection = {
  collection_id: string;
  collection_name: string;
  names: WritersBlockName[];
};

const getRandomElementOfArray = <Type>(array: Type[]): Type =>
  array[Math.floor(Math.random() * array.length)];

const getRandomWritersBlockSuggestion = (
  array: WritersBlockCollection[],
): WritersBlockSuggestion => {
  const rawWritersBlockSuggestion = getRandomElementOfArray(array);
  const rawName = getRandomElementOfArray(rawWritersBlockSuggestion.names);
  return {
    collectionName: rawWritersBlockSuggestion.collection_name,
    suggestedName: rawName.normalized_name,
    tokenizedSuggestedName: rawName.tokenized_name,
  };
};

/**
 * Gets one suggestion for each catalog's collections until suggestionsCount is reached.
 * @param suggestionsCount max suggestions that will be returned
 * @param catalog a catalog of collections to be sampled
 * @returns an array of suggestions based on the catalog given. If no catalog is given, default catalog is used.
 */
export const sampleWritersBlockSuggestions = (
  suggestionsCount: number,
  catalog: WritersBlockCollection[],
): WritersBlockSuggestion[] => {
  const uniqueCollectionsNames = new Set();
  const uniqueSuggestionsNames = new Set();
  const result = [];

  while (
    result.length !== suggestionsCount &&
    result.length !== catalog.length
  ) {
    const writersBlockSuggestion = getRandomWritersBlockSuggestion(catalog);

    if (
      uniqueCollectionsNames.has(writersBlockSuggestion.collectionName) ||
      uniqueSuggestionsNames.has(writersBlockSuggestion.suggestedName)
    ) {
      continue;
    } else {
      uniqueCollectionsNames.add(writersBlockSuggestion.collectionName);
      uniqueSuggestionsNames.add(writersBlockSuggestion.suggestedName);
      result.push(writersBlockSuggestion);
    }
  }

  return result;
};

export const ScrambleMethod = {
  "left-right-shuffle": "left-right-shuffle",
  "left-right-shuffle-with-unigrams": "left-right-shuffle-with-unigrams",
  "full-shuffle": "full-shuffle",
} as const;

export type ScrambleMethod =
  (typeof ScrambleMethod)[keyof typeof ScrambleMethod];
