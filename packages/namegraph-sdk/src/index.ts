import fetch from "cross-fetch";
import {
  NameGraphError,
  NameGraphGroupingCategory,
  NameGraphSortOrderOptions,
  ScrambleMethod,
} from "./utils";

/** NameGraph default endpoint **/
const DEFAULT_ENDPOINT = "https://api.namegraph.dev/";

const DEFAULT_MAX_RELATED_COLLECTIONS = 6;
const DEFAULT_METADATA = true;
const DEFAULT_MIN_SUGGESTIONS = 100;
const DEFAULT_MAX_SUGGESTIONS = 100;
const DEFAULT_FULL_MODE = "full";
const DEFAULT_INSTANT_MODE = "instant";
const DEFAULT_ENABLE_LEARNING_TO_RANK = true;
const DEFAULT_LABEL_DIVERSITY_RATIO = 0.5;
const DEFAULT_MAX_PER_TYPE = 2;
const DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY = 10;
const DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY = 2;
const DEFAULT_MAX_RECURSIVE_RELATED_COLLECTIONS = 3;
const DEFAULT_OFFSET = 0;
const DEFAULT_LABELS_LIMIT = 10;
const DEFAULT_MIN_OTHER_COLLECTIONS = 0;
const DEFAULT_MAX_OTHER_COLLECTIONS = 3;
const DEFAULT_MAX_TOTAL_COLLECTIONS = 6;


export interface NameGraphOptions {
  namegraphEndpoint?: string;
}

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

export interface NameGraphRelatedCollectionResponse {
  collection_id: string;
  collection_title: string;
  collection_members_count: number;
}

export interface NameGraphGroupedByCategoryResponse {
  categories: NameGraphFetchTopCollectionMembersResponse[];
  all_tokenizations: string[][];
}

export interface NameGraphFetchTopCollectionMembersResponse {
  suggestions: NameGraphSuggestion[];
  name: string;
  type: string;
  collection_id?: string;
  collection_title?: string;
  collection_members_count?: number;
  related_collections?: NameGraphRelatedCollectionResponse[];
}

export interface NameGraphCountCollectionsResponse {
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  count: number;
}

export interface NameGraphCollectionByMemberResponse {
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  collections: NameGraphCollection[];
}

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

export interface NameGraphFindCollectionsResponse {
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  related_collections: NameGraphCollection[];
  other_collections: NameGraphCollection[];
}

export class NameGraph {
  private namegraphEndpoint: URL;
  private abortController: AbortController;

  constructor({ namegraphEndpoint = DEFAULT_ENDPOINT }: NameGraphOptions = {}) {
    this.namegraphEndpoint = new URL(namegraphEndpoint);
    this.abortController = new AbortController();
  }

  public groupedByCategory(
    label: string,
  ): Promise<NameGraphGroupedByCategoryResponse> {
    const sorter = "weighted-sampling";
    const min_primary_fraction = 0.1;

    const payload = {
      label,
      metadata: DEFAULT_METADATA,
      sorter,
      min_suggestions: DEFAULT_MIN_SUGGESTIONS,
      max_suggestions: DEFAULT_MAX_SUGGESTIONS,
      min_primary_fraction,
      params: {
        mode: DEFAULT_FULL_MODE,
        enable_learning_to_rank: DEFAULT_ENABLE_LEARNING_TO_RANK,
        label_diversity_ratio: DEFAULT_LABEL_DIVERSITY_RATIO,
        max_per_type: DEFAULT_MAX_PER_TYPE,
      },
    };

    return this.rawRequest(`grouped_by_category`, "POST", payload);
  }

  public suggestionsByCategory(
    label: string,
    maxRelatedCollections = DEFAULT_MAX_RELATED_COLLECTIONS,
  ): Promise<NameGraphGroupedByCategoryResponse> {
    const categoriesQueryConfig: TypedNameGraphGroupingCategoriesParams = {
      [NameGraphGroupingCategory.related]: {
        enable_learning_to_rank: DEFAULT_ENABLE_LEARNING_TO_RANK,
        max_labels_per_related_collection: 10,
        max_per_type: DEFAULT_MAX_PER_TYPE,
        max_recursive_related_collections: DEFAULT_MAX_RECURSIVE_RELATED_COLLECTIONS,
        max_related_collections: maxRelatedCollections,
        label_diversity_ratio: DEFAULT_LABEL_DIVERSITY_RATIO,
      },
      [NameGraphGroupingCategory.wordplay]: {
        max_suggestions: DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions: DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.alternates]: {
        max_suggestions: DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions: DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.emojify]: {
        max_suggestions: DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions: DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.community]: {
        max_suggestions: DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions: DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.expand]: {
        max_suggestions: DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions: DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.gowild]: {
        max_suggestions: DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions: DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.other]: {
        max_suggestions: DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions: 6,
        min_total_suggestions: 50,
      },
    };

    const payload = {
      label,
      categories: categoriesQueryConfig,
      params: {
        mode: DEFAULT_FULL_MODE,
        metadata: DEFAULT_METADATA,
      },
    };

    return this.rawRequest(`suggestions_by_category`, "POST", payload);
  }

  public sampleCollectionMembers(
    collection_id: string,
    options?: {
      seed?: number;
    },
  ): Promise<NameGraphSuggestion[]> {
    const max_sample_size = 5;
    const seed = options?.seed;

    const payload = {
      collection_id,
      metadata: DEFAULT_METADATA,
      max_sample_size,
      seed,
    };

    return this.rawRequest("sample_collection_members", "POST", payload);
  }

