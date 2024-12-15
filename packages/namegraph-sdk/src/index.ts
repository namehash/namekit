import fetch from "cross-fetch";

const DEFAULT_ENDPOINT = "https://api.namegraph.dev/";

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

// Grouping categories params for req body
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

export type AllNameGraphGroupingCategoryParamsPossible =
  | NameGraphGroupingCategoryParams
  | NameGraphOtherCategoryParams
  | NameGraphRelatedCategoryParams;

export type TypedNameGraphGroupingCategoryParams = {
  [NameGraphGroupingCategory.related]: NameGraphRelatedCategoryParams;
  [NameGraphGroupingCategory.wordplay]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.alternates]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.emojify]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.community]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.expand]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.gowild]: NameGraphGroupingCategoryParams;
  [NameGraphGroupingCategory.other]: NameGraphOtherCategoryParams;
};

export interface NameGraphSuggestion {
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
}

export interface NameGraphCategory {
  suggestions: NameGraphSuggestion[];
}

export interface NameGraphRelatedCollectionsSummarizedResponse {
  collection_id: string;
  collection_title: string;
  collection_members_count: number;
}

export interface NameGraphGroupedByCategoryResponse {
  categories: NameGraphCategory[];
  all_tokenizations: [];
}

export interface NameGraphFetchTopCollectionMembersResponse {
  suggestions: NameGraphSuggestion[];
  name: string;
  type: string;
  collection_id: string;
  collection_title: string;
  collection_members_count: string;
  related_collections: NameGraphRelatedCollectionsSummarizedResponse[];
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

export interface NameGraphCollectionsByMemberResponse {
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  collections: NameGraphSuggestion[];
}

export interface NameGraphOptions {
  namegraphEndpoint?: string;
}

export interface Collection {
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
}

export interface FindCollectionsResponse {
  metadata: {
    total_number_of_matched_collections: number;
    processing_time_ms: number;
    elasticsearch_processing_time_ms: number;
    elasticsearch_communication_time_ms: number;
  };
  related_collections: Collection[];
  other_collections: Collection[];
}

class NameGraphError extends Error {
  constructor(
    public status: number,
    message?: string,
  ) {
    super(message);
  }
}

const DEFAULT_METADATA = true;

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
    const min_suggestions = 100;
    const max_suggestions = 100;
    const min_primary_fraction = 0.1;
    const mode = "full";
    const enable_learning_to_rank = true;
    const name_diversity_ratio = 0.5;
    const max_per_type = 2;

    const payload = {
      label,
      metadata: DEFAULT_METADATA,
      sorter,
      min_suggestions,
      max_suggestions,
      min_primary_fraction,
      params: {
        mode,
        enable_learning_to_rank,
        name_diversity_ratio,
        max_per_type,
      },
    };

