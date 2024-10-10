import fetch from "cross-fetch";
import { Normalization } from "@namehash/ens-utils";
import { isEthereumAddress, isTokenId, isKeccak256Hash } from "./utils";

const ETH_TLD = "eth";

/**
 * The ENSIP-15 normalization status of a grapheme.
 *
 * This check does not consider the context of the grapheme and is **not** equivalent to `ens_normalize(grapheme)`.
 * A normalized grapheme can be combined with other normalized graphemes to form an unnormalized label.
 * The position of a grapheme in a label can also affect the normalization status of the label.
 */
export type GraphemeNormalization =
  | "normalized" /** The grapheme is normalized. */
  | "unnormalized"; /** The grapheme is not normalized. */

/**
 * The network that NameGuard will use to inspect names/labels/graphemes.
 *
 * The network is used to determine:
 * 1. The ENS Subgraph that NameGuard will use to resolve:
 *   a. labelhashes into labels; or
 *   b. namehashes into names.
 * 2. Evaluating the name of an NFT and if it is a fake ENS name.
 * 3. Resolution of primary name lookups for impersonation checks.
 *
 * Note: The resolution of labelhashes into labels or namehashes into names is theoretically
 * not network dependent. However, the current implementation of NameGuard constrains
 * itself to making at most 1 request to 1 subgraph to resolve a labelhash or namehash. Therefore,
 * the network parameter can influence the result when inspecting a name containing a labelhash or
 * when inspecting a namehash for a name with labels that are not known to the ENS Subgraph on a
 * particular network.
 */
export type Network = "mainnet" | "sepolia";

/** The type of a check that NameGuard performed. */
export type CheckType =
  // Common checks
  | "normalized" /** A name/label/grapheme is normalized. */

  // Grapheme-level checks
  | "confusables" /** A grapheme is visually confusable. */
  | "invisible" /** A grapheme is invisible. */
  | "typing_difficulty" /** A grapheme is difficult to type. */
  | "font_support" /** A grapheme is not supported by common fonts. */

  // Label-level checks
  | "mixed_scripts" /** A label contains multiple scripts. */
  | "namewrapper_compatible" /** A label cannot be wrapped by the ENS NameWrapper */
  | "punycode_compatible_label" /** A label is not compatible with Punycode. */
  | "unknown_label" /** A label is unknown. */

  // Name-level checks
  | "impersonation_risk" /** A name might be used for impersonation. */
  | "punycode_compatible_name" /** A name is compatible with Punycode. */
  | "namewrapper_fuses" /** The NameWrapper configuration of a name is safe. */
  | "decentralized_name" /** A name is decentralized. */
  | "uninspected" /** A name was exceptionally long and was not inspected for performance reasons */;

/** The resulting status code of a check that NameGuard performed. */
export enum CheckResultCode {
  skip = "skip" /** This check was skipped because it was not applicable. */,
  info = "info" /** This check is informational only. */,
  pass = "pass" /** This check passed. */,
  warn = "warn" /** This check failed, this is a minor issue. */,
  alert = "alert" /** This check failed, this is a major issue. */,
}

/**
 * The consolidated rating that NameGuard places on a name/label/grapheme.
 *
 * Determined by NameGuard's rating algorithm that consolidates all of the `CheckResult`
 * values from all of the checks that NameGuard performed on a name/label/grapheme into
 * a single consolidated `Rating` value.
 *
 * - The `Rating` of a grapheme considers all `CheckResult` values for the grapheme.
 * - The `Rating` of a label considers all `CheckResult` values for the label and all of its graphemes.
 * - The `Rating` of a name considers all `CheckResult` values for the name and all of its labels and graphemes.
 */
export enum Rating {
  pass = "pass" /** All checks passed. */,
  warn = "warn" /** At least one check failed with a `WARN` status but no check failed with an `ALERT` status. */,
  alert = "alert" /** At least one check failed with an `ALERT` status. */,
}

/**
 * The status of a secure primary ENS name lookup performed by NameGuard.
 */
export type SecurePrimaryNameStatus =
  | "normalized" /** The ENS primary name was found and it is normalized. */
  | "no_primary_name" /** The ENS primary name was not found. */
  | "unnormalized" /** The ENS primary name was found, but it is not normalized. */
  | "uninspected" /** A name was exceptionally long and was not inspected for performance reasons */;

export type ImpersonationStatus =
  | "unlikely" /** The name is unlikely to be impersonating. */
  | "potential"; /** The name is potentially impersonating. */

