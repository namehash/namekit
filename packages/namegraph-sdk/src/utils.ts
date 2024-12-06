/**
 * NameGraph default endpoint
 **/
export const DEFAULT_ENDPOINT = "http://api.namegraph.dev/";

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
  max_names_per_related_collection: number;
  max_recursive_related_collections: number;
  enable_learning_to_rank: boolean;
  name_diversity_ratio: number | null;
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
  name: string;
  tokenized_label: string[];
  metadata: {
    pipeline_name: string;
    interpretation: (string | null)[];
    cached_status: string;
    categories: string[];
    cached_interesting_score: number | null;
    applied_strategies: string[][];
    collection_title: string | null;
    collection_id: string | null;
    grouping_category: string | null;
  };
};

export type NameGraphCategory = {
  suggestions: NameGraphSuggestion[];
};

export type NameGraphRelatedCollectionResponse = {
  collection_id: string;
  collection_title: string;
  collection_members_count: number;
};

export type NameGraphGroupedByCategoryResponse = {
  categories: NameGraphCategory[];
  all_tokenizations: [];
};

export type NameGraphFetchTopCollectionMembersResponse = {
  suggestions: NameGraphSuggestion[];
  name: string;
  type: string;
  collection_id: string;
  collection_title: string;
  collection_members_count: string;
  related_collections: NameGraphRelatedCollectionResponse[];
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
  collections: NameGraphSuggestion[];
};

export type NameGraphCollection = {
  collection_id: string;
  title: string;
  owner: string;
  number_of_names: number;
  last_updated_timestamp: number;
  top_names: [
    {
      name: string;
      namehash: string;
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

export type NameGraphConstructorParams = {
  namegraphEndpoint?: string;
};

/**
 * NameGraph Endpoints related code
 **/
export const metadata = true;
export const min_suggestions = 100;
export const max_suggestions = 100;
export const full_mode = "full";
export const instant_mode = "instant";
export const enable_learning_to_rank = true;
export const name_diversity_ratio = 0.5;
export const max_per_type = 2;
