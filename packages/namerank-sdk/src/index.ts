import fetch from "cross-fetch";
import { Network, NameGuardReport } from "@namehash/nameguard";

const ETH_TLD = "eth";

export enum LabelStatus {
  Normalized = "normalized",
  Unnormalized = "unnormalized",
  Unknown = "unknown",
}

// Character and grapheme types can potentially evolve independently.

export enum CharacterType {
  /** A lowercase letter [a-z] */
  SimpleLetter = "simple_letter",

  /** A digit [0-9] */
  SimpleNumber = "simple_number",

  /** A letter in any script that is not simple; `LC` class http://www.unicode.org/reports/tr44/#GC_Values_Table */
  OtherLetter = "other_letter",

  /** A digit in any script that is not simple; `N` class http://www.unicode.org/reports/tr44/#GC_Values_Table */
  OtherNumber = "other_number",

  /** A hyphen */
  Hyphen = "hyphen",

  /** A dollar sign */
  DollarSign = "dollarsign",

  /** An underscore */
  Underscore = "underscore",

  /** A character that is part of a valid emoji sequence */
  Emoji = "emoji",

  /** A zero width joiner or non-joiner not part of an emoji sequence */
  Invisible = "invisible",

  /** Any character that doesn't match other classifications */
  Special = "special"
}

export enum GraphemeType {
  /** Only lowercase letters [a-z] */
  SimpleLetter = "simple_letter",

  /** Only digits [0-9] */
  SimpleNumber = "simple_number",

  /** A letter (single-char grapheme) in any script that is not simple; `LC` class http://www.unicode.org/reports/tr44/#GC_Values_Table */
  OtherLetter = "other_letter",

  /** A digit (single-char grapheme) in any script that is not simple; `N` class http://www.unicode.org/reports/tr44/#GC_Values_Table */
  OtherNumber = "other_number",

  /** A hyphen */
  Hyphen = "hyphen",

  /** A dollar sign */
  DollarSign = "dollarsign",

  /** An underscore */
  Underscore = "underscore",

  /** An emoji or emoji ZWJ sequence */
  Emoji = "emoji",

  /** A zero width joiner or non-joiner */
  Invisible = "invisible",

  /** Either a grapheme that doesn't match other classifications, or a multi-character 
   * grapheme containing characters of different types */
  Special = "special"
}

export interface InspectorCharResult {
  /** Character being inspected */
  value: string;

  /** Script name (writing system) of the character.
   * - is 'Unknown' if script is not assigned for a character
   * - special scripts are 'Common' (e.g. punctuations, emojis) and 'Inherited' (e.g. combining marks)
   */
  script: string;

  /** Name assigned to the character.
   * - for unknown characters it is 'Unknown character in <script> script'
   */
  name: string;

  /** Codepoint of the character as hex integer with 0x prefix */
  codepoint: string;

  /** Link to an external page with information about the character */
  link: string;

  /** Type of the character */
  type: CharacterType;

  /** Unicode Version of the character.
   * - null if the character is not assigned to any version
   */
  unicode_version: string | null;
}

export interface InspectorGraphemeResult {
  /** The grapheme string */
  value: string;

  /** List of characters. May be shorter than `value` (grapheme string) if `truncate_chars` applies */
  chars: InspectorCharResult[];

  /** Name of the grapheme.
   * - is 'Combined Character' for multi-character graphemes without a unique name
   */
  name: string;

  /** Codepoint of the single-character grapheme as hex with 0x prefix.
   * - null for multi-character graphemes
   */
  codepoint: string | null;

  /** Link to an external page with information about the single-character grapheme.
   * - null for multi-character graphemes
   */
  link: string | null;

  /** Script name of the grapheme computed from the script names of its characters */
  script: string;

  /** Type of the grapheme. If all characters in the grapheme have the same type, that type is returned. Otherwise, `special` is returned */
  type: GraphemeType;

  /** Whether the grapheme is supported by the default sets of fonts on common operating systems.
   * - true - the grapheme is known to be supported
   * - false - the grapheme is known not to be supported
   * - null - it is unknown whether the grapheme is supported or not
   */
  font_support_all_os: boolean | null;

  /** Description of the grapheme type */
  description: string;

  /** Unicode Version of the grapheme.
   * - null if the grapheme is not assigned to any version
   */
  unicode_version: string | null;
}

export interface InspectorConfusableGraphemeResult extends InspectorGraphemeResult {}

export interface InspectorConfusableMultiGraphemeResult {
  /** The confusable string */
  value: string;

  /** List of characters in the confusable */
  chars: InspectorCharResult[];
}

export type InspectorConfusableResult =
  | InspectorConfusableGraphemeResult
  | InspectorConfusableMultiGraphemeResult;

export interface InspectorGraphemeWithConfusablesResult extends InspectorGraphemeResult {
  /** Canonical form of confusable grapheme.
   * - may be null if canonical form is not known/does not exist
   * - may be null when simple_confusables is enabled and the canonical is not single-grapheme or not normalized
   */
  confusables_canonical: InspectorConfusableResult | null;

