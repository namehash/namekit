import "whatwg-fetch";
import {
  countGraphemes,
  isEthereumAddress,
  isTokenId,
  isKeccak256Hash,
} from "./utils";

const ETH_TLD = "eth";

/**
 * The ENSIP-15 normalization status of a name/label.
 *
 * If a label is in the format "[labelhash]" then the `Normalization` of the label is considered to be `unknown`.
 * If a name contains any label that is `unnormalized` then the `Normalization` of the entire name is considered to be `unnormalized`.
 * If a name contains no `unnormalized` labels but 1 or more `unknown` labels then the entire name is considered to be `unknown`.
 * A name is `normalized` if and only if all of its labels are `normalized`.
 */
export type Normalization =
  | "normalized" /** `normalized`: The name or label is normalized. */
  | "unnormalized" /** `unnormalized`: The name or label is not normalized. */
  | "unknown" /** `unknown`: The name or label is unknown because it cannot be looked up from its hash. */;

/**
 * The network that NameGuard will use to inspect a names/labels/graphemes.
 *
 * The network is used to determine:
 * 1. The ENS Subgraph that NameGuard will use to resolve:
 *   1. labelhashes into labels; or
 *   2. namehashes into names.
 * 2. Evaluating the name of an NFT and if it is a fake ENS name.
 * 3. Resolution of primary name lookups for impersonation checks.
 *
 * The resolution of labelhashes into labels or namehashes into names is theoretically
 * not network dependant. However, the current implementation of NameGuard constrains
 * itself to making at most 1 request to 1 subgraph to resolve a labelhash or namehash. Therefore
 * the network parameter can influence the result when inspecting a name containing a labelhash or
 * when inspecting a namehash for a name with labels that are not known to the ENS Subgraph on a
 * particular network.
 */
export type Network = "mainnet" | "goerli" | "sepolia";

/** The type of a check that NameGuard performed. */
export type CheckType =
  // Grapheme-level checks
  | "confusables" /** A grapheme is visually confusable. */
  | "invisible" /** A grapheme is invisible. */
  | "typing_difficulty" /** A grapheme is difficult to type. */
  | "font_support" /** A grapheme is not supported by common fonts. */

  // Label-level checks
  | "mixed_scripts" /** A label contains multiple scripts. */
  | "namewrapper_compatible" /** A label cannot be wrapped by the ENS NameWrapper */
  | "normalized" /** A label is not ENSIP-15 normalized. */
  | "punycode_compatible_label" /** A label is not compatible with Punycode. */
  | "unknown_label" /** A label is unknown. */

  // Name-level checks
  | "impersonation_risk" /** A name might be used for impersonation. */
  | "punycode_compatible_name" /** A name is compatible with Punycode. */;

/** The resulting status code of a check that NameGuard performed. */
export type CheckResultCode =
  | "skip" /** `skip`: This check was skipped because it was not applicable. */
  | "info" /** `info`: This check is informational only. */
  | "pass" /** `pass`: This check passed. */
  | "warn" /** `warn`: This check failed, this is a minor issue. */
  | "alert" /** `alert`: This check failed, this is a major issue. */;

/**
 * The consolidated rating that NameGuard places on a name/label/grapheme.
 *
 * Determined by NameGuard's rating algorithm that consolidates all of the `CheckResult`
 * values from all of the checks that NameGuard performed on a name/label/grapheme into
 * a single consolidated `Rating` value.
 *
 * The `Rating` of a grapheme considers all `CheckResult` values for the grapheme.
 * The `Rating` of a label considers all `CheckResult` values for the label and all of its graphemes.
 * The `Rating` of a name considers all `CheckResult` values for the name and all of its labels and graphemes.
 */
export type Rating =
  | "pass" /** `pass`: All checks passed. */
  | "warn" /** `warn`: At least one check failed with a `WARN` status but no check failed with an `ALERT` status. */
  | "alert" /** `alert`: At least one check failed with an `ALERT` status. */;

/**
 * The status of a reverse ENS lookup performed by NameGuard.
 * */
export type SecureReverseLookupStatus =
  | "normalized" /** The ENS primary name was found and it is normalized. */
  | "no_primary_name" /** The ENS primary name was not found. */
  | "unnormalized" /** The ENS primary name was found, but it is not normalized. */;

