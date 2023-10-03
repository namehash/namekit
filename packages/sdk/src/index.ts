import fetch from "cross-fetch";

/** Represents the type of a check */
export type Check =
  | "CONFUSABLES"
  | "INVISIBLE"
  | "TYPING_DIFFICULTY"
  | "FONT_SUPPORT"
  | "MIXED_SCRIPTS"
  | "NAMEWRAPPER_COMPATIBLE"
  | "NORMALIZED"
  | "PUNYCODE_COMPATIBLE_LABEL"
  | "UNKNOWN_LABEL"
  | "PUNYCODE_COMPATIBLE_NAME";

/** Represents the status of a conducted check */
export type CheckStatus = "SKIP" | "INFO" | "PASS" | "WARN" | "ALERT";

/** Represents the rating of a name/label/grapheme based on multiple conducted checks */
export type Rating = "PASS" | "WARN" | "ALERT";

export type Normalization = "normalized" | "unnormalized" | "unknown";

export type Keccak256Hash = string;

/** The result of a conducted check */
export interface CheckResult {
  /** The type of check */
  check: Check;
  /** The status of the check */
  status: CheckStatus;
  /** A message describing the result of the check */
  message: string;
}

export interface RiskSummary {
  /* The rating of a name/label/grapheme based on multiple conducted checks. */
  rating: Rating;
  /* The number of checks that have a status of ALERT or WARN. */
  risk_count: number;
  /* The check considered to be the highest risk. If no check has a status of ALERT or WARN, this field is null. */
  highest_risk: CheckResult | null;
}

/**
 * Grapheme analysis result
 */
export interface GraphemeGuardResult {
  /** The analyzed grapheme */
  grapheme: string;
  /** The name of the grapheme */
  grapheme_name: string;
  /** The type of the grapheme */
  grapheme_type: string;
  /** Script name of the grapheme */
  grapheme_script: string;
  /** Link to an external page with information about the grapheme */
  grapheme_link: string | null;
  /** Summary of the risks identified */
  summary: RiskSummary;
  /** A list of checks that were performed on the grapheme */
  checks: CheckResult[] | null;
}

/**
 * Label analysis result
 */
export interface LabelGuardResult {
  /** The analyzed label */
  label: string;
  /** The labelhash of the label in hex format prefixed with `0x` */
  labelhash: Keccak256Hash;
  /** The ENSIP-15 normalization status of `label` */
  normalization: Normalization;
  /** Summary of the risks identified */
  summary: RiskSummary;
  /** A list of checks that were performed on the label */
  checks: CheckResult[] | null;
  /** A list of graphemes that were analyzed in the label */
  graphemes: GraphemeGuardResult[] | null;
}

/**
 * Name analysis result without information about individual checks and labels.
 */
interface NameGuardQuickResult {
  /* The analyzed name. Can contain labelhashes when some labels are unknown. */
  name: string;
  /* The namehash of the name in hex format prefixed with 0x. */
  namehash: Keccak256Hash;
  /* The ENSIP-15 normalization status of `name` */
  normalization: Normalization;
  /* The risk summary of `name` */
  summary: RiskSummary;
}

/**
 * Full name analysis result with information about individual checks and labels.
 */
export interface NameGuardResult extends NameGuardQuickResult {
  /* The checks performed for this name */
  checks: CheckResult[];
  /** The analyzed labels of the name */
  labels: LabelGuardResult[];
}

export interface NameGuardBulkResult {
  results?: NameGuardQuickResult[];
}

class NameGuardError extends Error {
  constructor(
    public status: number,
    message?: string
  ) {
    super(message);
  }
}

const DEFAULT_ENDPOINT =
  "https://pyfgdpsi4jgbf5tlzu62zbokii0mhmgc.lambda-url.eu-north-1.on.aws";
const DEFAULT_VERSION = "v1-beta";
const DEFAULT_NETWORK = "mainnet";
const DEFAULT_PARENT_NAME = "eth";

interface NameGuardOptions {
  endpoint?: string;
  version?: string;
  network?: string;
  parent?: string;
}

function isKeccak256Hash(hash: Keccak256Hash) {
  return /^0x[0-9a-f]{64}$/i.test(hash);
}

class NameGuard {
  private endpoint: URL;
  private version: string;
  private network: string;
  private parent: string;