export type FakeEthNameCheckStatus =
  | "authentic_eth_name" /** The NFT is associated with authentic ".eth" contracts. */
  | "impersonated_eth_name" /** The NFT appears to impersonate a ".eth" name. It doesn't belong to authentic ENS contracts but contains graphemes that visually resemble ".eth" at the end of relevant NFT metadata fields. Consider automated rejection of this NFT from marketplaces. */
  | "potentially_impersonated_eth_name" /** The NFT potentially impersonates a ".eth" name. It doesn't belong to authentic ENS contracts but contains graphemes that visually resemble ".eth" within relevant NFT metadata fields (but not at the end of those fields). Consider manual review of this NFT before publishing to marketplaces. */
  | "non_impersonated_eth_name" /** The NFT doesn't represent itself as a ".eth" name and doesn't belong to authentic ENS contracts. No string that visually resembles ".eth" was found within relevant NFT metadata fields. */
  | "unknown_nft" /** No information could be found on the requested NFT. This generally indicates that the NFT doesn't exist or hasn't been indexed yet. */
  | "invalid_eth_name" /** The NFT is associated with authentic ".eth" contracts, but it is unnormalized. */
  | "unknown_eth_name" /** The NFT is associated with authentic ".eth" contracts, but its label is unknown or has never been registered. */;

/**
 * The result of a fake eth name check that NameGuard performed on a contract address and token id.
 */
export interface FakeEthNameCheckResult {
  /** The resulting status code of the check that NameGuard performed. */
  status: FakeEthNameCheckStatus;

  /**
   * NameGuard report for the .eth ENS NFT.
   *
   * `null` if `status` is any value except `authentic_eth_name`, `invalid_eth_name` and `unknown_eth_name` (the NFT is not associated with authentic ".eth" contracts)
   */
  nameguard_report: NameGuardReport | null;

  /**
   * Fields with values from Alchemy response which are investigated (e.g. title, collection name, metadata) whether they look like fake .eth ENS name.
   *
   * `null` if `status` is `unknown_nft`
   */
  investigated_fields: Record<string, string> | null;
}

/**
 * The result of a check that NameGuard performed on a name/label/grapheme.
 */
export interface CheckResult {
  /** The type of check that NameGuard performed. */
  check: CheckType;

  // TODO: Update Python App so the name of this field is something more appropriate such as `result_code`.
  /** The resulting status code of the check that NameGuard performed. */
  status: CheckResultCode;

  /** A message describing the result of the check */
  message: string;

  /** A human-readable name for the check */
  check_name: string;
}

/**
 * The consolidated inspection result of all the risks and limitations NameGuard found within a name/label/grapheme.
 */
export interface ConsolidatedReport {
  /**
   * The consolidated rating that NameGuard places on a name/label/grapheme.
   *
   * Determined by NameGuard's rating algorithm that consolidates all of the `CheckResult`
   * values from all of the checks that NameGuard performed on a name/label/grapheme into
   * a single consolidated `Rating` value.
   *
   * - The `Rating` of a grapheme considers all `CheckResult` values for the grapheme.
   * - The `Rating` of a label considers all `CheckResult` values for the label and all of its graphemes.
   * - The `Rating` of a name considers all `CheckResult` values for the name and all of its labels and graphemes.
   */
  rating: Rating;

  /** A human-readable title based on the `rating` */
  title: string;

  /** A human-readable subtitle based on the `rating` */
  subtitle: string;

  /** The number of `CheckResult` values on a name/label/grapheme with a `CheckStatusCode` of `alert` or `warn`. */
  risk_count: number;

  /**
   * The `CheckResult` considered to be the highest risk. `null` if and only if `risk_count` is 0.
   */
  highest_risk: CheckResult | null;
}

export interface ConsolidatedGraphemeGuardReport extends ConsolidatedReport {
  /**
   * The inspected grapheme.
   *
   * Potential values include:
   *
   * 1. A single character.
   * 2. A sequence of characters that represent a single grapheme.
   * 3. A grapheme that does not pass ENSIP-15 normalization.
   *
   * Never an empty string.
   */
  grapheme: string;

  /**
   * The ENSIP-15 normalization status of `grapheme`.
   */
  normalization: GraphemeNormalization;

  /**
   * The name of `grapheme`.
   */
  grapheme_name: string;

  /**
   * The type of `grapheme`.
   */
  grapheme_type: string;

  /**
   * The name of the script associated with `grapheme`.
   */
  grapheme_script: string;

  /**
   * A user-friendly description of the grapheme type.
   */
  grapheme_description: string;

  /**
   * The Unicode version in which the grapheme was introduced or assigned.
   *
   * `null` if the grapheme is not assigned to any specific Unicode version.
   */
  unicode_version: string | null;
}

export interface ConfusableGuardReport extends ConsolidatedGraphemeGuardReport {
  /**
   * The canonical status for the current grapheme.
   */
  is_canonical: boolean;
}

/**
 * The result of a NameGuard inspection on a grapheme.
 */
