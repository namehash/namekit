import { ens_beautify, ens_normalize } from "@adraffy/ens-normalize";
import { hexToBigInt } from "viem";
import {
  type ENSName,
  MIN_ETH_REGISTRABLE_LABEL_LENGTH,
  type NFTRef,
} from "@namehash/ens-utils";
import { keccak256, labelhash } from "viem";

export enum ParseNameErrorCode {
  Empty = "Empty",
  TooShort = "TooShort",
  UnsupportedTLD = "UnsupportedTLD",
  UnsupportedSubdomain = "UnsupportedSubdomain",
  MalformedName = "MalformedName",
  MalformedLabelHash = "MalformedLabelHash",
}

type ParseNameErrorDetails = {
  normalizedName: string | null;
  displayName: string | null;
};
export class ParseNameError extends Error {
  public readonly errorCode: ParseNameErrorCode;
  public readonly errorDetails: ParseNameErrorDetails | null;

  constructor(
    message: string,
    errorCode: ParseNameErrorCode,
    errorDetails: ParseNameErrorDetails | null,
  ) {
    super(message);

    this.errorCode = errorCode;
    this.errorDetails = errorDetails;
  }
}

export const DEFAULT_TLD = "eth";

/**
 * Object containing properties necessary for domain name processing.
 * It is computed out of the user input, URL query parameter or database row data.
 */
export type DomainName = {
  /** Unique identifier of a domain */
  namehash: string;
  /** Domain slug to be used for URLs. It has a format of [labelhash].eth when the domain name is unknown or unnormalized */
  slug: string;
  /** Beautified domain name string, to be rendered in user interface */
  displayName: string;
  /** Normalized version of the name. Similar to `slug`, but it is null when the domain name is unknown or unnormalized */
  normalizedName: string | null;
  /** The label of the name. It can either be string like `vitalik` or `[0x123]` */
  labelName: string;
  /** keccak256 hash of the label */
  labelHash: string;
  unwrappedTokenId: bigint;
  wrappedTokenId: bigint;
};

export type OnchainName = ENSName & {
  nft: NFTRef;
};

export type DomainNameProperties = {
  charLength: number | null;
  graphemeLength: number | null;
  script: string | null;
  characterTypes: DomainsAllowedCharactersFilter[] | null;
  wordSplit: string[] | null;
};

const initialNode =
  "0000000000000000000000000000000000000000000000000000000000000000";

export const namehash = (inputName: string): string => {
  let node = initialNode;
  if (inputName) {
    const labels = inputName.split(".");
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelSha = keccak(labels[i]);
      node = keccak(Buffer.from(node + labelSha, "hex"));
    }
  }
  return "0x" + node;
};

export const namehashFromMissingName = (inputName: string): string => {
  let node = initialNode;

  const split = inputName.split(".");
  const labels = [split[0].slice(1, -1), keccak(split[1])];

  for (let i = labels.length - 1; i >= 0; i--) {
    const labelSha = labels[i];
    node = keccak(Buffer.from(node + labelSha, "hex"));
  }
  return "0x" + node;
};

const keccak = (input: Buffer | string) => {
  let out = null;
  if (Buffer.isBuffer(input)) {
    out = keccak256(input);
  } else {
    out = labelhash(input);
  }
  return out.slice(2); // cut 0x
};

/**
 * Parse and heal input string to a DomainName.
 * @param input User input or slug.
 * @return Object containing properties necessary for DomainName for any supported name.
 * @throws {ParseNameError}, when input is unsupported or cannot be healed.
 */
