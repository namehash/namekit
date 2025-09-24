import fetch from "cross-fetch";
import {
  DEFAULT_ENABLE_LEARNING_TO_RANK,
  DEFAULT_FULL_MODE,
  DEFAULT_INSTANT_MODE,
  DEFAULT_LABEL_DIVERSITY_RATIO,
  DEFAULT_LABELS_LIMIT,
  DEFAULT_MAX_OTHER_COLLECTIONS,
  DEFAULT_MAX_PER_TYPE,
  DEFAULT_MAX_RECURSIVE_RELATED_COLLECTIONS,
  DEFAULT_MAX_RELATED_COLLECTIONS,
  DEFAULT_MAX_SUGGESTIONS,
  DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
  DEFAULT_MAX_TOTAL_COLLECTIONS,
  DEFAULT_METADATA,
  DEFAULT_MIN_OTHER_COLLECTIONS,
  DEFAULT_MIN_SUGGESTIONS,
  DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
  DEFAULT_OFFSET,
  NameGraphCollection,
  NameGraphCollectionByMemberResponse,
  NameGraphCountCollectionsResponse,
  NameGraphError,
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphFindCollectionsResponse,
  NameGraphGroupedByCategoryResponse,
  NameGraphGroupingCategory,
  NameGraphOptions,
  NameGraphSortOrderOptions,
  NameGraphSuggestion,
  ScrambleMethod,
  TypedNameGraphGroupingCategoriesParams,
} from "./utils";

/** The default endpoint URL for the NameGraph API */
const DEFAULT_ENDPOINT = "https://api.namegraph.dev/";

export class NameGraph {
  private namegraphEndpoint: URL;
  private abortController: AbortController;

  constructor({ namegraphEndpoint = DEFAULT_ENDPOINT }: NameGraphOptions = {}) {
    this.namegraphEndpoint = new URL(namegraphEndpoint);
    this.abortController = new AbortController();
  }

  /**
   * Gets name suggestions grouped by category for a given label.
   *
   * @param {string} label - The ENS label to get suggestions for, cannot contain dots (.). If enclosed in double quotes assuming label is pre-tokenized, the separators in the pre-tokenized input are spaces.
   * @returns {Promise<NameGraphGroupedByCategoryResponse>} Suggestions grouped by category
   * @example
   * const response = await client.groupedByCategory('zeus');
   */
  public groupedByCategory(
    label: string,
  ): Promise<NameGraphGroupedByCategoryResponse> {
    const sorter =
      "weighted-sampling"; /* sorter algorithm, possible values: round-robin, count, length, weighted-sampling */
    const min_primary_fraction = 0.1; /* minimal fraction of primary labels, ensures at least `min_suggestions * min_primary_fraction` primary labels will be generated */

    const payload = {
      label,
      metadata: DEFAULT_METADATA,
      sorter,
      min_suggestions: DEFAULT_MIN_SUGGESTIONS,
      max_suggestions: DEFAULT_MAX_SUGGESTIONS,
      min_primary_fraction,
      params: {
        mode: DEFAULT_FULL_MODE /* request mode: instant, domain_detail, full */,
        enable_learning_to_rank:
          DEFAULT_ENABLE_LEARNING_TO_RANK /*enable learning to rank. if true, the results will be sorted by 'learning to rank' algorithm */,
        label_diversity_ratio:
          DEFAULT_LABEL_DIVERSITY_RATIO /* collection diversity parameter based on labels, adds penalty to collections with similar labels to other collections. If null, then no penalty will be added */,
        max_per_type:
          DEFAULT_MAX_PER_TYPE /*collection diversity parameter based on collection types, adds penalty to collections with the same type as other collections. If null, then no penalty will be added */,
      },
    };

    return this.rawRequest(`grouped_by_category`, "POST", payload);
  }