export interface GraphemeGuardReport extends ConsolidatedGraphemeGuardReport {
  /**
   * A list of the results of all the checks that NameGuard performed while inspecting the grapheme.
   */
  checks: CheckResult[];

  /**
   * An optional link to an "external" webpage with additional details about `grapheme`.
   *
   * `null` for many multi-character graphemes that are not emojis.
   */
  grapheme_link: string | null;

  /**
   * The name of the webpage that `grapheme_link` links to.
   *
   * "No link is available" if `grapheme_link` is `null`.
   */
  grapheme_link_name: string;

  /**
   * The codepoints of the grapheme in the format `U+XXXX`.
   * Some graphemes may have multiple codepoints.
   */
  codepoints: string[];

  /**
   * A list of `ConfusableGuardReport` values that might be confused with the analyzed `grapheme`.
   *
   * To be considered a confusable, a grapheme must meet all of the following criteria:
   * 1. They might be considered visually confusable with `grapheme`.
   * 2. They must not be equal to `grapheme`.
   * 3. They are considered "less-canonical" than `grapheme`, not "more-canonical".
   * 4. They are ENS normalized (i.e. graphemes that couldn't appear in a normalized ENS name are not included in this list).
   * 5. They are not multi-grapheme confusables (support for these is planned to be added later).
   *
   * If a canonical confusable is found, it will be the first element in the list.
   */
  confusables: ConfusableGuardReport[];

  /**
   * The grapheme considered to be the canonical form of the analyzed `grapheme`.
   *
   * `null` if and only if the canonical form of `grapheme` is considered to be undefined.
   *
   * A name / label constructed from repeated instances of this `canonical_grapheme` is not guaranteed to be normalized.
   * A name / label is not guaranteed to be normalized even if all graphemes are normalized.
   */
  canonical_grapheme: string | null;
}

/**
 * The result of a NameGuard inspection on a label.
 */
export interface LabelGuardReport extends ConsolidatedReport {
  /**
   * The inspected label.
   *
   * Potential values include:
   *
   * 1. An empty string, such as in the case that a label symbolically represents the ENS namespace root.
   * 2. If `normalization` is `unknown` then this field will always be a string in the format "[labelhash]".
   */
  label: string;

  /**
   * The labelhash of `label` in hex format prefixed with `0x`
   *
   * If `normalization` is `unknown` then `label` will always be a string in the format "[labelhash]" and
   * the `labelhash` will therefore be the "labelhash" value embedded within `label`, rather than
   * the labelhash of the literal `label`.
   */
  labelhash: string;

  /** The ENSIP-15 normalization status of `label` */
  normalization: Normalization;

  /** Beautified version of `label` */
  beautiful_label: string;

  /**
   * A list of the results of all the checks that NameGuard performed while inspecting `label`.
   */
  checks: CheckResult[];

  /**
   * A list of `ConsolidatedGraphemeGuardReport` values for each grapheme contained within `label`.
   *
   * `null` if and only if `normalization` is `Normalization.Unknown`.
   */
  graphemes: ConsolidatedGraphemeGuardReport[] | null;

  /**
   * The label considered to be the canonical form of the analyzed `label`.
   *
   * `null` if and only if the canonical form of `label` is considered to be undefined.
   *
   * If not `null`, it is guaranteed that the `canonical_label` is normalized.
   *
   * If `normalization` is `Normalization.Unknown`, then `canonical_label` will be `[labelhash]`.
   */
  canonical_label: string | null;
}

/**
 * The consolidated inspection results of all the risks and limitations NameGuard found within a name.
 *
 * Generated through a detailed inspection of all labels and graphemes within `name`.
 *
 * A `ConsolidatedNameGuardReport` consolidates the results of all `checks` on all labels and graphemes in a
 * `NameGuardReport` into a `ConsolidatedReport` without the need to explicitly return all
 * the details of the `NameGuardReport`.
 */
export interface ConsolidatedNameGuardReport extends ConsolidatedReport {
  /** The name that NameGuard inspected. Some labels in this name may be represented as "[labelhash]"
   * if and only if all of the following is true:
   *
   * 1. The query sent to NameGuard when requesting the report represented the label as a "[labelhash]".
   * 2. The decoded label of "[labelhash]" was not found within the ENS Subgraph for the specified `network`.
   */
  name: string;

  /** The ENSIP-1 namehash of the name in hex format prefixed with 0x. */
  namehash: string;

  /** The ENSIP-15 normalization status of `name` */
  normalization: Normalization;

  /** Beautified version of `name` */
  beautiful_name: string;

  /** Whether or not the name was inspected. If `false` then the name was exceptionally long and was not inspected for performance reasons */
  inspected: boolean;
}

/**
 * NameGuard report that contains the full results of all `checks` on all `labels` in a name.
 */