export const parseName = (input = ""): DomainName => {
  const cleanedInput = input.replace(/ /g, "");

  if (cleanedInput.length === 0) {
    throw new ParseNameError("Empty name", ParseNameErrorCode.Empty, null);
  }

  const inputLabels = cleanedInput.split(".");

  let curatedLabels: string[] = [];

  if (inputLabels.length < 2) {
    curatedLabels = [...inputLabels, DEFAULT_TLD];
  } else {
    curatedLabels = inputLabels;
  }

  // auto-fill top level domain
  if (
    getPrefixes(DEFAULT_TLD).some(
      (prefix) => curatedLabels[curatedLabels.length - 1] === prefix,
    ) ||
    curatedLabels[curatedLabels.length - 1] === ""
  ) {
    curatedLabels = [...curatedLabels.slice(0, -1), DEFAULT_TLD];
  }

  if (curatedLabels[curatedLabels.length - 1] !== DEFAULT_TLD) {
    throw new ParseNameError(
      "Unsupported top level name",
      ParseNameErrorCode.UnsupportedTLD,
      null,
    );
  }

  if (curatedLabels.length > 2) {
    throw new ParseNameError(
      "Unsupported subdomain",
      ParseNameErrorCode.UnsupportedSubdomain,
      null,
    );
  }

  const firstCuratedLabel = curatedLabels[0].toLowerCase();

  // handle undiscovered name format, like [0x00...].eth
  if (firstCuratedLabel.startsWith("[") && firstCuratedLabel.endsWith("]")) {
    if (hasMissingNameFormat(firstCuratedLabel)) {
      const searchedName = curatedLabels.join(".").toLowerCase();
      const namehash = namehashFromMissingName(searchedName);
      const labelHash = "0x" + firstCuratedLabel.slice(1, -1);

      return {
        namehash,
        slug: searchedName,
        displayName: searchedName,
        normalizedName: null,
        labelName: firstCuratedLabel,
        labelHash,

        // Below values are guaranteed to be 0x strings
        unwrappedTokenId: hexToBigInt(labelHash as `0x${string}`),
        wrappedTokenId: hexToBigInt(namehash as `0x${string}`),
      };
    } else {
      throw new ParseNameError(
        "Invalid labelhash",
        ParseNameErrorCode.MalformedLabelHash,
        null,
      );
    }
  } else {
    const searchedName = curatedLabels.join(".");

    let normalizedName = null;
    try {
      normalizedName = ens_normalize(searchedName);
    } catch {
      throw new ParseNameError(
        "Invalid ENS name",
        ParseNameErrorCode.MalformedName,
        null,
      );
    }

    const normalizedLabel = normalizedName.split(".")[0];
    if (normalizedLabel.length < MIN_ETH_REGISTRABLE_LABEL_LENGTH) {
      throw new ParseNameError(
        "Name is too short",
        ParseNameErrorCode.TooShort,
        {
          normalizedName,
          displayName: ens_beautify(normalizedName),
        },
      );
    }

    const nh = namehash(normalizedName);
    const labelHash = labelhash(normalizedLabel);
    const displayName = ens_beautify(normalizedName);

    return {
      namehash: nh,
      slug: normalizedName,
      displayName,
      normalizedName,
      labelName: normalizedLabel,
      labelHash,

      // Below values are guaranteed to be 0x strings
      unwrappedTokenId: hexToBigInt(labelHash as `0x${string}`),
      wrappedTokenId: hexToBigInt(nh as `0x${string}`),
    };
  }
};

export const DefaultParseNameError = new ParseNameError(
  "Empty name",
  ParseNameErrorCode.Empty,
  null,
);

export const hasMissingNameFormat = (label: string) =>
  new RegExp("\\[([0123456789abcdef]*)\\]").test(label) && label.length === 66;

const getPrefixes = (input: string): string[] => {
  const prefixes: string[] = [];

  for (let i = 1; i <= input.length; i++) {
    prefixes.push(input.slice(0, i));
  }

  return prefixes;
};

export const stringToLabel = (str: string): string => {
  const labels = str.split(".");

  for (let i = 0; i < labels.length; i++) {
    const trimmedLabel = labels[i].trim();
    if (trimmedLabel.length > 0) return trimmedLabel;
  }
  return "";
};

export const isNormalized = (name: string): boolean => {
  try {
    return ens_normalize(name) === name;
  } catch {
    return false;
  }
};

export enum DomainsScriptFilter {
  Any = "any",
  Arabic = "arabic",
  Armenian = "armenian",
  Bengali = "bengali",
  Cyrillic = "cyrillic",
  Devanagari = "devanagari",
  Georgian = "georgian",
  Greek = "greek",
  Gujarati = "gujarati",
  Gurmukhi = "gurmukhi",
  Han = "han",
  Hangul = "hangul",
  Hebrew = "hebrew",
  Hiraganakatakana = "hiraganakatakana",
  Kannada = "kannada",
  Latin = "latin",
  Malayalam = "malayalam",
  Oriya = "oriya",
  Tamil = "tamil",
  Telugu = "telugu",
}

export enum DomainsAllowedCharactersFilter {
  Dollarsign = "dollarsign",
  Emoji = "emoji",
  Hyphen = "hyphen",
  Invisible = "invisible",
  OtherLetter = "other_letter",
  OtherNumber = "other_number",
  SimpleLetter = "simple_letter",
  SimpleNumber = "simple_number",
  Special = "special",
  Underscore = "underscore",
}
