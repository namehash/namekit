import fetch from "cross-fetch";
import {
  DEFAULT_ENDPOINT,
  metadata,
  NameGraphFindCollectionsResponse,
  NameGraphCollectionByMemberResponse,
  NameGraphCountCollectionsResponse,
  NameGraphError,
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphGroupedByCategoryResponse,
  NameGraphGroupingCategory,
  NameGraphConstructorParams,
  NameGraphSuggestion,
  TypedNameGraphGroupingCategoriesParams,
  min_suggestions,
  max_suggestions,
  full_mode,
  enable_learning_to_rank,
  name_diversity_ratio,
  max_per_type,
  instant_mode,
} from "./utils";

export class NameGraph {
  private namegraphEndpoint: URL;
  private abortController: AbortController;

  constructor({
    namegraphEndpoint = DEFAULT_ENDPOINT,
  }: NameGraphConstructorParams = {}) {
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
      metadata,
      sorter,
      min_suggestions,
      max_suggestions,
      min_primary_fraction,
      params: {
        mode: full_mode,
        enable_learning_to_rank,
        name_diversity_ratio,
        max_per_type,
      },
    };

    return this.rawRequest(`grouped_by_category`, "POST", payload);
  }

  public suggestionsByCategory(label: string): Promise<NameGraphSuggestion[]> {
    const categoriesQueryConfig: TypedNameGraphGroupingCategoriesParams = {
      [NameGraphGroupingCategory.related]: {
        enable_learning_to_rank,
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
        mode: full_mode,
        metadata,
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
      metadata,
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
      metadata,
      method,
      n_top_members,
      max_suggestions,
      seed,
    };

    return this.rawRequest("scramble_collection_tokens", "POST", payload);
  }

  public findCollectionsByString(
    query: string,
  ): Promise<NameGraphFindCollectionsResponse> {
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

  public countCollectionsByString(
    query: string,
  ): Promise<NameGraphCountCollectionsResponse> {
    const payload = {
      query,
      mode: instant_mode,
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
      mode: instant_mode,
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

export function createClient(options?: NameGraphConstructorParams) {
  return new NameGraph(options);
}

const defaultClient = createClient();

export const namegraph = defaultClient;
