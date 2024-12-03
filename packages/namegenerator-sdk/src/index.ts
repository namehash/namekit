import fetch from "cross-fetch";

const DEFAULT_ENDPOINT = "http://100.24.45.225/";

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
