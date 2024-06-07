import { isEncodedLabelHash, buildLabelHash, LabelHash, EncodedLabelHashInterpretationStrategy, normalizeEncodedLabelHashAsEncodedLabelHash, encodeLabelHash } from './labelhash';
import { LABEL_SEPARATOR, Normalization, NormalizationStrategy, beautifyLabel, normalizeLabel } from './normalize';

/**
 * A label from an ENS name.
 */
export interface Label {

  /**
   * The actual label value.
   */
  label: string;

  /**
   * The display optimized version of `label`.
   */
  displayLabel: string;

  /**
   * The normalization status of `label`.
   */
  normalization: Normalization;

  /**
   * The `LabelHash` of `label`.
   */
  labelHash: LabelHash;
}

/**
 * The strategy to use when intepreting an invalid label containing a `.` (`LABEL_SEPARATOR`) character.
 */
export const LabelSeparatorInterpretationStrategy = {
  /**
   * Any `.` (`LABEL_SEPARATOR`) characters inside the label will be interperted as label separators.
   *
   * Placing a label separator inside a label breaks a number of invariants expected by functions such as
   * `namehash` and `ens_normalize`.
   *
   * Therefore, this strategy throws an `Error` if any `.` (`LABEL_SEPARATOR`) characters are found in the label.
   *
   * This strategy is recommended for almost all cases.
   */
  LabelSeparator: 'LABEL_SEPARATOR',

  /**
   * Any `.` (`LABEL_SEPARATOR`) characters inside the label will be interperted literally as any other character would be.
   *
   * This is a special case strategy that should only be used when you are intepreting a label from blockchain data / events
   * where a label was created / referenced via a smart contract that did not verify that the label was actually a single
   * label without any LABEL_SEPARATOR characters inside.
   */
  Literal: 'LITERAL',
} as const;

export type LabelSeparatorInterpretationStrategy =
  (typeof LabelSeparatorInterpretationStrategy)[keyof typeof LabelSeparatorInterpretationStrategy];

/**
 * Options for the `buildLabel` function.
 */
export interface BuildLabelOptions {
  
  /**
   * The strategy to use when interpreting `label` where `isEncodedLabelHash(label)` is `true`.
   */
  encodedLabelhashInterpretationStrategy?: EncodedLabelHashInterpretationStrategy;

  /**
   * The normalization strategy to use when interpreting `label`.
   */
  normalizationStrategy?: NormalizationStrategy;

  /**
   * The strategy to use when intepreting an invalid label containing a `.` (`LABEL_SEPARATOR`) character.
   */
  labelSeparatorInterpretationStrategy?: LabelSeparatorInterpretationStrategy;
}

export const DEFAULT_BUILDLABEL_OPTIONS: Required<BuildLabelOptions> = {
  normalizationStrategy: NormalizationStrategy.TryNormalize,
  encodedLabelhashInterpretationStrategy: EncodedLabelHashInterpretationStrategy.UnknownLabel,
  labelSeparatorInterpretationStrategy: LabelSeparatorInterpretationStrategy.LabelSeparator,
};

const getBuildLabelOptions = (
  options?: BuildLabelOptions
): Required<BuildLabelOptions> => {
  return {
    ...DEFAULT_BUILDLABEL_OPTIONS,
    ...options,
  };
};

/**
 * Builds a `Label` from `label` using the provided `options`.
 *
 * @param label label to convert into an `Label`.
 * @param options options to use when building the `Label`.
 * @returns the resulting `Label`.
 */