  /** List of confusable forms without the canonical.
   * - if the grapheme is not confusable then empty list is returned
   * - if simple_confusables is enabled then only single-grapheme normalized confusables are returned
   */
  confusables_other: InspectorConfusableResult[];
}

export enum PunycodeCompatibility {
  /** The label can be encoded in Punycode */
  Compatible = "COMPATIBLE",

  /** The Punycode encoded label contains disallowed characters */
  UnsupportedAscii = "UNSUPPORTED_ASCII",

  /** The input label is already Punycode encoded */
  PunycodeLiteral = "PUNYCODE_LITERAL", 

  /** The input label contains disallowed hyphens */
  InvalidLabelExtension = "INVALID_LABEL_EXTENSION",

  /** The Punycode encoded label exceeds 63 characters */
  LabelTooLong = "LABEL_TOO_LONG"
}

export interface InspectorResultBase {
  /** Input label */
  label: string;

  /** Status of the input label */
  status: LabelStatus;

  /** Version of the label inspector */
  version: string;

  /** Number of Unicode UTF-32 codepoints in the input label. Might be larger than the number of graphemes */
  char_length: number;

  /** Number of graphemes in the input label */
  grapheme_length: number;

  /** Type of all graphemes if all graphemes have the same type, otherwise null */
  all_type: string | null;

  /** List of all unique grapheme types that are present in the input label */
  any_types: string[];

  /** Script of all graphemes if all graphemes have the same script */
  all_script: string | null;

  /** List of unique script names of all graphemes */
  any_scripts: string[];

  /** Number of graphemes that are confusable */
  confusable_count: number;

  /** List of graphemes in the input label */
  graphemes: InspectorGraphemeWithConfusablesResult[];

  /** Input label where all confusables are replaced with their canonicals.
   * Is null if at least one confusable does not have a canonical
   */
  canonical_label: string | null;

  /** Input label where all confusables are replaced with their canonicals and run through ENSIP-15 normalization.
   * Is null if:
   * - at least one confusable does not have a canonical
   * - result contains disallowed characters and cannot be normalized
   */
  normalized_canonical_label: string | null;

  /** Beautified version of canonical_confusable_label. Is null if canonical_confusable_label is null */
  beautiful_canonical_label: string | null;

  /** Whether the input label is a valid DNS hostname according to RFC 1123.
   * Note: this label-level check does not enforce the full name limit of 253 characters, which can be checked externally
   */
  dns_hostname_support: boolean;

  /** Whether the input label is compatible with Punycode (RFC 3492) */
  punycode_compatibility: PunycodeCompatibility;

  /** Punycode (RFC 3492) encoded version of the input label.
   * Is null if the input label is not compatible with Punycode (see punycode_compatibility)
   */
  punycode_encoding: string | null;

  /** Whether all graphemes in the label are supported by the default sets of fonts on common operating systems.
   * - true - all graphemes are known to be supported
   * - false - at least one grapheme is known not to be supported
   * - null - at least one grapheme is unknown and zero graphemes are known not to be supported
   */
  font_support_all_os: boolean | null;
}

export interface InspectorResultNormalized extends InspectorResultBase {
  /** ENSIP-15 beautified version of the input label */
  beautiful_label: string;
}

export interface InspectorResultUnnormalized extends InspectorResultBase {
  /** Input label run through ENSIP-15 normalization.
   * Is null if the input label contains disallowed characters and cannot be normalized
   */
  normalized_label: string | null;

  /** ENSIP-15 normalized input label where all disallowed characters are removed.
   * Is null if the label cannot be cured
   */
  cured_label: string | null;

  /** Reason why the input label is not normalized */
  normalization_error_message: string;

  /** Details of the normalization error */
  normalization_error_details: string | null;

  /** Error code of the normalization error */
  normalization_error_code: string;

  /** 0-based index of the first disallowed character in the label.
   * - for some errors the disallowed sequence cannot be reported and this field becomes null
   */
  disallowed_sequence_start: number | null;

  /** A part of the label that is not normalized.
   * - for some errors the disallowed sequence cannot be reported and this field becomes null
   */
  disallowed_sequence: InspectorCharResult[] | null;

  /** A suggested replacement for the disallowed sequence.
   * - an empty list means that the disallowed sequence should be removed completely
   * - for some errors the disallowed sequence cannot be reported and this field becomes null
   */
  suggested_replacement: InspectorCharResult[] | null;
}

export type InspectorResult = InspectorResultNormalized | InspectorResultUnnormalized;

/** 
 * Represents a single tokenization result with its probability scores
 */
export interface Tokenization {
  /** The tokens that make up this tokenization */
  tokens: string[];
  /** The probability score for this tokenization, between 0 and 1 */
  probability: number;
  /** The natural log of the probability score, <= 0 */
  log_probability: number;
}

export interface NLPLabelAnalysis {
  /** The result of the label inspection */
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
   * The result of the NLP analysis on the label. If the label is not inspected, this field will be undefined.
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
