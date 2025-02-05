/** Maximum number of related collections to return */
export const DEFAULT_MAX_RELATED_COLLECTIONS = 6;

/** Inclusion of metadata in responses */
export const DEFAULT_METADATA = true;

export const DEFAULT_MIN_SUGGESTIONS = 100;
export const DEFAULT_MAX_SUGGESTIONS = 100;

/* Mode for processing that should result in faster responses.
*/
export const DEFAULT_INSTANT_MODE = "instant";

/* Other modes are: full and domain_detail. 
They differ in what generators are to be used and how many names from each generator to take into final results
In full context: https://github.com/namehash/name-generator/blob/master/readme.md#pipelines-weights-sampler 
*/
export const DEFAULT_FULL_MODE = "full";

/** Enabling learning-to-rank functionality */
export const DEFAULT_ENABLE_LEARNING_TO_RANK = true;

export const DEFAULT_LABEL_DIVERSITY_RATIO = 0.5;
export const DEFAULT_MAX_PER_TYPE = 2;
export const DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY = 10;
export const DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY = 2;

/** Maximum depth for recursive related collections search */
export const DEFAULT_MAX_RECURSIVE_RELATED_COLLECTIONS = 3;

/** Offset for paginated results */
export const DEFAULT_OFFSET = 0;

export const DEFAULT_LABELS_LIMIT = 10;
export const DEFAULT_MIN_OTHER_COLLECTIONS = 0;
export const DEFAULT_MAX_OTHER_COLLECTIONS = 3;
export const DEFAULT_MAX_TOTAL_COLLECTIONS = 6;

/**
 * Defines the available grouping categories in NameGraph
 * Used to organize and categorize name suggestions
 */
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

/** Configuration options for initializing NameGraph */
export interface NameGraphOptions {
  /** Optional custom endpoint URL for NameGraph API */
  namegraphEndpoint?: string;
}

/** Parameters for querying grouping category suggestions */
export type NameGraphGroupingCategoryParams = {
  /** Minimum number of suggestions to return */
  min_suggestions: number;
  /** Maximum number of suggestions to return */
  max_suggestions: number;
};

/** Parameters for querying the "other" category, extends `NameGraphGroupingCategoryParams` */
export type NameGraphOtherCategoryParams = NameGraphGroupingCategoryParams & {
  /** Minimum total suggestions to return across all categories */
  min_total_suggestions: number;
};

