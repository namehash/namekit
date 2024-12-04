import fetch from "cross-fetch";

const DEFAULT_ENDPOINT = "http://100.24.45.225/";

export const NameGraphGroupingCategory = {
  related: "related",
  wordplay: "wordplay",
  alternates: "alternates",
  emojify: "emojify",
  expand: "expand",
  gowild: "gowild",
  other: "other",
} as const;

export type NameGraphGroupingCategory =
  (typeof NameGraphGroupingCategory)[keyof typeof NameGraphGroupingCategory];

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
    grouping_category: NameGraphGroupingCategory | null;
  };
}

export interface NameGraphCategory {
  suggestions: NameGraphSuggestion[];
}

export interface NamesGeneratedGroupedByCategory {
  categories: NameGraphCategory[];
  all_tokenizations: [];
}

export interface NameGraphOptions {
  namegraphEndpoint?: string;
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

  public groupedByCategory(
    label: string,
  ): Promise<NamesGeneratedGroupedByCategory> {
    const metadata = true;
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
      metadata,
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
