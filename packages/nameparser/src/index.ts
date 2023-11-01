import { ens_normalize } from "@adraffy/ens-normalize";
import {
  ENSName,
  ETH_TLD,
  LABEL_SEPARATOR,
  buildENSName,
  labelsEqual,
  tryNormalize,
} from "./ensname";

/**
 * `NameParserOptions` provides configurations for parsing ENS names from user input.
 */
export interface NameParserOptions {
  /**
   * Remove any leading or trailing whitespace characters.
   */
  trimWhitespace: boolean;

  /**
   * Attempt ENS Normalization on input.
   * If ENS Normalization fails on a label then the unnormalized label will be used in the output instead.
   */
  attemptEnsNormalization: boolean;

  /**
   * Adds the specified label as an assumed top-level domain if it is determined the user input needs the top-level domain to be "healed".
   * For the purpose of search-as-you-type: if the user input ends with a
   * the beginning of the specified label then only the remaining part of the specified label is appended.
   * If `null` then disables any assumed top-level domain.
   */
  assumedTld: string | null;
}

const DEFAULT_TRIM_WHITESPACE = true;
const DEFAULT_ATTEMPT_ENS_NORMALIZATION = true;
const DEFAULT_ASSUMED_TLD = ETH_TLD;

export type NameParserTransformation =
  | "trim_whitespace"
  | "assume_tld"
  | "ens_normalize";

/**
 * `ParsedName` provides the result of parsing a name from user input into an output `ENSName`.
 */
export interface ParsedName {
  inputName: string;
  outputName: ENSName;

  /**
   * The transformations that were performed on `inputName` to construct `outputName`.
   */
  transformations: NameParserTransformation[];
}

export function trimOuterWhitespace(labels: string[]): string[] {
  return labels.map((label, index) => {
    if (labels.length === 1) {
      return label.trim();
    } else if (index == 0) {
      return label.trimStart();
    } else if (index == labels.length - 1) {
      return label.trimEnd();
    } else {
      return label;
    }
  });
}

export function assumeTld(labels: string[], assumedTld: string): string[] {
  if (labelsEqual(labels, [""])) {
    return labels;
  }

  let normalizedAssumedTld: string;
  try {
    normalizedAssumedTld = ens_normalize(assumedTld);
  } catch {
    throw new Error("assumedTld must be normalizable with ens_normalize");
  }

  if (normalizedAssumedTld.indexOf(LABEL_SEPARATOR) !== -1) {
    throw new Error("assumedTld must be a single label");
  }

  if (normalizedAssumedTld.length === 0) {
    throw new Error("assumedTld must not be empty");
  }

  let appendAssumedTld = false;

  let result = labels.map((label, index) => {
    // if we're looking at the last label
    if (index == labels.length - 1) {
      // if there's only 1 label then we always add the normalizedAssumedTld.
      if (labels.length == 1) {
        appendAssumedTld = true;
        return label;
      } else {
        try {
          const normalizedLabel = ens_normalize(label);
          if (
            normalizedAssumedTld.startsWith(normalizedLabel) &&
            normalizedAssumedTld.length > normalizedLabel.length
          ) {
            // autocomplete
            return normalizedAssumedTld;
          } else {
            // don't modify the tld
            return label;
          }
        } catch {
          // don't modify the tld
          return label;
        }
      }
    } else {
      return label;
    }
  });

  if (appendAssumedTld) result.push(normalizedAssumedTld);

  return result;
}

export function parseName(
  inputName: string,
  options?: NameParserOptions
): ParsedName {
  const trimWhitespace =
    options?.trimWhitespace !== undefined
      ? options.trimWhitespace
      : DEFAULT_TRIM_WHITESPACE;
  const tryNormalization =
    options?.attemptEnsNormalization !== undefined
      ? options.attemptEnsNormalization
      : DEFAULT_ATTEMPT_ENS_NORMALIZATION;
  const assumedTld = options ? options.assumedTld : DEFAULT_ASSUMED_TLD;

  let transformations: NameParserTransformation[] = [];

  let labels = inputName.split(LABEL_SEPARATOR);

  if (trimWhitespace) {
    const trimmedLabels = trimOuterWhitespace(labels);

    if (!labelsEqual(labels, trimmedLabels)) {
      labels = trimmedLabels;
      transformations.push("trim_whitespace");
    }
  }

  if (tryNormalization) {
    const normalizedLabels = tryNormalize(labels);

    if (!labelsEqual(labels, normalizedLabels)) {
      labels = normalizedLabels;
      transformations.push("ens_normalize");
    }
  }

  if (assumedTld !== null) {
    const assumedTldLabels = assumeTld(labels, assumedTld);

    if (!labelsEqual(labels, assumedTldLabels)) {
      labels = assumedTldLabels;
      transformations.push("assume_tld");
    }
  }

  const healedName = labels.join(LABEL_SEPARATOR);

  const outputName = buildENSName(healedName);

  return {
    inputName,
    outputName,
    transformations,
  };
}
