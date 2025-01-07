import fetch from "cross-fetch";
import { Network, NameGuardReport } from "@namehash/nameguard";
import { InspectorResult } from "./labelinspector";

const ETH_TLD = "eth";

export enum LabelStatus {
  Normalized = "normalized",
  Unnormalized = "unnormalized",
  Unknown = "unknown",
}

/**
 * Represents a single tokenization result with its probability scores
 */
export interface Tokenization {
  /** The tokens that make up this tokenization */
  tokens: string[];
  /**
   * The probability that this label represents a meaningful word or phrase in natural language,
   * based on statistical language models. Higher values indicate the label is more likely to be
   * meaningful text rather than random characters.
   * Must be between 0.0 and 1.0 inclusive.
   */
  probability: number;
  /**
   * The natural logarithm of the probability score. Log probabilities are often more useful for
   * comparing labels since they convert multiplicative relationships to additive ones and better
   * handle very small probabilities.
   * Must be less than or equal to 0.0.
   */
  log_probability: number;
}

export interface NLPLabelAnalysis {
  /**
   * The result of the label inspection.
   * - If status is Normalized, inspection will be of type InspectorResultNormalized
   * - If status is Unnormalized, inspection will be of type InspectorResultUnnormalized
   */
  inspection: InspectorResult;

  /** The normalization status of the label */
  status: LabelStatus;

  /**
   * The probability that this label represents a meaningful word or phrase in natural language,
   * based on statistical language models. Higher values indicate the label is more likely to be
   * meaningful text rather than random characters.
   * Must be between 0.0 and 1.0 inclusive.
   */
  probability: number;

  /**
   * The natural logarithm of the probability score. Log probabilities are often more useful for
   * comparing labels since they convert multiplicative relationships to additive ones and better
   * handle very small probabilities.
   * Must be less than or equal to 0.0.
   */
  log_probability: number;

  /**
   * The minimum number of words across all valid tokenizations of the label that contain no gaps.
   * Will be 0 if no valid tokenization without gaps is found. For example, labels containing only
   * numbers or special characters may have a word_count of 0.
   * Note: this is not the number of words in the top_tokenization, but the minimum number of words
   * across all valid tokenizations without gaps.
   * Always a non-negative integer.
   */
  word_count: number;

  /**
   * The recommended tokenization of the label into words. We give priority to tokenizations that don't
   * have gaps and have fewer words, even if they are less probable. Will be undefined if:
   * - no valid tokenization is found
   * - the label is not normalized
   * - the tokenization process was interrupted by recursion limit
   * - word_count is 0
   * When present, this contains the tokens from the tokenization with the fewest words (and highest
   * probability among ties) that has no gaps.
   */
  top_tokenization?: string[];

  /**
   * Up to 1000 possible tokenizations of the label, ordered by probability from highest to lowest. Each entry
   * contains the tokenization and its probability score. Will be an empty list if no valid
   * tokenizations are found. For very long or complex labels, not all possible tokenizations may be included.
   */
  tokenizations: Tokenization[];
}

export interface NameRankReport {
  /**
   * Score indicating the purity/cleanliness of the name. For single labels, returns the score directly. For 2-label names (e.g., "nick.eth"), returns the
   * score for the first label ("nick"). For 3 or more labels, returns 0. If the label is not inspected,
   * this field will be 0. The score ranges from 0.0 to 1.0 inclusive, where 0.0 indicates lowest purity
   * and 1.0 indicates highest purity.
   */
  purity_score: number;

  /**
   * Score indicating how interesting/memorable the name is. For single labels, returns the score directly. For 2-label names (e.g., "nick.eth"), returns the
   * score for the first label ("nick"). For 3 or more labels, returns 0. If the label is not inspected,
   * this field will be 0. The score ranges from 0.0 to 1.0 inclusive, where 0.0 indicates least interesting
   * and 1.0 indicates most interesting.
   */
  interesting_score: number;

  /**
   * The result of the NLP analysis on the label. This field will be undefined when the name is uninspected.
   * A name is considered uninspected when either:
   * 1. The count of unknown labels (distinct or non-distinct) exceeds MAX_INSPECTED_NAME_UNKNOWN_LABELS (5)
   * 2. The count of characters in the name (including dots) exceeds MAX_INSPECTED_NAME_CHARACTERS (200)
   * When a name is uninspected, both purity_score and interesting_score will be 0, and nameguard.inspected will be false.
   */
  analysis?: NLPLabelAnalysis;
}

export interface NameRankResponse {
  /** The NameRank analysis report */
  namerank: NameRankReport;

  /** The NameGuard security analysis report */
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
  /** The endpoint URL for the NameRank API */
  namerankEndpoint?: string;

  /** The Ethereum network to use for name resolution */
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
    // Ensure the endpoint ends with a trailing slash
    if (!this.namerankEndpoint.pathname.endsWith('/')) {
      this.namerankEndpoint.pathname += '/';
    }
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
   * @returns {Promise<NameRankResponse>} A promise that resolves with the `NameRankResponse` of the name.
   * @example
   * const nameRankResponse = await namerank.inspectName('vitalik.eth');
   */
  public inspectName(
    name: string,
    options?: InspectNameOptions,
  ): Promise<NameRankResponse> {
    const network_name = this.network;
    return this.rawRequest("inspect-name", "POST", {
      name
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
    const url = new URL(path, this.namerankEndpoint);

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
 * const nameRankResponse = await namerank.inspectName('vitalik.eth');
 */
export const namerank = defaultClient;