export interface AbstractNameGuardReport extends ConsolidatedNameGuardReport {
  /** The results of all checks performed by NameGuard on `name`. */
  checks: CheckResult[];

  /** Details of the inspection of all labels in `name`.
   *
   * defined if and only if `inspected` is `true`.
   */
  labels?: LabelGuardReport[];

  /**
   * The name considered to be the canonical form of the analyzed `name`.
   *
   * defined if and only if all of the following are `true`:
   * - `inspected` is `true`,
   * - the canonical form of `name` is considered to be defined (all characters in `name` have defined canonical forms).
   *
   * If a label is represented as `[labelhash]` in `name`,
   * the `canonical_name` will also contain the label represented as `[labelhash]`.
   *
   * `canonical_name` is guaranteed to be normalized with the exception of the case
   * where `normalization` is `Normalization.Unknown` and one or more labels are represented as `[labelhash]`.
   */
  canonical_name?: string;
}

export interface InspectedNameGuardReport extends AbstractNameGuardReport {
  labels: LabelGuardReport[];
  inspected: true;
}

/**
 * NameGuard report for a name that was exceptionally long and was not inspected for performance reasons.
 */
export interface UninspectedNameGuardReport extends AbstractNameGuardReport {
  labels?: undefined;
  canonical_name?: undefined;
  inspected: false;
  rating: Rating.alert;
  risk_count: 1;
}

/**
 * `InspectedNameGuardReport` if `inspected` field is `true`, else `UninspectedNameGuardReport`.
 */
export type NameGuardReport =
  | InspectedNameGuardReport
  | UninspectedNameGuardReport;

export interface BulkConsolidatedNameGuardReport {
  results: ConsolidatedNameGuardReport[];
}

export interface SecurePrimaryNameResult {
  /**
   * Secure primary name status of the Ethereum address.
   */
  primary_name_status: SecurePrimaryNameStatus;

  /**
   * Impersonation status of the `primary_name`.
   *
   * `null` if `primary_name` is `null`.
   */
  impersonation_status: ImpersonationStatus | null;

  /**
   * Primary ENS name for the Ethereum address.
   *
   * `null` if `primary_name_status` is any value except `normalized`.
   */
  primary_name: string | null;

  /**
   * ENS beautified version of `primary_name`.
   *
   * If `primary_name` is `null` then provides a fallback `display_name` of "Unnamed [first four hex digits of Ethereum address]", e.g. "Unnamed c2a6".
   */
  display_name: string;

  /**
   * NameGuard report for the `primary_name`.
   *
   * * `null` if `primary_name_status` is `no_primary_name` (primary name is not found)
   * * `null` if `SecurePrimaryNameOptions.returnNameGuardReport` is `false` or not provided
   */
  nameguard_report: NameGuardReport | null;
}

export enum NameGuardErrorType {
  Server = "Server",
  Network = "Network",
  Timeout = "Timeout",
  Abort = "Abort",
  Input = "Input",
  NotFound = "NotFound",
  Unknown = "Unknown",
}

/**
 * Custom error class for NameGuard-specific errors.
 * This class extends the built-in Error class to provide more context about NameGuard-related errors.
 */
export class NameGuardError extends Error {
  /**
   * Creates a new NameGuardError instance.
   *
   * @param {NameGuardErrorType} type - The type of NameGuard error that occurred.
   * @param {number} [status] - The HTTP status code associated with the error, if applicable.
   *                            This is typically used for server errors to indicate the HTTP response status.
   * @param {string} [message] - A custom error message. If not provided, a default message is generated based on the error type.
   */
  constructor(
    public type: NameGuardErrorType,
    public status?: number,
    message?: string,
  ) {
    super(message || `NameGuard ${type} Error`);
    this.name = "NameGuardError";
  }
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

const DEFAULT_ENDPOINT = "https://api.nameguard.io";
const DEFAULT_NETWORK: Network = "mainnet";
const DEFAULT_INSPECT_LABELHASH_PARENT = ETH_TLD;
export const DEFAULT_COMPUTE_NAMEGUARD_REPORT = false;
const MAX_BULK_INSPECTION_NAMES = 250;

/** includes label separators */
export const MAX_INSPECTED_NAME_CHARACTERS = 200;

/** includes duplicated unknown labels */
const MAX_INSPECTED_NAME_UNKNOWN_LABELS = 5;

export interface NameGuardOptions {
  endpoint?: string;
  network?: Network;
  timeout?: number;
}

interface InspectLabelhashOptions {
  parent?: string;
}

export interface SecurePrimaryNameOptions {
  returnNameGuardReport?: boolean;
}

interface FieldsWithRequiredTitle extends Record<string, string> {
  title: string;
}

export class NameGuard {
  private endpoint: URL;
  protected network: Network;
  private activeRequests: Set<AbortController> = new Set();
  private timeout: number;

