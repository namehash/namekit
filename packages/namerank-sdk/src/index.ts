import fetch from "cross-fetch";
import { Network, NameGuardReport } from "@namehash/nameguard";

const ETH_TLD = "eth";

export enum LabelStatus {
  Normalized = "normalized",
  Unnormalized = "unnormalized",
  Unknown = "unknown",
}

export interface NLPLabelAnalysis {
  inspection: any;
  status: LabelStatus;
  probability: number;
  log_probability: number;
  word_count: number;
  top_tokenization?: string[];
  tokenizations: Record<string, any>[];
}

export interface NameRankReport {
  purity_score: number;
  interesting_score: number;
  analysis?: NLPLabelAnalysis;
}

export interface NameRankResponse {
  namerank: NameRankReport;
  nameguard: NameGuardReport;
}

// TODO: Let's apply more formalization to this error class.
class NameRankError extends Error {
  constructor(
    public status: number,
    message?: string,
  ) {
    super(message);
  }
}

const DEFAULT_ENDPOINT = "https://api.namerank.io/";
const DEFAULT_NETWORK: Network = "mainnet";
const DEFAULT_INSPECT_LABELHASH_PARENT = ETH_TLD;
export const DEFAULT_COMPUTE_NAMEGUARD_REPORT = false;
const MAX_BULK_INSPECTION_NAMES = 250;

/** includes label separators */
export const MAX_INSPECTED_NAME_CHARACTERS = 200;

/** includes duplicated unknown labels */
const MAX_INSPECTED_NAME_UNKNOWN_LABELS = 5;

export interface NameRankOptions {
  namerankEndpoint?: string;
  network?: Network;
}

interface InspectNameOptions {}

export class NameRank {
  private namerankEndpoint: URL;
  protected network: Network;
  private abortController: AbortController;

  constructor({
    namerankEndpoint = DEFAULT_ENDPOINT,
    network = DEFAULT_NETWORK,
  }: NameRankOptions = {}) {
    this.namerankEndpoint = new URL(namerankEndpoint);
    this.network = network;
    this.abortController = new AbortController();
  }

  /**
   * Inspects a single name with NameRank.
   *
   * If `name` includes unknown labels then this function will attempt automated labelhash resolution through the ENS Subgraph
   * using the network specified in the `NameGuard` instance. Therefore the returned `name` may not match the provided `name`, but is guaranteed to have a matching `namehash`.
   *
   * @param {string} name The name for NameRank to inspect.
   * @param {InspectNameOptions} options The options for the inspection.
   * @returns {Promise<NameRankReport>} A promise that resolves with the `NameRankReport` of the name.
   * @example
   * const nameRankReport = await namerank.inspectName('vitalik.eth');
   */
  public inspectName(
    name: string,
    options?: InspectNameOptions,
  ): Promise<NameRankResponse> {
    const network_name = this.network;
    return this.rawRequest("inspect-name", "POST", {
      name /*, network_name */,
    });
  }

  /**
   * Performs a raw HTTP request to the NameRank API.
   * @param {string} path The API endpoint path.
   * @param {string} method The HTTP method (e.g., 'GET', 'POST').
   * @param {object} body The request body for POST requests.
   * @param {object} headers Additional headers for the request.
   * @returns {Promise<any>} The response from the API.
   */
  async rawRequest(
    path: string,
    method: string = "GET",
    body: object = {},
    headers: object = {},
  ): Promise<any> {
    const url = new URL(this.namerankEndpoint);
    url.pathname += "/" + path;

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
      throw new NameRankError(
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
 * Creates a new instance of a NameRank client.
 *
 * @param {NameRankOptions} [options] - Configuration options for NameRank.
 * @example
 * import { createClient } from '@namehash/namerank';
 * const namerank = createClient({ ... })
 */
export function createClient(options?: NameRankOptions) {
  return new NameRank(options);
}

const defaultClient = createClient();

/**
 * `NameRank` provides methods to inspect and rank ENS names.
 * It can inspect individual names or batch names.
 * @example
 * import { namerank } from '@namehash/namerank';
 * const nameRankReport = await namerank.inspectName('vitalik.eth');
 */
export const namerank = defaultClient;