  public fetchTopCollectionMembers(
    collection_id: string,
  ): Promise<NameGraphFetchTopCollectionMembersResponse> {
    const metadata = true;

    const payload = {
      metadata,
      collection_id,
      max_recursive_related_collections: DEFAULT_MAX_RECURSIVE_RELATED_COLLECTIONS,
    };

    return this.rawRequest("fetch_top_collection_members", "POST", payload);
  }

  public scrambleCollectionTokens(
    collection_id: string,
    options?: {
      seed?: number;
      method?: ScrambleMethod;
    },
  ): Promise<NameGraphSuggestion[]> {
    const method = options?.method || ScrambleMethod["left-right-shuffle-with-unigrams"];
    const n_top_members = 25;
    const max_suggestions = 10;
    const seed = options?.seed;

    const payload = {
      collection_id,
      metadata: DEFAULT_METADATA,
      method,
      n_top_members,
      max_suggestions,
      seed,
    };

    return this.rawRequest("scramble_collection_tokens", "POST", payload);
  }

  public findCollectionsByString(
    query: string,
    options?: {
      offset?: number;
      min_other_collections?: number;
      max_other_collections?: number;
      max_related_collections?: number;
      max_total_collections?: number;
      sort_order?: NameGraphSortOrderOptions;
    },
  ): Promise<NameGraphFindCollectionsResponse> {
    const max_per_type = 3;
    const min_other_collections = options?.min_other_collections || DEFAULT_MIN_OTHER_COLLECTIONS;
    const max_other_collections = options?.max_other_collections || DEFAULT_MAX_OTHER_COLLECTIONS;
    const max_total_collections = options?.max_total_collections || DEFAULT_MAX_TOTAL_COLLECTIONS;
    const max_related_collections = options?.max_related_collections || 3;

    const payload = {
      limit_labels: DEFAULT_LABELS_LIMIT,
      offset: options?.offset || DEFAULT_OFFSET,
      sort_order: options?.sort_order || NameGraphSortOrderOptions.AI,
      max_related_collections,
      max_per_type,
      label_diversity_ratio: DEFAULT_LABEL_DIVERSITY_RATIO,
      min_other_collections,
      max_other_collections,
      max_total_collections,
      query,
      mode: DEFAULT_INSTANT_MODE,
    };

    return this.rawRequest("find_collections_by_string", "POST", payload);
  }

  public fetchCollectionMembers(
    collection_id: string,
    options?: {
      offset?: number;
      limit?: number;
    },
  ): Promise<NameGraphFetchTopCollectionMembersResponse> {
    const payload = {
      collection_id,
      offset: options?.offset || DEFAULT_OFFSET,
      limit: options?.limit || DEFAULT_LABELS_LIMIT,
      metadata: true,
    };

    return this.rawRequest("fetch_collection_members", "POST", payload);
  }

  public countCollectionsByString(
    query: string,
  ): Promise<NameGraphCountCollectionsResponse> {
    const payload = {
      query,
      mode: DEFAULT_INSTANT_MODE,
    };

    return this.rawRequest("count_collections_by_string", "POST", payload);
  }

  public findCollectionsByCollection(
    collection_id: string,
  ): Promise<NameGraphFindCollectionsResponse> {
    const max_related_collections = 3;
    const max_per_type = 3;

    const payload = {
      limit_labels: DEFAULT_LABELS_LIMIT,
      offset: DEFAULT_OFFSET,
      sort_order: NameGraphSortOrderOptions.RELEVANCE,
      max_related_collections,
      max_per_type,
      label_diversity_ratio: DEFAULT_LABEL_DIVERSITY_RATIO,
      min_other_collections: DEFAULT_MIN_OTHER_COLLECTIONS,
      max_other_collections: DEFAULT_MAX_OTHER_COLLECTIONS,
      max_total_collections: DEFAULT_MAX_TOTAL_COLLECTIONS,
      collection_id,
    };

    return this.rawRequest("find_collections_by_collection", "POST", payload);
  }

  public countCollectionsByMember(
    label: string,
  ): Promise<NameGraphCountCollectionsResponse> {
    const payload = {
      label,
    };

    return this.rawRequest("count_collections_by_member", "POST", payload);
  }

  public findCollectionsByMember(
    label: string,
    options?: {
      offset?: number;
      max_results?: number;
      limit_labels?: number;
      sort_order?: NameGraphSortOrderOptions;
    },
  ): Promise<NameGraphCollectionByMemberResponse> {
    const max_results = options?.max_results || 3;

    const payload = {
      limit_labels: options?.limit_labels || DEFAULT_LABELS_LIMIT,
      offset: options?.offset || DEFAULT_OFFSET,
      sort_order: options?.sort_order || NameGraphSortOrderOptions.AI,
      label,
      mode: DEFAULT_INSTANT_MODE,
      max_results,
    };

    return this.rawRequest("find_collections_by_member", "POST", payload);
  }

  public getCollectionById(
    collection_id: string,
  ): Promise<NameGraphCollection> {
    const payload = {
      collection_id,
    };

    return this.rawRequest("get_collection_by_id", "POST", payload);
  }

  async rawRequest(
    path: string,
    method: string = "GET",
    body: object = {},
    headers: object = {},
  ): Promise<any> {
    const url = new URL(path, this.namegraphEndpoint);

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      signal: this.abortController.signal,
    };

    if (method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new NameGraphError(
        response.status,
        `Failed to perform request to ${path}.`,
      );
    }

    return await response.json();
  }

  public abortAllRequests(): void {
    this.abortController.abort();

    this.abortController = new AbortController();
  }
}

export function createNameGraphClient(options?: NameGraphOptions) {
  return new NameGraph(options);
}

const defaultClient = createNameGraphClient();

export const namegraph = defaultClient;
