import fetch from "cross-fetch";

type NameGuardOptions = {
  endpoint?: string;
  version?: string;
};

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

export interface Grapheme {
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

export type Normalization = "normalized" | "unnormalized" | "unknown";

export type Keccak256Hash = string;

export interface LabelInspection {
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
  graphemes: Grapheme[] | null;
}

export interface SingleNameResponse {
  /* The analyzed name. Can contain labelhashes when some labels are unknown. */
  name: string;
  /* The namehash of the name in hex format prefixed with 0x. */
  namehash: Keccak256Hash;
  /* The ENSIP-15 normalization status of `name` */
  normalization: Normalization;
  /* The risk summary of `name` */
  summary: RiskSummary;
  /* The checks performed for this name */
  checks: CheckResult[];
  /** The analyzed labels of the name */
  labels: LabelInspection[];
}

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

export interface BatchNamesResponse {
  results?: NameGuardQuickResult[];
}

interface NameGuardResponse {
  [any: string]: any;
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

export class NameGuard {
  private endpoint: URL;
  private version: string;

  constructor(options?: NameGuardOptions) {
    this.endpoint = new URL(options?.endpoint || DEFAULT_ENDPOINT);
    this.version = options?.version || DEFAULT_VERSION;
  }

  private async fetchSingleName(name: string): Promise<SingleNameResponse> {
    const encodedName = encodeURIComponent(name);
    const url = `${this.endpoint}/${this.version}/inspect-name/${encodedName}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new NameGuardError(response.status, `Failed to fetch name.`);
    }

    return await response.json();
  }

  private async fetchBatchNames(names: string[]): Promise<BatchNamesResponse> {
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
   * @returns {Promise<SingleNamesResponse>}  A promise that resolves with the details of the name.
   */
  public inspectName(name: string): Promise<SingleNameResponse>;

  /**
   * Inspects multiple names.
   * @param {string[]} names An array of strings for multiple names.
   * @returns {Promise<BatchNamesResponse>} A promise that resolves with the details of the names.
   */
  public inspectName(names: string[]): Promise<BatchNamesResponse>;

  /**
   * Inspect by one name or multiple.
   * @param {string | string[]} names A string for a single name or an array of strings for multiple names.
   * @returns {Promise<SingleNameResponse | BatchNamesResponse>} A promise that resolves with the details
   */
  public async inspectName(
    names: string | string[]
  ): Promise<SingleNameResponse | BatchNamesResponse> {
    if (typeof names === "string") {
      return this.fetchSingleName(names);
    } else if (Array.isArray(names)) {
      return this.fetchBatchNames(names);
    } else {
      throw new Error("Invalid input. Expected a string or an array of names.");
    }
  }

  /**
   * Inspects a namehash.
   * @param {string} name A string for a single namehash.
   * @returns A promise that resolves with the details of the namehash.
   */
  public async inspectNamehash(name: string): Promise<NameGuardResponse> {
    return Promise.resolve({});
  }

  /**
   * Inspects a labelhash.
   * @param {string} label A string for a single labelhash.
   * @returns A promise that resolves with the details of the labelhash.
   */
  public async inspectLabelhash(label: string): Promise<NameGuardResponse> {
    return Promise.resolve({});
  }
}

export function createClient(options?: NameGuardOptions) {
  return new NameGuard(options);
}

const defaultClient = createClient();

NameGuard.prototype.inspectName = NameGuard.prototype.inspectName;
NameGuard.prototype.inspectNamehash = NameGuard.prototype.inspectNamehash;
NameGuard.prototype.inspectLabelhash = NameGuard.prototype.inspectLabelhash;

export const nameguard = defaultClient;