  /**
   * Creates a new instance of the NameGuard client.
   *
   * @param {NameGuardOptions} options - Configuration options for NameGuard.
   * @param {string} [options.endpoint] - The base URL for the NameGuard API. Defaults to 'https://api.nameguard.io'.
   * @param {Network} [options.network] - The Ethereum network to use. Defaults to 'mainnet'.
   * @param {number} [options.timeout] - The timeout in milliseconds for requests. Defaults to 30000 (30 seconds).
   */
  constructor({
    endpoint = DEFAULT_ENDPOINT,
    network = DEFAULT_NETWORK,
    timeout = 30000,
  }: NameGuardOptions = {}) {
    this.endpoint = new URL(endpoint);
    this.network = network;
    this.timeout = timeout;
  }

  /**
   * Inspects a single name with NameGuard.
   *
   * If `name` includes unknown labels then this function will attempt automated labelhash resolution through the ENS Subgraph
   * using the network specified in the `NameGuard` instance. Therefore the returned `name` may not match the provided `name`, but is guaranteed to have a matching `namehash`.
   *
   * @param {string} name The name for NameGuard to inspect.
   * @returns {Promise<NameGuardReport>} A promise that resolves with the `NameGuardReport` of the name. Check the `inspected` field of the result to determine if the result is an `InspectedNameGuardReport` or an `UninspectedNameGuardReport` for performance reasons in the case that the provided `name` was exceptionally long.
   * @throws {NameGuardError} If there's an issue with the input, network, or server.
   * @example
   * const nameGuardReport = await nameguard.inspectName('vitalik.eth');
   * console.log(nameGuardReport.name); // 'vitalik.eth'
   * console.log(nameGuardReport.rating); // 'pass'
   */
  public async inspectName(name: string): Promise<NameGuardReport> {
    const network_name = this.network;

    try {
      return await this.rawRequest("inspect-name", "POST", {
        name,
        network_name,
      });
    } catch (error) {
      if (error instanceof NameGuardError) {
        throw error;
      }

      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        `Invalid input: ${isError(error) ? error.message : "Unknown error"}`,
      );
    }
  }

  // TODO: Document how this API will attempt automated labelhash resolution through the ENS Subgraph.
  /**
   * Inspects up to 250 names at a time with NameGuard.
   *
   * For each name provided in `names`, this function returns a `ConsolidatedNameGuardReport` containing:
   *   1. Consolidated details of all checks performed on the name, including checks on individual labels and graphemes.
   *
   * Each `ConsolidatedNameGuardReport` returned represents an equivalent set of checks as a `NameGuardReport`. However:
   *   1. A `NameGuardReport` contains a lot of additional data that isn't always needed / desired when a `ConsolidatedNameGuardReport` will do.
   *   2. When NameGuard only needs to return a `ConsolidatedNameGuardReport`, some special performance optimizations
   *      are possible (and completely safe) that help to accelerate responses in many cases.
   *
   * This function will attempt automated labelhash resolution through the ENS Subgraph,
   * using the network specified in the NameGuard instance.
   *
   * @param {string[]} names The list of names for NameGuard to inspect.
   * @returns {Promise<BulkConsolidatedNameGuardReport>} A promise that resolves with a list of `ConsolidatedNameGuardReport` values for each name queried in the bulk inspection. Check the `inspected` field of each report to determine if the name was fully inspected or inspected in a limited way for performance reasons.
   * @throws {NameGuardError} If there's an issue with the input (e.g., too many names), network, or server.
   * @example
   * const names = ['vitalik.eth', 'ethereum.eth'];
   * const bulkReport = await nameguard.bulkInspectNames(names);
   * console.log(bulkReport.results.length); // 2
   * console.log(bulkReport.results[0].name); // 'vitalik.eth'
   */
  public async bulkInspectNames(
    names: string[],
  ): Promise<BulkConsolidatedNameGuardReport> {
    if (names.length > MAX_BULK_INSPECTION_NAMES) {
      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        `Bulk inspection of more than ${MAX_BULK_INSPECTION_NAMES} names at a time is not supported.`,
      );
    }

    const network_name = this.network;

