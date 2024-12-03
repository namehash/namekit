import fetch from "cross-fetch";

const DEFAULT_ENDPOINT = "http://100.24.45.225/";

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

export interface FindCollectionsByStringResponse {
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

export class NameGraph {
  private namegraphEndpoint: URL;
  private abortController: AbortController;

  constructor({ namegraphEndpoint = DEFAULT_ENDPOINT }: NameGraphOptions = {}) {
    this.namegraphEndpoint = new URL(namegraphEndpoint);
    this.abortController = new AbortController();
  }

  public findCollectionsByString(
    query: string,
  ): Promise<FindCollectionsByStringResponse> {
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