export function buildLabel(
  label: string,
  options?: BuildLabelOptions,
): Label {

  const {
    normalizationStrategy,
    encodedLabelhashInterpretationStrategy,
    labelSeparatorInterpretationStrategy,
  } = getBuildLabelOptions(options);

  let labelValue: string;
  let normalization: Normalization;

  if (label.includes(LABEL_SEPARATOR)) {

    if (labelSeparatorInterpretationStrategy === LabelSeparatorInterpretationStrategy.LabelSeparator)
        throw new Error(
        `Label "${label}" is invalid as it contains a "." (LABEL_SEPARATOR) character.`
        );

    labelValue = label;
    normalization = 'unnormalized';
  } else {

    try {

        const normalizedLabel = normalizeLabel(label);
        const isNormalized = normalizedLabel == label;
    
        if (normalizationStrategy === NormalizationStrategy.TryNormalize) {
          labelValue = normalizedLabel;
          normalization = 'normalized';
        } else {
          labelValue = label;
          normalization = isNormalized ? 'normalized' : 'unnormalized';
        }

      } catch {

        // label cannot be normalized
    
        if (isEncodedLabelHash(label)) {
          switch (encodedLabelhashInterpretationStrategy) {
            case EncodedLabelHashInterpretationStrategy.Literal:
              normalization = 'unnormalized';
              break;
            case EncodedLabelHashInterpretationStrategy.UnknownLabel:
              normalization = 'unknown';
              break;
          }
        } else {
          normalization = 'unnormalized';
        }
    
        if (
          normalization === 'unknown' &&
          normalizationStrategy === NormalizationStrategy.TryNormalize
        ) {
          labelValue = normalizeEncodedLabelHashAsEncodedLabelHash(label);
        } else {
          labelValue = label;
        }
      }
  }

  if (
    normalizationStrategy === NormalizationStrategy.RequireNormalize &&
    normalization !== 'normalized'
  ) {
    throw new Error(`Label "${label}" is not normalized.`);
  }

  let displayLabel: string;
  const labelHash = buildLabelHash(labelValue, {encodedLabelHashInterpretationStrategy: encodedLabelhashInterpretationStrategy});

  switch (normalization) {
    case 'normalized':
      displayLabel = beautifyLabel(labelValue);
      break;
    case 'unnormalized':
      // It's not safe to display unnormalized labels.
      // Therefore we will display it as a normalized encoded labelhash instead.
      displayLabel = encodeLabelHash(labelHash);
      break;
    case 'unknown':
      displayLabel = labelValue;
      break;
  }

  return {
    label: labelValue,
    displayLabel,
    normalization,
    labelHash,
  };
}

/**
 * The comparison strategy to use when comparing a pair of `Label`.
 * 
 * NOTE: Two `Label` might have different `label` values but still have the same `labelHash` if the `normalization` of only one of the `Label` is `unknown`.
 */
export const LabelComparisonStrategy = {
    /**
     * Compares two `Label` only by their `label` value.
     */
    LabelValueOnly: 'VALUE_ONLY',
  
    /**
     * Compares two `Label` only by their `labelHash` value.
     */
    LabelHashOnly: 'HASH_ONLY',
  
    /**
     * Compares two `Label` for full equality (both `label` and `labelHash` must be equal)
     */
    FullEquality: 'FULL',
  } as const;
  
  export type LabelComparisonStrategy =
    (typeof LabelComparisonStrategy)[keyof typeof LabelComparisonStrategy];

/**
 * Compares two `Label` for equality.
 * 
 * @param labels1 The first `Label` to compare.
 * @param labels2 The second `Label` to compare.
 * @param strategy The `LabelComparisonStrategy` to use when comparing the `Label`.
 * @returns true if and only if both `Label` are equal according to the provided strategy.
 */
export function labelsEqual(label1: Label, label2: Label, strategy: LabelComparisonStrategy = LabelComparisonStrategy.FullEquality): boolean {
  switch (strategy) {
    case LabelComparisonStrategy.LabelValueOnly:
      return label1.label === label2.label;
    case LabelComparisonStrategy.LabelHashOnly:
        return label1.labelHash.labelHash === label2.labelHash.labelHash;
    case LabelComparisonStrategy.FullEquality:
        return label1.label === label2.label && label1.labelHash.labelHash === label2.labelHash.labelHash;
    }
}