export type ImpersonationStatus =
  | "unlikely" /** The address is unlikely to be impersonating. */
  | "potential" /** The address is potentially impersonating. */
  
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
  nameguard_result: NameGuardReport | null;

  /**
   * Fields with values from Alchemy response which are investigated (e.g. title, collection name, metadata) whether they look like fake .eth ENS name.
   *
   * `null` if `status` is `unknown_nft`
   */
  investigated_fields: object | null; // TODO: dict[str,str] | null
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
   * The `Rating` of a grapheme considers all `CheckResult` values for the grapheme.
   * The `Rating` of a label considers all `CheckResult` values for the label and all of its graphemes.
   * The `Rating` of a name considers all `CheckResult` values for the name and all of its labels and graphemes.
   */
  rating: Rating;

  /** A human-readable title based on the `rating` */
  title: string;

  /** A human-readable subtitle based on the `rating` */
  subtitle: string;

  /* The number of `CheckResult` values on a name/label/grapheme with a `CheckStatusCode` of `alert` or `warn`. */
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
   * */
  grapheme_description: string;
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
   * A list of `ConsolidatedGraphemeGuardReport` values that might be confused with the analyzed `grapheme`.
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
  confusables: ConsolidatedGraphemeGuardReport[];

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
   * */
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
   * `null` if and only if `normalization` is `unknown`.
   */
  graphemes: ConsolidatedGraphemeGuardReport[] | null;

  /**
   * The label considered to be the canonical form of the analyzed `label`.
   *
   * `null` if and only if the canonical form of `label` is considered to be undefined.
   *
   * If not `null`, it is guaranteed that the `canonical_label` is normalized.
   *
   * If `normalization` is `unknown`, then `canonical_label` will be `[labelhash]`.
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
interface ConsolidatedNameGuardReport extends ConsolidatedReport {
  /* The name that NameGuard inspected. Some labels in this name may be represented as "[labelhash]"
   * if and only if all of the following is true:
   *
   * 1. The query sent to NameGuard when requesting the report represented the label as a "[labelhash]".
   * 2. The decoded label of "[labelhash]" was not found within the ENS Subgraph for the specified `network`.
   */
  name: string;

  /* The ENSIP-1 namehash of the name in hex format prefixed with 0x. */
  namehash: string;

  /* The ENSIP-15 normalization status of `name` */
  normalization: Normalization;

  /** Beautified version of `name` */
  beautiful_name: string;
}

/**
 * NameGuard report that contains the full results of all `checks` on all `labels` in a name.
 */
export interface NameGuardReport extends ConsolidatedNameGuardReport {
  /* The results of all checks performed by NameGuard on `name`. */
  checks: CheckResult[];

  /** Details of the inspection of all labels in `name`. */
  labels: LabelGuardReport[];

  /**
   * The name considered to be the canonical form of the analyzed `name`.
   *
   * `null` if and only if the canonical form of `name` is considered to be undefined.
   *
   * If a label is represented as `[labelhash]` in `name`,
   * the `canonical_name` will also contain the label represented as `[labelhash]`.
   *
   * `canonical_name` is guaranteed to be normalized.
   */
  canonical_name: string | null;
}

export interface BulkConsolidatedNameGuardReport {
  results: ConsolidatedNameGuardReport[];
}

export interface SecureReverseLookupResult {
  primary_name_status: SecureReverseLookupStatus;

  /**
   * Impersonation status of an Ethereum address.
   *
   * `null` if primary name is unknown or primary name is unnormalized.
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
   * If `primary_name` is `null` then provides a fallback `display_name` of "Unnamed [first four hex digits of Ethereum address]", e.g. "Unnamed C2A6".
   */
  display_name: string;

  /**
   * NameGuard report for the `primary_name`.
   *
   * `null` if `primary_name_status` is `no_primary_name` (primary name is not found).
   */
  nameguard_result: NameGuardReport | null;
}

// TODO: I think we want to apply more formalization to this error class.
class NameGuardError extends Error {
  constructor(
    public status: number,
    message?: string
  ) {
    super(message);
  }
}

const DEFAULT_ENDPOINT = "https://api.nameguard.io";
export const API_VERSION = "v1-beta";
const DEFAULT_NETWORK: Network = "mainnet";
const DEFAULT_INSPECT_LABELHASH_PARENT = ETH_TLD;
const MAX_BULK_INSPECTION_NAMES = 250;

interface NameGuardOptions {
  endpoint?: string;
  version?: string;
  network?: Network;
}

interface InspectNameOptions {
  network?: Network;
}

interface InspectNamehashOptions {
  network?: Network;
}

interface InspectLabelhashOptions {
  network?: Network;
  parent?: string;
}

interface SecurePrimaryNameOptions {
  network?: Network;
}

interface FakeEthNameOptions {
  network?: Network;
}