  /**
   * Gets name suggestions by category with configurable related collections.
   *
   * @param {string} label - The ENS label to get suggestions for, cannot contain dots (.). If enclosed in double quotes assuming label is pre-tokenized, the separators in the pre-tokenized input are spaces.
   * @param {number} maxRelatedCollections - Maximum number of related collections to return (default: 6)
   * @param {number} options.max_per_type - collection diversity parameter based on collection types, adds penalty to collections with the same type as other collections. If null, then no penalty will be added (default: 2)
   * @param {number} options.max_labels_per_related_collection - Max number of labels returned in any related collection (default: 10)
   * @param {number} options.max_suggestion_per_grouping_category - Maximal number of suggestions to generate in one specific category (default: 10)
   * @param {number} options.min_suggestion_per_grouping_category - Minimal number of suggestions to generate in one specific category. If the number of suggestions generated for this category is below 'min_suggestions'
   * then the entire category should be filtered out from the response. (default: 2)
   * @returns {Promise<NameGraphGroupedByCategoryResponse>} Suggestions grouped by category.
   * @example
   * const suggestions = await client.suggestionsByCategory('zeus', 10);
   */
  public suggestionsByCategory(
    label: string,
    maxRelatedCollections = DEFAULT_MAX_RELATED_COLLECTIONS,
    options?: {
      max_per_type?: number;
      max_labels_per_related_collection?: number;
      max_suggestion_per_grouping_category?: number;
      min_suggestion_per_grouping_category?: number;
    },
  ): Promise<NameGraphGroupedByCategoryResponse> {
    const categoriesQueryConfig: TypedNameGraphGroupingCategoriesParams = {
      [NameGraphGroupingCategory.related]: {
        enable_learning_to_rank: DEFAULT_ENABLE_LEARNING_TO_RANK,
        max_labels_per_related_collection:
          options?.max_labels_per_related_collection || 10,
        max_per_type: options?.max_per_type || DEFAULT_MAX_PER_TYPE,
        max_recursive_related_collections:
          DEFAULT_MAX_RECURSIVE_RELATED_COLLECTIONS /* Set to 0 to disable the "recursive related collection search". When set to a value between 1 and 10, for each related collection we find,
        we also do a (depth 1 recursive) lookup for this many related collections to the related collection.*/,
        max_related_collections:
          maxRelatedCollections /* max number of related collections returned. If 0 it effectively turns off any related collection search. */,
        label_diversity_ratio: DEFAULT_LABEL_DIVERSITY_RATIO,
      },
      [NameGraphGroupingCategory.wordplay]: {
        max_suggestions:
          options?.max_suggestion_per_grouping_category ||
          DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions:
          options?.min_suggestion_per_grouping_category ||
          DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },

      [NameGraphGroupingCategory.alternates]: {
        max_suggestions:
          options?.max_suggestion_per_grouping_category ||
          DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions:
          options?.min_suggestion_per_grouping_category ||
          DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.emojify]: {
        max_suggestions:
          options?.max_suggestion_per_grouping_category ||
          DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions:
          options?.min_suggestion_per_grouping_category ||
          DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.community]: {
        max_suggestions:
          options?.max_suggestion_per_grouping_category ||
          DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions:
          options?.min_suggestion_per_grouping_category ||
          DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.expand]: {
        max_suggestions:
          options?.max_suggestion_per_grouping_category ||
          DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions:
          options?.min_suggestion_per_grouping_category ||
          DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.gowild]: {
        max_suggestions:
          options?.max_suggestion_per_grouping_category ||
          DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions:
          options?.min_suggestion_per_grouping_category ||
          DEFAULT_MIN_SUGGESTIONS_PER_GROUPING_CATEGORY,
      },
      [NameGraphGroupingCategory.other]: {
        max_suggestions:
          options?.max_suggestion_per_grouping_category ||
          DEFAULT_MAX_SUGGESTIONS_PER_GROUPING_CATEGORY,
        min_suggestions: 6,
        min_total_suggestions: 50 /* if not enough suggestions then "fallback generator" should be placed into another new category type called "other"
        it may be not fulfilled because of `max_suggestions` limit */,
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

  /**
   * Gets a random sample of members from a collection.
   *
   * @param {string} collection_id - The ID of the collection to sample from
   * @param {number} options.seed - Random seed for reproducible sampling
   * @param {number} options.max_sample_size - the maximum number of members to sample. If the collection has fewer members than max_sample_size, all the members will be returned (default: 5)
   * @returns {Promise<NameGraphSuggestion[]>} Array of sampled collection members
   * @example
   * const members = await client.sampleCollectionMembers('collection_id', { seed: 42 });
   */
  public sampleCollectionMembers(
    collection_id: string,
    options?: {
      seed?: number;
      max_sample_size?: number;
    },
  ): Promise<NameGraphSuggestion[]> {
    const max_sample_size = options?.max_sample_size || 5;
    const seed = options?.seed;

    const payload = {
      collection_id,
      metadata: DEFAULT_METADATA,
      max_sample_size,
      seed,
    };

    return this.rawRequest("sample_collection_members", "POST", payload);
  }

  /**
   * Fetches top 10 members from the collection specified by collection_id
   *
   * @param {string} collection_id - The ID of the collection
   * @returns {Promise<NameGraphFetchTopCollectionMembersResponse>} Top collection members
   * @example
   * const topMembers = await client.fetchTopCollectionMembers('collection_id');
   */
  public fetchTopCollectionMembers(
    collection_id: string,
  ): Promise<NameGraphFetchTopCollectionMembersResponse> {
    const metadata = true;

    const payload = {
      metadata,
      collection_id,
      max_recursive_related_collections:
        DEFAULT_MAX_RECURSIVE_RELATED_COLLECTIONS,
    };

    return this.rawRequest("fetch_top_collection_members", "POST", payload);
  }

  /**
   * Generates scrambled variations of collection tokens.
   *
   * @param {string} collection_id - The ID of the collection to scramble tokens from
   * @param {number} options.seed - Random seed for reproducible scrambling
   * @param {ScrambleMethod} options.method - Method to use for scrambling. Possible values: "left-right-shuffle", "left-right-shuffle-with-unigrams", "full-shuffle"
   * @param {number} options.n_top_members - Number of collection's top members to include in scrambling (default: 25)
   * @param {number} options.max_suggestions - Maximal number of suggestions to generate, must be a positive integer (default: 10)
   * @returns {Promise<NameGraphSuggestion[]>} Array of scrambled suggestions
   * @example
   * const scrambled = await client.scrambleCollectionTokens('collection_id', {
   *   seed: 42,
   * });
   */
  public scrambleCollectionTokens(
    collection_id: string,
    options?: {
      seed?: number;
      method?: ScrambleMethod;
      n_top_members?: number;
      max_suggestions?: number;
    },
  ): Promise<NameGraphSuggestion[]> {
    const method =
      options?.method || ScrambleMethod["left-right-shuffle-with-unigrams"];
    const n_top_members = options?.n_top_members || 25;
    const max_suggestions = options?.max_suggestions || 10;
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

  /**
   * Searches for collections by a string query.
   *
   * @param {string} query - input query (with or without spaces) which is used to search for template collections, cannot contain dots (.)
   * @param {number} options.max_per_type - Number of collections with the same type which are not penalized. Set to null if you want to disable the penalization.
   * If the penalization algorithm is turned on then 3 times more results (than max_related_collections) are retrieved from Elasticsearch (default: 3)
   * @param {number} options.offset - Starting offset for pagination (default: 0)
   * @param {number} options.min_other_collections - Minimum number of other collections to return (default: 0)
   * @param {number} options.max_other_collections - Maximum number of other collections to return (default: 3)
   * @param {number} options.max_related_collections - Maximum number of related collections to return (default: 3)
   * Return collections at [offset, offset + max_related_collections) positions (order as in sort_order). Should be a positive integer (default: 3)
   * @param {number} options.max_total_collections - Maximum number of total (related + other) collections to return (default: 6)
   * @param {NameGraphSortOrderOptions} options.sort_order - Sort order: "AI", "A-Z", "Z-A", or "Relevance" (default: "AI")
   * @returns {Promise<NameGraphFindCollectionsResponse>} Matching collections
   * @example
   * const collections = await client.findCollectionsByString('zeus god', {
   *   offset: 0,
   *   max_total_collections: 10,
   *   sort_order: NameGraphSortOrderOptions.AI
   * });
   */
  public findCollectionsByString(
    query: string,
    options?: {
      max_per_type?: number;
      offset?: number;
      min_other_collections?: number;
      max_other_collections?: number;
      max_related_collections?: number;
      max_total_collections?: number;
      sort_order?: NameGraphSortOrderOptions;
    },
  ): Promise<NameGraphFindCollectionsResponse> {
    const max_per_type = options?.max_per_type || 3;
    const min_other_collections =
      options?.min_other_collections || DEFAULT_MIN_OTHER_COLLECTIONS;
    const max_other_collections =
      options?.max_other_collections || DEFAULT_MAX_OTHER_COLLECTIONS;
    const max_total_collections =
      options?.max_total_collections || DEFAULT_MAX_TOTAL_COLLECTIONS;
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
      mode: DEFAULT_INSTANT_MODE /* request mode that performs rescoring on top 20 collections instead of 100, should result in faster responses */,
    };

    return this.rawRequest("find_collections_by_string", "POST", payload);
  }

  /**
   * Fetches members from a collection with pagination support
   *
   * @param {string} collection_id - The ID of the collection
   * @param {number} options.offset - Starting offset (number of members to skip) for pagination (default: 0)
   * @param {number} options.limit - Maximum number of members to return (default: 10)
   * @returns {Promise<NameGraphFetchTopCollectionMembersResponse>} Collection members.
   * @example
   * const members = await client.fetchCollectionMembers('collection_id', {
   *   offset: 0,
   *   limit: 20
   * });
   */
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

  /**
   * Counts collections matching a string query.
   *
   * @param {string} query - input query (with or without spaces) which is used to search for template collections, cannot contain dots (.)
   * @returns {Promise<NameGraphCountCollectionsResponse>} Count of matching collections
   * @example
   * const stringCount = await client.countCollectionsByString('zeus god');
   */
  public countCollectionsByString(
    query: string,
  ): Promise<NameGraphCountCollectionsResponse> {
    const payload = {
      query,
      mode: DEFAULT_INSTANT_MODE,
    };

    return this.rawRequest("count_collections_by_string", "POST", payload);
  }

  /**
   * Finds collections related to a given collection.
   *
   * @param {string} collection_id - The ID of the collection to find related collections for
   * @param {number} options.max_per_type - Number of collections with the same type which are not penalized. Set to null if you want to disable the penalization.
   * If the penalization algorithm is turned on then 3 times more results (than max_related_collections) are retrieved from Elasticsearch (default: 3)
   * @param {number} options.max_related_collections - Max number of related collections to return (for each page).
   * Return collections at [offset, offset + max_related_collections) positions (order as in sort_order). Should be a positive integer (default: 3)
   * @returns {Promise<NameGraphFindCollectionsResponse>} Related collections
   * @example
   * const related = await client.findCollectionsByCollection('collection_id');
   */
  public findCollectionsByCollection(
    collection_id: string,
    options?: {
      max_related_collections?: number;
      max_per_type?: number;
    },
  ): Promise<NameGraphFindCollectionsResponse> {
    const max_related_collections = options?.max_related_collections || 3;
    const max_per_type = options?.max_per_type || 3;

    const payload = {
      limit_labels: DEFAULT_LABELS_LIMIT,
      offset: DEFAULT_OFFSET,
      sort_order: NameGraphSortOrderOptions.RELEVANCE,
      max_related_collections,
      max_per_type,
      label_diversity_ratio: DEFAULT_LABEL_DIVERSITY_RATIO,
      min_other_collections: DEFAULT_MIN_OTHER_COLLECTIONS,
      max_other_collections: DEFAULT_MAX_OTHER_COLLECTIONS,
      max_total_collections: Math.max(
        max_related_collections + DEFAULT_MAX_OTHER_COLLECTIONS,
        DEFAULT_MAX_TOTAL_COLLECTIONS,
      ),
      collection_id,
    };

    return this.rawRequest("find_collections_by_collection", "POST", payload);
  }

  /**
   * Counts collections containing a specific member.
   *
   * @param {string} label - The member label to count collections for
   * @returns {Promise<NameGraphCountCollectionsResponse>} Count of collections containing the member
   * @example
   * const memberCount = await client.countCollectionsByMember('zeus');
   */
  public countCollectionsByMember(
    label: string,
  ): Promise<NameGraphCountCollectionsResponse> {
    const payload = {
      label,
    };

    return this.rawRequest("count_collections_by_member", "POST", payload);
  }

  /**
   * Finds collections containing a specific member.
   *
   * @param {string} label - The member label to find collections for
   * @param {number} options.offset - Starting offset for pagination (default: 0)
   * @param {number} options.max_results - Maximum number of results to return (default: 3)
   * @param {number} options.limit_labels - Maximum number of labels per collection (default: 10)
   * @param {NameGraphSortOrderOptions} options.sort_order - Sort order: "AI", "A-Z", "Z-A", or "Relevance" (default: "AI")
   * @returns {Promise<NameGraphCollectionByMemberResponse>} Collections containing the member.
   * @example
   * const memberCollections = await client.findCollectionsByMember('zeus', {
   *   offset: 0,
   *   max_results: 5,
   *   sort_order: NameGraphSortOrderOptions.AI
   * });
   */
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

  /**
   * Gets information about a single collection by its ID.
   *
   * @param {string} collection_id - The ID of the collection to retrieve
   * @returns {Promise<NameGraphCollection>} The requested collection
   * @example
   * const collection = await client.getCollectionById('collection_id');
   */
  public getCollectionById(
    collection_id: string,
  ): Promise<NameGraphCollection> {
    const payload = {
      collection_id,
    };

    return this.rawRequest("get_collection_by_id", "POST", payload);
  }

  /**
   * Performs a raw HTTP request to the NameGraph API.
   * @param {string} path - The API endpoint path
   * @param {string} method - The HTTP method (e.g., 'GET', 'POST')
   * @param {object} body - The request body for POST requests
   * @param {object} headers - Additional headers for the request
   * @returns {Promise<any>} The response from the API
   */
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

/**
 * Creates a new instance of a NameGraph client.
 *
 * @param {NameGraphOptions} options - Configuration options for NameGraph
 * @returns {NameGraph} A new NameGraph client instance
 * @example
 * import { createNameGraphClient } from '@namehash/namegraph';
 * const namegraph = createNameGraphClient({ ... })
 */
export function createNameGraphClient(options?: NameGraphOptions) {
  return new NameGraph(options);
}

const defaultClient = createNameGraphClient();

/**
 * Default NameGraph client instance for convenient access to NameGraph functionality.
 *
 * @example
 * import { namegraph } from '@namehash/namegraph';
 * const response = await namegraph.groupedByCategory('vitalik');
 */
export const namegraph = defaultClient;
