import fetch from "cross-fetch";
import {
  DEFAULT_ENDPOINT,
  NameGraphFindCollectionsResponse,
  NameGraphCollectionByMemberResponse,
  NameGraphCountCollectionsResponse,
  NameGraphError,
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphGroupedByCategoryResponse,
  NameGraphGroupingCategory,
  NameGraphOptions,
  NameGraphSuggestion,
  TypedNameGraphGroupingCategoriesParams,
  DEFAULT_METADATA,
  DEFAULT_MIN_SUGGESTIONS,
  DEFAULT_MAX_SUGGESTIONS,
  DEFAULT_FULL_MODE,
  DEFAULT_ENABLE_LEARNING_TO_RANK,
  DEFAULT_NAME_DIVERSITY_RATIO,
  DEFAULT_MAX_PER_TYPE,
  DEFAULT_INSTANT_MODE,
  NameGraphSortOrderOptions,
} from "./utils";

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
        name_diversity_ratio: DEFAULT_NAME_DIVERSITY_RATIO,
        max_per_type: DEFAULT_MAX_PER_TYPE,
      },
    };

    return this.rawRequest(`grouped_by_category`, "POST", payload);
  }

  public suggestionsByCategory(
    label: string,
  ): Promise<NameGraphGroupedByCategoryResponse> {
    const categoriesQueryConfig: TypedNameGraphGroupingCategoriesParams = {
      [NameGraphGroupingCategory.related]: {
        enable_learning_to_rank: DEFAULT_ENABLE_LEARNING_TO_RANK,
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
        mode: DEFAULT_FULL_MODE,
        metadata: DEFAULT_METADATA,
      },
    };

    return this.rawRequest(`suggestions_by_category`, "POST", payload);
  }

  public sampleCollectionMembers(
    collection_id: string,
  ): Promise<NameGraphSuggestion[]> {
    const max_sample_size = 5;
    const seed = 5;

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
    const max_recursive_related_collections = 3;

    const payload = {
      metadata,
      collection_id,
      max_recursive_related_collections,
    };

    return this.rawRequest("fetch_top_collection_members", "POST", payload);
  }

  public scrambleCollectionTokens(
    collection_id: string,
  ): Promise<NameGraphSuggestion[]> {
    const method = "left-right-shuffle-with-unigrams";
    const n_top_members = 25;
    const max_suggestions = 10;
    const seed = 0;

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
    const offset = options?.offset || 0;
    const mode = "instant";
    const limit_names = 10;
    const max_per_type = 3;
    const sort_order = options?.sort_order || NameGraphSortOrderOptions.AI;
    const min_other_collections = options?.min_other_collections || 0;
    const max_other_collections = options?.max_other_collections || 3;
    const max_total_collections = options?.max_total_collections || 6;
    const name_diversity_ratio = 0.5;
    const max_related_collections = options?.max_related_collections || 3;

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

  public fetchCollectionMembers(
    collection_id: string,
    options?: {
      offset?: number;
      limit?: number;
    },
  ): Promise<NameGraphFetchTopCollectionMembersResponse> {
    const payload = {
      collection_id,
      offset: options?.offset || 0,
      limit: options?.limit || 10,
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
  ): Promise<NameGraphCollectionByMemberResponse> {
    const limit_names = 10;
    const offset = 0;
    const sort_order = "AI";
    const max_results = 3;

    const payload = {
      limit_names,
      offset,
      sort_order,
      label,
      mode: DEFAULT_INSTANT_MODE,
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