class NameGuard {
  private endpoint: URL;
  private version: string;
  private network: Network;

  constructor({
    endpoint = DEFAULT_ENDPOINT,
    version = API_VERSION,
    network = DEFAULT_NETWORK,
  } = {}) {
    this.endpoint = new URL(endpoint);
    this.version = version;
    this.network = network;
  }

  private async fetchNameGuardReport(
    name: string,
    options?: InspectNameOptions
  ): Promise<NameGuardReport> {
    const url = `${this.endpoint}${this.version}/inspect-name`;

    const network_name = options?.network || this.network;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, network_name }),
    });

    if (!response.ok) {
      throw new NameGuardError(response.status, `Failed to fetch name.`);
    }

    return await response.json();
  }

  private async fetchConsolidatedNameGuardReports(
    names: string[],
    options?: InspectNameOptions
  ): Promise<BulkConsolidatedNameGuardReport> {
    const url = `${this.endpoint}${this.version}/bulk-inspect-names`;

    const network_name = options?.network || this.network;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ names, network_name }),
    });

    if (!response.ok) {
      throw new NameGuardError(
        response.status,
        `Failed to fetch names in batch.`
      );
    }

    return await response.json();
  }

  private async fetchSecurePrimaryName(
    address: string,
    options?: SecurePrimaryNameOptions
  ): Promise<SecureReverseLookupResult> {
    const network_name = options?.network || this.network;

    const url = `${this.endpoint}${this.version}/secure-primary-name/${network_name}/${address}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new NameGuardError(
        response.status,
        "Error looking up secure primary name."
      );
    }

    return await response.json();
  }

  private async fetchFakeEthName(
    contract_address: string,
    token_id: string,
    options?: FakeEthNameOptions
  ): Promise<FakeEthNameCheckResult> {
    const network_name = options?.network || this.network;

    const url = `${this.endpoint}${this.version}/fake-eth-name-check/${network_name}/${contract_address}/${token_id}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new NameGuardError(
        response.status,
        "Error looking up .eth name impersonation status of NFT."
      );
    }

    return await response.json();
  }

  private async fetchGraphemeGuardReport(
    grapheme: string
  ): Promise<GraphemeGuardReport> {
    const grapheme_encoded = encodeURIComponent(grapheme);

    const url = `${this.endpoint}${this.version}/inspect-grapheme/${grapheme_encoded}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new NameGuardError(
        response.status,
        `Error looking up GraphemeGuardReport.`
      );
    }

    return await response.json();
  }

  // TODO: Document how this API will attempt automated labelhash resolution through the ENS Subgraph.
  /**
   * Inspects a single name with NameGuard. Provides a `NameGuardReport` including:
   *   1. The details of all checks performed on `name` that consolidates all checks performed on labels and graphemes in `name`.
   *   2. The details of all labels in `name`.
   *   3. A consolidated inspection result of all graphemes in `name`.
   *
   * @param {string} name The name for NameGuard to inspect.
   * @returns {Promise<NameGuardReport>} A promise that resolves with the `NameGuardReport` of the name.
   * @example
   * const nameGuardReport = await nameguard.inspectName('vitalik.eth');
   */
  public inspectName(
    name: string,
    options?: InspectNameOptions
  ): Promise<NameGuardReport> {
    return this.fetchNameGuardReport(name, options);
  }

  // TODO: Document how this API will attempt automated labelhash resolution through the ENS Subgraph.
  /**
   * Inspects up to 250 names at a time with NameGuard. Provides a `ConsolidatedNameGuardReport` for each provided name, including:
   *   1. The details of all checks performed on `name` that consolidates all checks performed on labels and graphemes in `name`.
   *
   * Each `ConsolidatedNameGuardReport` returned represents an equivalant set of checks as a `NameGuardReport`. However:
   *   1. A `NameGuardReport` contains a lot of additional data that isn't always needed / desired when a `ConsolidatedNameGuardReport` will do.
   *   2. When NameGuard only needs to return a `ConsolidatedNameGuardReport`, some special performance optimizations
   *      are possible (and completely safe) that help to accelate responses in many cases.
   *
   *
   * @param {string[]} names The list of names for NameGuard to inspect.
   * @returns {Promise<BulkConsolidatedNameGuardReport>} A promise that resolves with a list of `ConsolidatedNameGuardReport` values for each name queried in the bulk inspection.
   */
  public bulkInspectNames(
    names: string[],
    options?: InspectNameOptions
  ): Promise<BulkConsolidatedNameGuardReport> {
    if (names.length > MAX_BULK_INSPECTION_NAMES) {
      throw new Error(
        `Bulk inspection of more than ${MAX_BULK_INSPECTION_NAMES} names at a time is not supported.`
      );
    }
    return this.fetchConsolidatedNameGuardReports(names, options);
  }

  // TODO: We need to have more specialized error handling here for cases such as the lookup in the ENS Subgraph failing.
  // TODO: Update the comment below to be more specific on the types of errors that could be returned here.
  /**
   * Inspects the name associated with a namehash.
   *
   * NameGuard will attempt to resolve the name associated with the namehash through the ENS Subgraph.
   * If this resolution succeeds then NameGuard will generate and return a `NameGuardReport` for the name.
   * If this resolution fails then NameGuard will return an error.
   *
   * @param {string} namehash A namehash should be a decimal or a hex (prefixed with 0x) string.
   * @param {string} network The network name (defaults to "mainnet").
   * @returns A promise that resolves with the details of the namehash.
   */
  public async inspectNamehash(
    namehash: string,
    options?: InspectNamehashOptions
  ): Promise<NameGuardReport> {
    if (!isKeccak256Hash(namehash)) {
      throw new Error("Invalid Keccak256 hash format for namehash.");
    }

    const network = options?.network || this.network;

    const url = `${this.endpoint}/${this.version}/inspect-namehash/${network}/${namehash}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new NameGuardError(
        response.status,
        `Failed to inspect namehash ${namehash} using the network ${network}.`
      );
    }

    return await response.json();
  }

  // TODO: The main purpose of this function is to pass a tokenId rather than a labelhash. However we need to make changes
  //        here to properly support this use case.
  // TODO: We need to have more specialized error handling here for cases such as the lookup in the ENS Subgraph failing.
  // TODO: Update the comment below to be more specific on the types of errors that could be returned here.
  /**
   * Inspects the name "[{labelhash}].{parent}".
   *
   * Parent may be a name with any number of labels. The default parent is "eth".
   *
   * This is a convenience function to generate a `NameGuardReport` in cases when you only have:
   * 1. The labelhash of the "childmost" label of a name.
   * 2. The complete parent name of the "childmost" label.
   *
   * NameGuard always inspects names, rather than labelhashes. So this function will first attempt
   * to resolve the "childmost" label associated with the provided labelhash through the ENS Subgraph.
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
   * @returns A promise that resolves with a `NameGuardReport` of the resolved name.
   */
  public async inspectLabelhash(
    labelhash: string,
    options?: InspectLabelhashOptions
  ): Promise<NameGuardReport> {
    if (!isKeccak256Hash(labelhash)) {
      throw new Error("Invalid Keccak256 hash format for labelhash.");
    }

    const parent = options?.parent || DEFAULT_INSPECT_LABELHASH_PARENT;

    if (parent === "") {
      return await this.inspectName(`[${labelhash}]`, options);
    } else {
      return await this.inspectName(`[${labelhash}].${parent}`, options);
    }
  }

  /**
   * Inspect a single grapheme.
   *
   * @param {string} grapheme The grapheme to inspect. Must be a single grapheme (i.e. a single character or a sequence of characters that represent a single grapheme).
   * @returns A promise that resolves with a `GraphemeGuardReport` of the inspected grapheme.
   */
  public inspectGrapheme(grapheme: string): Promise<GraphemeGuardReport> {
    if (countGraphemes(grapheme) !== 1) {
      throw new Error(
        `The provided grapheme: "${grapheme}" is not a single grapheme. (i.e. it is not a single character or a sequence of characters that represent a single grapheme).`
      );
    }

    return this.fetchGraphemeGuardReport(grapheme);
  }

  public getSecurePrimaryName(
    address: string,
    options?: SecurePrimaryNameOptions
  ): Promise<SecureReverseLookupResult> {
    if (!isEthereumAddress(address)) {
      throw new Error(
        `The provided address: "${address}" is not in a valid Ethereum address format.`
      );
    }

    return this.fetchSecurePrimaryName(address, options);
  }

  public fakeEthNameCheck(
    contract_address: string,
    token_id: string,
    options?: FakeEthNameOptions
  ): Promise<FakeEthNameCheckResult> {
    if (!isEthereumAddress(contract_address)) {
      throw new Error(
        `The provided address: "${contract_address}" is not in a valid Ethereum address format.`
      );
    }

    if (!isTokenId(token_id)) {
      throw new Error(
        `The provided token_id: "${token_id}" is not in a valid token id format.`
      );
    }

    return this.fetchFakeEthName(contract_address, token_id, options);
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