    return this.rawRequest(`grouped-by-category`, "POST", payload);
  }

  public sampleCollectionMembers(
    collection_id: string,
  ): Promise<NameGraphSuggestion[]> {
    const metadata = true;
    const max_sample_size = 5;
    const seed = 5;

    const payload = {
      collection_id,
      metadata,
      max_sample_size,
      seed,
    };

    return this.rawRequest("sample_collection_members", "POST", payload);
  }

  public findCollectionsByString(
    query: string,
  ): Promise<FindCollectionsResponse> {
    const offset = 0;
    const mode = "instant";
    const limit_names = 10;
    const max_per_type = 3;
    const sort_order = "AI";
    const min_other_collections = 0;
    const max_other_collections = 3;
    const max_total_collections = 6;
    const name_diversity_ratio = 0.5;
    const max_related_collections = 3;

    const payload = {
      limit_names,
      offset,
      sort_order,
      max_related_collections,
      max_per_type,
      name_diversity_ratio,
      min_other_collections,
      max_other_collections,
      max_total_collections,
      query,
      mode,
    };

    return this.rawRequest("find_collections_by_string", "POST", payload);
  }

  public findCollectionsByCollection(
    collection_id: string,
  ): Promise<FindCollectionsResponse> {
    const limit_names = 10;
    const offset = 0;
    const sort_order = "AI";
    const max_related_collections = 3;
    const max_per_type = 3;
    const name_diversity_ratio = 0.5;
    const min_other_collections = 0;
    const max_other_collections = 3;
    const max_total_collections = 6;

    const payload = {
      limit_names,
      offset,
      sort_order,
      max_related_collections,
      max_per_type,
      name_diversity_ratio,
      min_other_collections,
      max_other_collections,
      max_total_collections,
      collection_id,
    };

    return this.rawRequest("find_collections_by_collection", "POST", payload);
  }

  public fetchTopCollectionMembers(
    collection_id: string,
  ): Promise<NameGraphFetchTopCollectionMembersResponse> {
    const metadata = true;
    const max_recursive_related_collections = 3;

    const payload = {
      metadata,
      collection_id,
      max_recursive_related_collections,
    };

    return this.rawRequest("fetch_top_collection_members", "POST", payload);
  }

  public suggestionsByCategory(label: string): Promise<NameGraphSuggestion[]> {
    const mode = "full";

    const categoriesQueryConfig: TypedNameGraphGroupingCategoryParams = {
      [NameGraphGroupingCategory.related]: {
        enable_learning_to_rank: true,
        max_names_per_related_collection: 10,
        max_per_type: 2,
        max_recursive_related_collections: 3,
        max_related_collections: 6,
        name_diversity_ratio: 0.5,
      },
      [NameGraphGroupingCategory.wordplay]: {
        max_suggestions: 10,
        min_suggestions: 2,
      },
      [NameGraphGroupingCategory.alternates]: {
        max_suggestions: 10,
        min_suggestions: 2,
      },
      [NameGraphGroupingCategory.emojify]: {
        max_suggestions: 10,
        min_suggestions: 2,
      },
      [NameGraphGroupingCategory.community]: {
        max_suggestions: 10,
        min_suggestions: 2,
      },
      [NameGraphGroupingCategory.expand]: {
        max_suggestions: 10,
        min_suggestions: 2,
      },
      [NameGraphGroupingCategory.gowild]: {
        max_suggestions: 10,
        min_suggestions: 2,
      },
      [NameGraphGroupingCategory.other]: {
        max_suggestions: 10,
        min_suggestions: 6,
        min_total_suggestions: 50,
      },
    };

    const payload = {
      label,
      categories: categoriesQueryConfig,
      params: {
        mode,
        metadata: DEFAULT_METADATA,
      },
    };

    return this.rawRequest(`suggestions_by_category`, "POST", payload);
  }

  public scrambleCollectionTokens(
    collection_id: string,
  ): Promise<NameGraphSuggestion[]> {
    const metadata = true;
    const method = "left-right-shuffle-with-unigrams";
    const n_top_members = 25;
    const max_suggestions = 10;
    const seed = 0;

    const payload = {
      collection_id,
      metadata,
      method,
      n_top_members,
      max_suggestions,
      seed,
    };

    return this.rawRequest("scramble_collection_tokens", "POST", payload);
  }

  public countCollectionsByString(
    query: string,
  ): Promise<NameGraphCountCollectionsResponse> {
    const mode = "instant";

    const payload = {
      query,
      mode,
    };

    return this.rawRequest("count_collections_by_string", "POST", payload);
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
  ): Promise<NameGraphCollectionsByMemberResponse> {
    const mode = "instant";
    const limit_names = 10;
    const offset = 0;
    const sort_order = "AI";
    const max_results = 3;

    const payload = {
      limit_names,
      offset,
      sort_order,
      label,
      mode,
      max_results,
    };

    return this.rawRequest("find_collections_by_member", "POST", payload);
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

export function createClient(options?: NameGraphOptions) {
  return new NameGraph(options);
}

const defaultClient = createClient();

export const namegraph = defaultClient;
