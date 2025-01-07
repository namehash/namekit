import { LabelStatus } from "./index";


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
}// Character and grapheme types can potentially evolve independently.

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

export interface InspectorConfusableGraphemeResult extends InspectorGraphemeResult { }
export interface InspectorConfusableMultiGraphemeResult {
  /** The confusable string */
  value: string;

  /** List of characters in the confusable */
  chars: InspectorCharResult[];
}
export type InspectorConfusableResult = InspectorConfusableGraphemeResult |
  InspectorConfusableMultiGraphemeResult;
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