/** Parameters specific to the "related" grouping category */
export type NameGraphRelatedCategoryParams = {
  /** Maximum number of related collections to return */
  max_related_collections: number;
  /** Maximum labels to return per related collection */
  max_labels_per_related_collection: number;
  /** Maximum depth for recursive related collections search */
  max_recursive_related_collections: number;
  /** Whether to enable learning-to-rank functionality */
  enable_learning_to_rank: boolean;
  /** Ratio for maintaining label diversity in results */
  label_diversity_ratio: number | null;
  /** Maximum results per type */
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

/** Represents a single name suggestion with metadata */
export type NameGraphSuggestion = {
  /** The suggested label */
  label: string;
  /** The label broken into tokens */
  tokenized_label: string[];
  /** Metadata about the suggestion */
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

/** Response format for related collection queries */
export interface NameGraphRelatedCollectionResponse {
  /** Unique identifier for the collection */
  collection_id: string;
  /** Title of the collection */
  collection_title: string;
  /** Number of members in the collection */
  collection_members_count: number;
}

/** Response format for category-grouped queries */
export interface NameGraphGroupedByCategoryResponse {
  /** list of suggestions grouped by category type*/
  categories: NameGraphFetchTopCollectionMembersResponse[];
  /** all inferred tokenizations of input label */
  all_tokenizations: string[][];
}

/** Result format for fetching collection members */
export interface NameGraphFetchTopCollectionMembersResponse {
  /** Generated suggestions belonging to the same category type */
  suggestions: NameGraphSuggestion[];
  /** Category name */
  name: string;
  /** Category type */
  type: string;
  /** Optional unique collection identifier */
  collection_id?: string;
  /** Optional collection title */
  collection_title?: string;
  /** Optional count of collection members */
  collection_members_count?: number;
  /** Optional array of related collections */
  related_collections?: NameGraphRelatedCollectionResponse[];
}

/** Result format for collection counting operations */
export interface NameGraphCountCollectionsResponse {
  /** Metadata about the count operation */
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  /** count of collections containing input label/query or `1000+` if more than 1000 results */
  count: number;
}

/** Result format for collection-by-member queries */
export interface NameGraphCollectionByMemberResponse {
  /** Metadata about collection query response */
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  /** list of public collections the provided label is a member of */
  collections: NameGraphCollection[];
}

/** Represents a collection in NameGraph */
export type NameGraphCollection = {
  /** Unique identifier of the collection */
  collection_id: string;
  /** Collection title */
  title: string;
  /** ETH address of the collection owner */
  owner: string;
  /** Total number of labels in collection */
  number_of_labels: number;
  /** Timestamp in milliseconds of last collection update */
  last_updated_timestamp: number;
  /** top labels stored in the collection (limited by `limit_labels`), cannot be bigger than 10 */
  top_labels: [
    {
      label: string;
    },
  ];
  /** list of types to which the collection belongs */
  types: [string];
  /** Avatar emoji associated with this collection */
  avatar_emoji: string;
  /** Avatar image associated with this collection */
  avatar_image: string;
};

/** Result format for finding collections */
export interface NameGraphFindCollectionsResponse {
  /** Metadata about the find operation */
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  /** Array of related collections */
  related_collections: NameGraphCollection[];
  /** Array of other collections (if not enough related collections)*/
  other_collections: NameGraphCollection[];
}

export class NameGraphError extends Error {
  constructor(
    public status: number,
    message?: string,
  ) {
    super(message);
  }
}

/** Available sort order options for NameGraph queries */
export const NameGraphSortOrderOptions = {
  /** Use intelligent endpoint-specific ranking (use with Learning to Rank for optimal results)*/
  AI: "AI",
  /** Sort alphabetically ascending */
  AZ: "A-Z",
  /** Sort alphabetically descending */
  ZA: "Z-A",
  /** Use relevance ranking */
  RELEVANCE: "Relevance",
} as const;

export type NameGraphSortOrderOptions =
  (typeof NameGraphSortOrderOptions)[keyof typeof NameGraphSortOrderOptions];

/** Represents a suggestion for writer's block feature */
export type WritersBlockSuggestion = {
  /** Name of the collection */
  collectionName: string;
  /** Suggested name */
  suggestedName: string;
  /** Suggested name broken into tokens */
  tokenizedSuggestedName: string[];
};

/** Represents a name in writer's block feature */
export type WritersBlockName = {
  /** Normalized form of the name */
  normalized_name: string;
  /** Name broken into tokens */
  tokenized_name: string[];
};

/** Represents a collection in writer's block feature */
export type WritersBlockCollection = {
  /** Collection identifier */
  collection_id: string;
  /** Collection name */
  collection_name: string;
  /** Array of names in collection */
  names: WritersBlockName[];
};

const getRandomElementOfArray = <Type>(array: Type[]): Type =>
  array[Math.floor(Math.random() * array.length)];

/** 
 * Gets a random suggestion from writer's block collections 
 * 
 * @param {WritersBlockCollection[]} array - Array of collections to sample from
 * @returns {WritersBlockSuggestion} Random suggestion from the collections
 */
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
 * Samples suggestions from writer's block collections
 * 
 * @param {number} suggestionsCount - Maximum number of suggestions to return
 * @param {WritersBlockCollection[]} catalog - Array of collections to sample from
 * @returns {WritersBlockSuggestion[]} Array of unique suggestions
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

/** Available methods for scrambling names from collections*/
export const ScrambleMethod = {
  "left-right-shuffle": "left-right-shuffle", /* tokenize labels as bigrams and shuffle the right-side tokens (do not use unigrams) */
  "left-right-shuffle-with-unigrams": "left-right-shuffle-with-unigrams", /* same as above, but with some tokens swapped with unigrams */
  "full-shuffle": "full-shuffle", /* shuffle all tokens from bigrams and unigrams and create random bigrams */
} as const;

export type ScrambleMethod =
  (typeof ScrambleMethod)[keyof typeof ScrambleMethod];