    try {
      return await this.rawRequest("bulk-inspect-names", "POST", {
        names,
        network_name,
      });
    } catch (error) {
      if (error instanceof NameGuardError) {
        throw error;
      }

      throw new NameGuardError(
        NameGuardErrorType.Unknown,
        undefined,
        isError(error) ? error.message : "Unknown error",
      );
    }
  }

  // TODO: We need to have more specialized error handling here for cases such as the lookup in the ENS Subgraph failing.
  // TODO: Update the comment below to be more specific on the types of errors that could be returned here.
  /**
   * Inspects the name associated with a namehash.
   *
   * NameGuard will attempt to resolve the name associated with the namehash through the ENS Subgraph.
   * If this resolution succeeds then NameGuard will return a `NameGuardReport` for the name.
   * If this resolution fails then NameGuard will return an error.
   *
   * @param {string} namehash A namehash should be a decimal or a hex (prefixed with 0x) string.
   * @returns {Promise<NameGuardReport>} A promise that resolves with the `NameGuardReport` of the name. Check the `inspected` field of the result to determine if the result is an `InspectedNameGuardReport` or an `UninspectedNameGuardReport` for performance reasons in the case that the provided `name` was exceptionally long.
   * @throws {NameGuardError} If the inspection fails due to network issues, server errors, if the namehash cannot be resolved to a name, or if the provided `namehash` is not in a valid Keccak256 hash format.
   * @example
   * const namehash = '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835';
   * const nameGuardReport = await nameguard.inspectNamehash(namehash);
   * console.log(nameGuardReport.name); // 'vitalik.eth'
   */
  public async inspectNamehash(namehash: string): Promise<NameGuardReport> {
    if (!isKeccak256Hash(namehash)) {
      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        "Invalid Keccak256 hash format for namehash.",
      );
    }

    const network = this.network;

    try {
      const url = new URL(
        `inspect-namehash/${network}/${namehash}`,
        this.endpoint,
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new NameGuardError(
          NameGuardErrorType.Server,
          response.status,
          `Failed to inspect namehash ${namehash} using the network ${network}.`,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof NameGuardError) {
        throw error;
      }

      throw new NameGuardError(
        NameGuardErrorType.Unknown,
        undefined,
        isError(error) ? error.message : "Unknown error",
      );
    }
  }

  // TODO: The main purpose of this function is to pass a tokenId rather than a labelhash. However we need to make changes
  //        here to properly support this use case.
  // TODO: We need to have more specialized error handling here for cases such as the lookup in the ENS Subgraph failing.
  // TODO: Update the comment below to be more specific on the types of errors that could be returned here.
  /**
   * Inspects the name "[{labelhash}].{parent}".
   *
   * Parent (`options.parent`) may be a name with any number of labels. The default parent is "eth".
   *
   * This is a convenience function to generate a `NameGuardReport` in cases when you only have:
   *   1. The labelhash of the "childmost" label of a name.
   *   2. The complete parent name of the "childmost" label.
   *
   * NameGuard always inspects names, rather than labelhashes. So this function will first attempt
   * to resolve the "childmost" label associated with the provided labelhash through the ENS Subgraph,
   * using the network specified in the NameGuard instance.
   *
   * If this label resolution fails the resulting `NameGuardReport` will be equivalent to requesting
   * a `NameGuardReport` for the name "[{labelhash}].{parent}" which will contain (at least) one label
   * with an `unknown` `Normalization`.
   *
   * If this label resolution succeeds the resulting `NameGuardReport` will be equivalent to requesting
   * a `NameGuardReport` for the name "{label}.{parent}".
   *
   * @param {string} labelhash A labelhash should be a decimal or a hex (prefixed with 0x) string.
   * @param {InspectLabelhashOptions} options The options for the inspection.
   * @returns {Promise<NameGuardReport>} A promise that resolves with the `NameGuardReport` of the name. Check the `inspected` field of the result to determine if the result is an `InspectedNameGuardReport` or an `UninspectedNameGuardReport` for performance reasons in the case that the provided `name` was exceptionally long.
   * @throws {NameGuardError} If the provided `labelhash` is not in a valid Keccak256 hash format, or if there are network or server issues.
   * @example
   * const labelhash = '0x7d77fe9f36d36e8efa8870b9f50d95e0e9a58a4fee34b1f588094a247d91e8a5';
   * const nameGuardReport = await nameguard.inspectLabelhash(labelhash, { parent: 'eth' });
   * console.log(nameGuardReport.name); // 'vitalik.eth'
   */
  public async inspectLabelhash(
    labelhash: string,
    options?: InspectLabelhashOptions,
  ): Promise<NameGuardReport> {
    if (!isKeccak256Hash(labelhash)) {
      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        "Invalid Keccak256 hash format for labelhash.",
      );
    }

    const parent = options?.parent || DEFAULT_INSPECT_LABELHASH_PARENT;

    try {
      if (parent === "") {
        return await this.inspectName(`[${labelhash}]`);
      } else {
        return await this.inspectName(`[${labelhash}].${parent}`);
      }
    } catch (error) {
      if (error instanceof NameGuardError) {
        throw error;
      }

      throw new NameGuardError(
        NameGuardErrorType.Unknown,
        undefined,
        isError(error) ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Inspects a single grapheme.
   *
   * @param {string} grapheme The grapheme to inspect. Must be a single grapheme (i.e. a single character or a sequence of characters that represent a single grapheme).
   * @returns {Promise<GraphemeGuardReport>} A promise that resolves with a `GraphemeGuardReport` of the inspected grapheme.
   * @throws {NameGuardError} If the grapheme is empty or if there are network or server issues.
   * @example
   * const graphemeReport = await nameguard.inspectGrapheme('ξ');
   * console.log(graphemeReport.grapheme); // 'ξ'
   * console.log(graphemeReport.grapheme_name); // 'GREEK SMALL LETTER XI'
   */
  public async inspectGrapheme(grapheme: string): Promise<GraphemeGuardReport> {
    if (!grapheme || grapheme.length === 0) {
      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        "Grapheme must not be empty.",
      );
    }

    const grapheme_encoded = encodeURIComponent(grapheme);

    try {
      return await this.rawRequest(`inspect-grapheme/${grapheme_encoded}`);
    } catch (error) {
      if (error instanceof NameGuardError) {
        throw error;
      }

      throw new NameGuardError(
        NameGuardErrorType.Unknown,
        undefined,
        isError(error) ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Performs a reverse lookup of an Ethereum `address` to a primary name.
   *
   * Data sources for the primary name lookup include:
   * 1. The Ethereum Provider configured in the NameGuard instance.
   * 2. For ENS names using CCIP-Read: requests to externally defined gateway servers.
   *
   * Returns `display_name` to be shown to users and estimates `impersonation_status`
   *
   * If `address` has a primary name and `options.returnNameGuardReport` is `true`, then NameGuard will attempt to inspect that primary name. Else, NameGuard will not perform any primary name inspection and the returned `nameguard_report` field will be `null`.
   *
   * @param {string} address An Ethereum address.
   * @param {SecurePrimaryNameOptions} options The options for the secure primary name.
   * @returns {Promise<SecurePrimaryNameResult>} A promise that resolves with a `SecurePrimaryNameResult`.
   * @throws {NameGuardError} If the provided address is not a valid Ethereum address format, or if there are network or server issues.
   * @example
   * const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
   * const securePrimaryName = await nameguard.getSecurePrimaryName(address);
   * console.log(securePrimaryName.primary_name); // 'vitalik.eth'
   * console.log(securePrimaryName.impersonation_status); // 'unlikely'
   */
  public async getSecurePrimaryName(
    address: string,
    options?: SecurePrimaryNameOptions,
  ): Promise<SecurePrimaryNameResult> {
    if (!isEthereumAddress(address)) {
      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        `The provided address: "${address}" is not in a valid Ethereum address format.`,
      );
    }

    const network_name = this.network;
    const returnNameGuardReport =
      options?.returnNameGuardReport || DEFAULT_COMPUTE_NAMEGUARD_REPORT;

    // TODO: We need to add a `computeNameGuardReport` parameter to the API.
    try {
      let response = await this.rawRequest(
        `secure-primary-name/${network_name}/${address}?return_nameguard_report=${returnNameGuardReport}`,
      );

      if (!returnNameGuardReport) {
        response.nameguard_result = null;
      }

      return response;
    } catch (error) {
      if (error instanceof NameGuardError) {
        throw error;
      }
      throw new NameGuardError(
        NameGuardErrorType.Unknown,
        undefined,
        isError(error) ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Performs a fake .eth ENS name check based on given NFT metadata.
   *
   * This function checks if the metadata of an NFT looks like a fake .eth ENS name.
   *
   * @param {string} contract_address Contract address for the NFT contract (ERC721 and ERC1155 supported).
   * @param {string} token_id The ID of the token (in hex or decimal format).
   * @param {FieldsWithRequiredTitle} fields Fields with values which will be investigated (e.g. title, collection name, metadata) whether they look like fake .eth ENS name. `title` key is mandatory, for ENS contracts it should be the ENS name.
   * @returns {Promise<FakeEthNameCheckResult>} A promise that resolves with a `FakeEthNameCheckResult`.
   * @throws {NameGuardError} If the provided contract_address is not a valid Ethereum address format, if the token_id is not in a valid format, if the fields object is missing or doesn't contain a 'title' key with a string value, or if there are network or server issues.
   * @example
   * const contractAddress = '0x495f947276749ce646f68ac8c248420045cb7b5e';
   * const tokenId = '123456';
   * const fields = { title: 'fake-vitalik.eth' };
   * const fakeEthNameResult = await nameguard.fakeEthNameCheck(contractAddress, tokenId, fields);
   * console.log(fakeEthNameResult.status); // 'impersonated_eth_name'
   */
  public async fakeEthNameCheck(
    contract_address: string,
    token_id: string,
    fields: FieldsWithRequiredTitle,
  ): Promise<FakeEthNameCheckResult> {
    if (!isEthereumAddress(contract_address)) {
      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        `The provided address: "${contract_address}" is not in a valid Ethereum address format.`,
      );
    }

    if (!isTokenId(token_id)) {
      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        `The provided token_id: "${token_id}" is not in a valid token id format.`,
      );
    }

    if (!fields || !fields.title || typeof fields.title !== "string") {
      throw new NameGuardError(
        NameGuardErrorType.Input,
        undefined,
        "The 'fields' object must be provided and contain a 'title' key with a string value.",
      );
    }

    const network_name = this.network;

    try {
      return await this.rawRequest("fake-eth-name-check", "POST", {
        network_name,
        contract_address,
        token_id,
        fields,
      });
    } catch (error) {
      if (error instanceof NameGuardError) {
        throw error;
      }

      throw new NameGuardError(
        NameGuardErrorType.Unknown,
        undefined,
        isError(error) ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Performs a raw HTTP request to the NameGuard API.
   * This method is primarily for internal use but can be utilized for custom API calls.
   *
   * @param {string} path - The API endpoint path.
   * @param {string} [method='GET'] - The HTTP method (e.g., 'GET', 'POST').
   * @param {object} [body={}] - The request body for POST requests.
   * @param {object} [headers={}] - Additional headers for the request.
   * @returns {Promise<any>} The response from the API.
   * @throws {NameGuardError} If there's a network error, server error, or if the request is aborted.
   */
  async rawRequest(
    path: string,
    method: string = "GET",
    body: object = {},
    headers: object = {},
  ): Promise<any> {
    const url = new URL(path, this.endpoint);

    const abortController = new AbortController();
    this.activeRequests.add(abortController);

    const timeoutId = setTimeout(() => {
      if (!abortController.signal.aborted) {
        abortController.abort("timeout");
      }
    }, this.timeout);

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: abortController.signal,
    };

    if (method !== "GET") {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      clearTimeout(timeoutId);

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new NameGuardError(
              NameGuardErrorType.Input,
              response.status,
              "Bad request: The server could not understand the request",
            );
          case 404:
            throw new NameGuardError(
              NameGuardErrorType.NotFound,
              response.status,
              "Not Found: The requested resource could not be found",
            );
          default:
            if (response.status >= 500) {
              throw new NameGuardError(
                NameGuardErrorType.Server,
                response.status,
                `Server error: ${response.statusText}`,
              );
            } else {
              throw new NameGuardError(
                NameGuardErrorType.Unknown,
                response.status,
                `Unexpected error: ${response.statusText}`,
              );
            }
        }
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        if (abortController.signal.reason === "timeout") {
          throw new NameGuardError(
            NameGuardErrorType.Timeout,
            undefined,
            `Request timed out after ${this.timeout}ms`,
          );
        } else {
          throw new NameGuardError(
            NameGuardErrorType.Abort,
            undefined,
            "Request was aborted",
          );
        }
      }

      if (error instanceof NameGuardError) {
        throw error;
      } else if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new NameGuardError(
            NameGuardErrorType.Timeout,
            undefined,
            "Request timed out or was aborted",
          );
        } else if (
          error.message === "Failed to fetch" ||
          error.message.includes("Network request failed")
        ) {
          throw new NameGuardError(
            NameGuardErrorType.Network,
            undefined,
            "Network error: Unable to reach the server",
          );
        }
      }

      throw new NameGuardError(
        NameGuardErrorType.Unknown,
        undefined,
        `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      clearTimeout(timeoutId);
      this.activeRequests.delete(abortController);
    }
  }

  /**
   * Aborts all pending requests.
   * This method can be used to cancel all ongoing NameGuard API requests.
   * Any pending requests will fail with an AbortError, which can be caught and handled where those requests are made.
   */
  public abortAllRequests(): void {
    for (const controller of this.activeRequests) {
      controller.abort();
    }
    this.activeRequests.clear();
  }
}

/**
 * Creates a new instance of a NameGuard client.
 *
 * @param {NameGuardOptions} [options] - Configuration options for NameGuard.
 * @example
 * import { createClient } from '@namehash/nameguard';
 * const nameguard = createClient({ ... })
 */
export function createClient(options?: NameGuardOptions) {
  return new NameGuard(options);
}

const defaultClient = createClient();

/**
 * `NameGuard` provides methods to inspect and prevent malicious use of ENS names.
 * It can inspect individual names or batch names.
 * @example
 * import { nameguard } from '@namehash/nameguard';
 * const fameGuardReport = await nameguard.inspectName('vitalik.eth');
 */
export const nameguard = defaultClient;