  constructor(options?: NameGuardOptions) {
    this.endpoint = new URL(options?.endpoint || DEFAULT_ENDPOINT);
    this.version = options?.version || DEFAULT_VERSION;
    this.network = options?.network || DEFAULT_NETWORK;
    this.parent = options?.parent || DEFAULT_PARENT_NAME;
  }

  private async fetchSingleName(name: string): Promise<NameGuardResult> {
    const encodedName = encodeURIComponent(name);
    const url = `${this.endpoint}/${this.version}/inspect-name/${encodedName}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new NameGuardError(response.status, `Failed to fetch name.`);
    }

    return await response.json();
  }

  /**
   * Inspects multiple names.
   * @param {string[]} names A string for a single name.
   * @returns {Promise<SingleNamesResponse>} A promise that resolves with the details of the name.
   * @example
   * const data = await nameguard.inspectName(['nick.eth', 'vitalik.eth']);
   */
  async inspectBulkNames(names: string[]): Promise<NameGuardBulkResult> {
    const url = `${this.endpoint}/${this.version}/bulk-inspect-names`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ names }),
    });

    if (!response.ok) {
      throw new NameGuardError(
        response.status,
        `Failed to fetch names in batch.`
      );
    }

    return await response.json();
  }

  /**
   * Inspects a single name.
   * @param {string} name A string for a single name.
   * @returns {Promise<SingleNamesResponse>} A promise that resolves with the details of the name.
   * @example
   * const data = await nameguard.inspectName('vitalik.eth');
   * @example
   * const data = await nameguard.inspectName('nick.eth', 'vitalik.eth');
   */
  public inspectName(name: string): Promise<NameGuardResult>;

  /**
   * Inspects multiple names.
   * @param {string[]} names An array of strings for multiple names.
   * @returns {Promise<NameGuardBulkResult>} A promise that resolves with the details of the names.
   */
  public inspectName(...names: string[]): Promise<NameGuardBulkResult>;

  /**
   * Inspect by one name or multiple.
   * @param {string | string[]} name A string for a single name or an array of strings for multiple names.
   * @returns {Promise<NameGuardResult | NameGuardBulkResult>} A promise that resolves with the details
   */
  public async inspectName(
    ...args: string[]
  ): Promise<NameGuardResult | NameGuardBulkResult> {
    if (args.length === 1) {
      return this.fetchSingleName(args[0]);
    } else {
      return this.inspectBulkNames(args);
    }
  }

  /**
   * Inspects a namehash.
   * @param {string} namehash A namehash should be a decimal or a hex (prefixed with 0x) string.
   * @param {string} network The network name (defaults to "mainnet").
   * @returns A promise that resolves with the details of the namehash.
   */
  public async inspectNamehash(
    namehash: string,
    network: string = this.network
  ): Promise<NameGuardResult> {
    if (!isKeccak256Hash(namehash)) {
      throw new Error("Invalid Keccak256 hash format for namehash.");
    }

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

  /**
   * Inspects a labelhash.
   * @param {string} labelhash A labelhash should be a decimal or a hex (prefixed with 0x) string.
   * @param {string} network The network name (defaults to "mainnet").
   * @param {string} parent The parent name (defaults to "eth").
   * @returns A promise that resolves with the details of the labelhash.
   */
  public async inspectLabelhash(
    labelhash: string,
    network: string = this.network,
    parent: string = this.parent
  ): Promise<NameGuardResult> {
    if (!isKeccak256Hash(labelhash)) {
      throw new Error("Invalid Keccak256 hash format for labelhash.");
    }

    throw new Error("Not implemented");
  }
}

/**
 * Creates a new instance of the NameGuard class.
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

NameGuard.prototype.inspectName = NameGuard.prototype.inspectName;
NameGuard.prototype.inspectNamehash = NameGuard.prototype.inspectNamehash;
NameGuard.prototype.inspectLabelhash = NameGuard.prototype.inspectLabelhash;

/**
 * `NameGuard` provides methods to inspect and prevent malicious use of ENS names.
 * It can inspect individual names or batch names.
 * @example
 * import { nameguard } from '@namehash/nameguard';
 * const data = nameguard.inspectName('vitalik.eth');
 */
export const nameguard = defaultClient;
