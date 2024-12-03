import fetch from "cross-fetch";

const DEFAULT_ENDPOINT = "http://100.24.45.225/";

export const NameGeneratorGroupingCategory = {
  related: "related",
  wordplay: "wordplay",
  alternates: "alternates",
  emojify: "emojify",
  expand: "expand",
  gowild: "gowild",
  other: "other",
} as const;

export type NameGeneratorGroupingCategory =
  (typeof NameGeneratorGroupingCategory)[keyof typeof NameGeneratorGroupingCategory];

export interface NameGeneratorSuggestion {
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
    grouping_category: NameGeneratorGroupingCategory | null;
  };
}

export interface NameGeneratorCategory {
  suggestions: NameGeneratorSuggestion[];
}

export interface NamesGeneratedGroupedByCategory {
  categories: NameGeneratorCategory[];
  all_tokenizations: [];
}

export interface NameGeneratorOptions {
  namegeneratorEndpoint?: string;
}

class NameGeneratorError extends Error {
  constructor(
    public status: number,
    message?: string,
  ) {
    super(message);
  }
}

export class NameGenerator {
  private namegeneratorEndpoint: URL;
  private abortController: AbortController;

  constructor({
    namegeneratorEndpoint = DEFAULT_ENDPOINT,
  }: NameGeneratorOptions = {}) {
    this.namegeneratorEndpoint = new URL(namegeneratorEndpoint);
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
    const url = new URL(path, this.namegeneratorEndpoint);

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
      throw new NameGeneratorError(
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

export function createClient(options?: NameGeneratorOptions) {
  return new NameGenerator(options);
}

const defaultClient = createClient();

export const namegenerator = defaultClient;
