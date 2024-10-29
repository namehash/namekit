# @namehash/ens-utils

![NPM Version](https://img.shields.io/npm/v/@namehash/ens-utils)

This repository contains all of the code for the NPM package [`@namehash/ens-utils`](https://npmjs.com/@namehash/ens-utils) that exports functions for parsing names, handling currency, numbers, prices, and time.

| Module                      | Description                                                                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`nameparser`](#nameparser) | Offers a way to process and normalize string inputs conform to the expected ENS name format configured.                                                                          |
| [`currency`](#currency)     | Especially useful in applications dealing with financial transactions, crypto assets, or any domain where currency representation and conversion are crucial.                    |
| `number`                    | Utility functions for converting between different numeric formats (`string`, `Decimal`, `number`, and `bigint`) and for performing approximate scaling of `bigint` values.      |
| `price`                     | This module provides a robust foundation for handling monetary values within a financial application, offering flexibility for currency operations, conversions, and formatting. |
| `time`                      | Includes functions for time manipulation, formatting, and calculation.                                                                                                           |

## Install

```bash
npm install @namehash/ens-utils
```

## NameParser

ENS names are crucial in the Ethereum ecosystem, serving as human-readable addresses that map to Ethereum addresses. However, user input can be unpredictable and may not always conform to the expected ENS name format.

The `Name Parser` module offers a way to process and normalize these inputs into a consistent format, applying transformations such as trimming whitespace, normalizing names, and appending assumed TLDs when necessary, helping user handle labels and name hashes.

It utilizes the [`@adraffy/ens-normalize`](https://npmjs.com/@adraffy/ens-normalize) library for normalization purposes.

### Constants

The module defines several constants for use within the ENS ecosystem, such as:

#### `LABEL_SEPARATOR`

The character used to separate labels in an ENS name.

```ts
export const LABEL_SEPARATOR = ".";
```

#### `ETH_TLD`

The top-level domain for Ethereum names (`eth`).

```ts
export const ETH_TLD = "eth";
```

#### `MIN_ETH_REGISTRABLE_LABEL_LENGTH`

The minimum length of a label that can be registered under `.eth`.

```ts
export const MIN_ETH_REGISTRABLE_LABEL_LENGTH = 3;
```

## Interfaces and Types

#### `NameParserOptions`

This interface defines the configuration options for the name parser.

| Property                  | Type               | Description                                                                                        |
| ------------------------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| `trimWhitespace`          | `boolean`          | Whether to remove leading and trailing whitespace characters.                                      |
| `attemptEnsNormalization` | `boolean`          | Whether to attempt ENS normalization on the input. Uses `ens_normalize` for this purpose.          |
| `assumedTld`              | `string` \| `null` | An optional label to be added as an assumed top-level domain. If `null`, disables any assumed TLD. |

#### `NameParserTransformation`

A union type representing the types of transformations that can be performed on the input name.

```ts
type NameParserTransformation =
  | "trim_whitespace"
  | "assume_tld"
  | "ens_normalize";
```

#### `ParsedName`

This interface represents the result of parsing a name from user input.

| Property          | Type                         | Description                                                                                 |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `inputName`       | `string`                     | The original user input.                                                                    |
| `outputName`      | `ENSName`                    | The parsed and transformed ENS name.                                                        |
| `transformations` | `NameParserTransformation[]` | A list of transformations that were applied to the input name to construct the output name. |

#### Normalization

The `Normalization` type represents the normalization status of an ENS name or label. It can be one of the following:

- `normalized`: The name or label is normalized.
- `unnormalized`: The name or label is not normalized.
- `unknown`: The normalization status of the name or label is unknown.

```ts
export type Normalization =
  | "normalized" /** `normalized`: The name or label is normalized. */
  | "unnormalized" /** `unnormalized`: The name or label is not normalized. */
  | "unknown" /** `unknown`: The name or label is unknown because it cannot be looked up from its hash. */;
```

#### NamespaceRoot

The `NamespaceRoot` type identifies the root namespace of an ENS name, which can be:

- `ens`: For names ending in `.eth` and the ENS root.
- `dns`: For names belonging to the DNS namespace.
- `unknown`: For names with an undetermined namespace root.

```ts
export type NamespaceRoot =
  | "ens" /** For now: Only given to names ending in "eth" and the ENS root */
  | "dns"
  | "unknown"; /** For now: Used for all other cases. Future enhancements will make this more specific. */
```

#### RegistrationPotential

The `RegistrationPotential` type indicates whether an ENS name is registrable, and it can be one of:

- `unregisterable`: Direct subnames of `.eth` not long enough for current contracts.
- `invalid`: Names are technically registerable but unnormalized.
- `registerable`: Names that are eligible for registration.
- `unknown`: Names with an undetermined registration potential.

```ts
export type RegistrationPotential =
  | "unregisterable" /** For now: Only given to direct subnames of .eth that are not long enough for current ETHRegistrarController contracts */
  | "invalid" /** Invalid names are technically registerable, but are unnormalized and should not be registered. */
  | "registerable"
  | "unknown"; /** For now: Used for all other cases. Future enhancements will make this more specific. */
```

#### DecentralizationStatus

The `DecentralizationStatus` type describes the decentralization status of an ENS name:

- `unruggable`: Names guaranteed to be decentralized.
- `icann`: Names under the jurisdiction of ICANN.
- `unknown`: Names with an unknown decentralization status.

```ts
export type DecentralizationStatus =
  | "unruggable" /** For now: Only given to direct subnames of .eth, the name "eth", and the ENS root. */
  | "icann"
  | "unknown"; /** For now: Used for all other cases. Future enhancements will make this more specific. */
```

#### ENSName Interface

The `ENSName` interface represents an ENS name, including its labels, display name, and normalization status.

```ts
interface ENSName {
  name: string;
  labels: string[];
  displayName: string;
  displayLabels: string[];
  normalization: Normalization;
}
```

## Functions

#### `trimOuterWhitespace`

Trims leading and trailing whitespace from each label in an array of labels.

**Parameters**

- `labels`: The array of labels to trim the whitespaces from (`string[]`).

**Returns**

- `string[]` - The array of labels without leading and trailing whitespaces.

#### `assumeTld`

Appends an assumed TLD to the last label if necessary, based on the configuration.

**Parameters**

- `labels`: The array of labels to trim the whitespaces from (`string[]`).
- `assumedTld`: An optional label to be added as an assumed top-level domain. (`string`).

**Returns**

- `string[]` - The array of labels with TLD appended.

#### `parseName`

The main function that takes an input name and options, applying configured transformations to parse the name into a standardized ENS name format.

**Parameters**

- `inputName`: The input name to be parsed (`string`).
- `options`: The configured transformations to parse the name into a standardized ENS name format. (`NameParserOptions | undefined`).

**Returns**

- `ParsedName` - This interface represents the result of parsing a name from user input.

###### Example

```ts
import { parseName } from "./nameparser";

const options = {
  trimWhitespace: true,
  attemptEnsNormalization: true,
  assumedTld: "eth",
};

const { inputName, outputName, transformations } = parseName(
  " example.eth ",
  options,
);
```

This example demonstrates how to use the `parseName` function with the `NameParserOptions` to parse and normalize an ENS name input. The output would be a `ParsedName` object with the original input, the processed ENS name, and the transformations applied.

#### `labelhash`

Computes the Keccak-256 hash of a provided label.

**Parameters**

- `label`: The text label to hash.

**Returns**

- Keccak-256 hash of the label as a hexadecimal string.

### Example

```ts
const hashedLabel = labelhash("example");
console.log(hashedLabel); // Outputs the Keccak-256 hash of "example"
```

## `isKeccak256Hash`

Validates if a given string is a properly formatted Keccak-256 hash.

**Parameters**

- `hash`: The hash string to validate.

**Returns**

- `true` if the hash is a valid Keccak-256 hash, otherwise `false`.

## `encodeLabelhash`

Encodes a given labelhash into a specific format, denoted by square brackets.

**Parameters**

- `labelhash`: The labelhash value to encode.

**Returns**

- The encoded labelhash.

## `decodeEncodedLabelhash`

Decodes an encoded labelhash, extracting the original labelhash value.

**Parameters**

- `encodedLabelhash`: The encoded labelhash to decode.

**Returns**

- The labelhash value of the encoded labelhash.

## `isEncodedLabelhash`

Checks if a label contains an encoded labelhash.

**Parameters**

- `label`: The label to evaluate.

**Returns**

- `true` if the label contains an encoded labelhash, otherwise `false`.

## `normalizeKeccak256Hash`

Normalizes a Keccak-256 hash to a consistent format, addressing prefix presence and letter casing.

**Parameters**

- `hash`: The hash to normalize.
- `withPrefix`: Whether to include the "0x" prefix in the normalized hash.

**Returns**

- A normalized Keccak-256 hash.

**Throws:** Error if the hash is not a valid Keccak-256 hash.

## `normalizeEncodedLabelhash`

Normalizes an encoded labelhash to a standard format, ensuring the labelhash component is properly normalized.

**Parameters**

- `label`: The label containing an encoded labelhash to normalize.

**Returns** A normalized encoded labelhash.

## More important functions

## Label Operations

- `labelsEqual(labels1: string[], labels2: string[])`: Checks if two sets of labels are equal.
- `getDisplayLabels(labels: string[])`: Converts labels into a display-optimized form.
- `tryNormalize(labels: string[])`: Attempts to normalize a set of labels.

## ENS Name Operations

- `buildENSName(name: string)`: Builds an `ENSName` object from a string name.
- `getNamespaceRoot(name: ENSName)`: Identifies the namespace root of a name.
- `getDecentralizationStatus(name: ENSName)`: Identifies the decentralization status of a name.
- `getRegistrationPotential(name: ENSName)`: Identifies the registration potential of a name.

## Utility Functions

- `isValidDNSTld(label: string)`: Identifies if a label represents a valid TLD in the DNS namespace.
- `ethRegistrarControllerLength(label: string)`: Calculates the length of a label as determined by the EthRegistrarController smart contracts.

## Currency

The Currency module provides solutions for managing different currencies, their display rules and configurations within a software application. It is especially useful in applications dealing with financial transactions, crypto assets, or any domain where currency representation and conversion are crucial.

### Enums

#### `Currency`

Defines the supported currencies with their string representations.

```ts
export enum Currency {
  Dai = "DAI",
  Eth = "ETH",
  Usd = "USD",
  Usdc = "USDC",
  Weth = "WETH",
  Gas = "GAS",
}
```

#### `CurrencyDisplayRule`

Specifies the rules for displaying currencies.

```ts
export enum CurrencyDisplayRule {
  NativeCurrency = "NativeCurrency",
  PreferredCurrency = "PreferredCurrency",
}
```

### Types

#### `SupportedPreferredCurrencies`

A type that narrows down the `Currency` enum to only include `Usd` and `Eth` as the supported preferred currencies.

```ts
export type SupportedPreferredCurrencies = Currency.Usd | Currency.Eth;
```

### `CurrencyConfig`

Defines the configuration for each currency including symbols, acronyms, decimals, and other display-related settings.

```ts
export interface CurrencyConfig {
  Symbol: string;
  Acronym: string;
  Decimals: bigint;
  DisplayDecimals: bigint;
  UnitOfMeasure: string;
  MaxDisplayValue: number;
  MinDisplayValue: number;
  OverflowDisplayPrice: string;
  ExtendedCurrencyNameSingular: string;
  ExtendedCurrencyNamePlural: string;
  OneUnitOfCurrency: string;
}
```

### Constants

#### `DEFAULT_PREFERRED_CURRENCY`

Defines the default preferred currency as `Currency.Usd`.

```ts
export const DEFAULT_PREFERRED_CURRENCY = Currency.Usd;
```

#### `PriceCurrencyFormat`

A record mapping each `Currency` to its `CurrencyConfig`.

**Example**

```ts
import type { Currency, CurrencyConfig } from "@namehash/ens-utils";

export const PriceCurrencyFormat: Record<Currency, CurrencyConfig> = {
  /* Configuration for each currency */
};
```

### Functions

#### `getPrimaryDisplayCurrency`

Determines the primary display currency based on the provided display rule, preferred currency, and native currency.

**Parameters**

- `rule`: The display rule to apply (`CurrencyDisplayRule`).
- `preferredCurrency`: The preferred currency (`Currency`).
- `nativeCurrency`: The native currency (`Currency`).

**Returns**

- `Currency` - The determined primary display currency.

#### `getAlternateDisplayCurrency`

Determines the alternate display currency based on the provided display rule, preferred currency, and native currency.

**Parameters**

- Similar to `getPrimaryDisplayCurrency`.

**Returns**

- `Currency` - The determined alternate display currency.

#### `parseStringToCurrency`

Converts a string to a `Currency` enum value, throwing an error if the input is not a valid currency.

**Parameters**

- `string`: The string to parse.

**Returns**

- `Currency` - The parsed currency.

**Example**

```ts
import { parseStringToCurrency } from "@namehash/ens-utils";

const ethStringToCurrency = parseStringToCurrency("eth");

// ethStringToCurrency equals Currency.Eth
console.log(ethStringToCurrency); // "Eth"
```

## Number

The Number module was designed to facilitate working with different numerical types and precision scaling in TypeScript applications, this module is essential for applications that require precision arithmetic or need to handle large numbers (beyond the safe range of JavaScript's `number` type) by providing tools to convert and scale these values safely and effectively.

#### `stringToBigInt`

Converts a string to a `bigint`. Throws an error if the conversion is not possible.

**Parameters**

- `stringValue`: `String` - The string value to convert to a bigint.

**Returns**

- `bigint` - The string value converted to a bigint.

**Example**

```ts
import { stringToBigInt } from "@namehash/ens-utils";

const bigIntValue = stringToBigInt("12345");
```

#### `decimalToBigInt`

Converts a `Decimal` value to a `bigint` by first converting the `Decimal` to a `number` with fixed decimal places and rounding, then converting that number to a `bigint`. Uses `Decimal` from `Decimal.js`.

**Parameters**

- `decimalValue`: `Decimal` - The Decimal value to convert to a bigint.

**Returns**

- `bigint` - The Decimal value converted to a bigint.

**Example**

```ts
import { decimalToBigInt } from "@namehash/ens-utils";

const bigIntValue = decimalToBigInt(new Decimal(123.45));
```

#### `numberToBigInt`

Converts a number to a `bigint` after fixing it to zero decimal places. Throws an error if the conversion is not possible.

**Parameters**

- `numberValue`: `number` - The bigint value to convert to a number.

**Returns**

- `bigint` - The bigint value converted to a number.

**Example**

```ts
import { numberToBigInt } from "@namehash/ens-utils";

const bigIntValue = numberToBigInt(123.45);
```

#### `bigIntToNumber`

Converts a `bigint` to a number.

**Parameters**

- `bigIntValue`: `bigint` - The bigint value to convert to a number.

**Returns**

- `number` - The bigint value converted to a number.

**Example**

```ts
import { bigIntToNumber } from "@namehash/ens-utils";

const numberValue = bigIntToNumber(12345n);
```

#### `approxScaleBigInt`

Approximately scales a `bigint` value by a scale factor, using a specified number of digits of precision.

**Parameters**

- `bigIntValue`: bigint - The value to scale.
- `scaleFactor`: number - The factor to scale by.
- `digitsOfPrecision`: bigint - The number of digits of precision to use. Must be non-negative.

**Returns**

- `bigint` - The scaled value.

**Example**

```ts
import { approxScaleBigInt } from "@namehash/ens-utils";

const scaledValue = approxScaleBigInt(100n, 0.1, 1n); // === 10n
```

#### ⚠️ Number Exceptions

- `stringToBigInt` and `numberToBigInt` will throw an error if the input cannot be converted to a `bigint`.
- `approxScaleBigInt` throws an error if `digitsOfPrecision` is negative or if calculations overflow, underflow, or result in non-finite numbers.

## Time

This module consists of a collection of utility functions designed to handle and format time-related data in TypeScript.

- Conversion between time units (e.g., milliseconds to seconds)
- Current time retrieval
- Time formatting (e.g., to human-readable forms, short date formats)
- Calculation of time differences and descriptions relative to "now"

### Constants

| Constant                | Type     | Description                                   |
| ----------------------- | -------- | --------------------------------------------- |
| `SECONDS_PER_YEAR`      | `number` | Defines the number of seconds in a year.      |
| `ONE_MINUTE_IN_SECONDS` | `bigint` | Represents one minute in seconds as a BigInt. |
| `ONE_HOUR_IN_SECONDS`   | `bigint` | Represents one hour in seconds as a BigInt.   |
| `ONE_DAY_IN_SECONDS`    | `bigint` | Represents one day in seconds as a BigInt.    |
| `ONE_WEEK_IN_SECONDS`   | `bigint` | Represents one week in seconds as a BigInt.   |

#### Functions

#### `msToSeconds`

Converts milliseconds to seconds.

**Parameters**

- `ms`: `bigint` - The milliseconds to convert.

**Returns**

- `bigint` - The converted time in seconds.

#### `now`

Retrieves the current time in seconds.

**Returns**

- `bigint` - The current timestamp in seconds.

#### `fromTimestampToDate`

Formats a timestamp to a Date object.

**Parameters**

- `timestamp`: `bigint` - The UNIX timestamp to format.
- `asSeconds`: `boolean` (optional) - If the timestamp is in seconds (defaults to `false`).

**Returns**

- `Date` - A Date object for the formatted timestamp.

#### `timestampAsDistance`

Formats a timestamp to a string representing the distance to now, optionally with a suffix.

**Parameters**

- `timestamp`: `bigint` - The timestamp to format.
- `addSuffix`: `boolean` (optional) - Whether to add a suffix.

**Returns**

- `string` - The formatted distance string.

#### `getShortTimestampFormat`

Formats a timestamp into a short date format.

**Parameters**

- `timestamp`: bigint - The timestamp to format.

**Returns**

- `string` - The date formatted as a short string.

#### `getTimestampDescription`

Provides a description of a timestamp, formatted either as a relative distance to now or as a short date.

**Parameters**

- `timestamp`: `bigint` - The timestamp to describe.
- `showAsDistance`: `boolean` - Whether to show the timestamp as a distance from now.
- `withSufix`: `boolean` (optional) - Whether to include a suffix in the description.

**Returns** string - A description of the timestamp.

#### `getFormattedTimestamp`

Converts a timestamp into a formatted string representing local date and time.

**Parameters**

- `timestamp`: `bigint` - The timestamp to format.

**Returns**

- `string` - The localized and formatted date and time string.

#### `prettyTimestampDiffFromNow`

Returns a pretty string representing the difference between a timestamp and the current time.

**Parameters**

- `timestamp`: `bigint` - The timestamp to compare with the current time.

**Returns**

- `string` - A human-readable description of the time difference.

## Price

The Price module can be part of a financial application´ dealing with currency conversion, arithmetic operations on prices, formatting for display, and approximations. It primarily operates with a custom `Price` type, handling various currencies with support for arithmetic operations such as addition, subtraction, multiplication, and conversion between currencies using exchange rates.

### Types and Interfaces

#### `Price`

Represents a monetary value in a specific currency.

```ts
import type { Currency } from "@namehash/ens-utils";

type Price = {
  value: bigint;
  currency: Currency;
};
```

- **value**: The monetary value as a `bigint`.
- **currency**: The currency of the value, defined by the `Currency` type.

#### `ExchangeRates`

Maps different currencies to their exchange rate in USD.

```ts
import type { Currency } from "@namehash/ens-utils";

interface ExchangeRates extends Partial<Record<Currency, number>> {}
```

An example `ExchangeRates` object:

```json
{
  "ETH": 1737.16,
  "DAI": 0.99999703,
  "USDC": 1,
  "WETH": 1737.16,
  "USD": 1
}
```

### Functions

#### `priceAsNumber`

Converts a `Price` object to its numeric representation considering its currency's decimals.

**Parameters**

- `price`: `Price` - The Price to have its value returned as a number.

**Returns** `number` - A number representing the Price considering its Currency decimals.

**Example**

```ts
import { priceAsNumber } from "@namehash/ens-utils";

const tenUSDC = {
  value: 100000n,
  currency: Currency.Usdc,
};

const tenUsdcAsNumber = priceAsNumber(tenUSDC);

// tenUsdcDollarsAsNumber equals Number(1)
```

#### `numberAsPrice`

Converts a numeric value to a `Price` object in the specified currency.

**Parameters**

- `number`: `number` - The number to be set as the Price value.
- `currency`: `Currency` - The currency to be set as the Price currency.

**Returns**:

- `Price` - A Price object containing a value and a currency.

**Example**

```ts
import { numberAsPrice } from "@namehash/ens-utils";

const fromNumberTenToEthValue = numberAsPrice(10, Currency.Eth);

// fromNumberTenToEthValue equals {
//   value: 10000000000000000000n,
//   currency: Currency.Eth
// }
```

#### `addPrices`

Adds multiple `Price` objects, ensuring they are in the same currency.

**Parameters**

- `prices`: `Array<Price>` - An array of Price values.

**Returns**

- `Price` - The summing of each `prices` Price.

**Example**

```ts
import { addPrices } from "@namehash/ens-utils";

const networkFee: Price = {
  value: X,
  currency: Currency.Eth,
};
const ethDomainPrice: Price = {
  value: Y,
  currency: Currency.Eth,
};

const totalCost = addPrices([networkFee, ethDomainPrice]);

// totalCost equals {
//   value: X + Y,
//   currency: Currency.Eth
// }
```

**Throws**: Error if trying to add prices of different currencies.

#### `subtractPrices`

Subtracts one `Price` object from another, given they are in the same currency.

**Parameters**

- `price1`: `Price` - The Price to be subtracted from.
- `price2`: `Price` - The Price to be subtracted.

**Returns**

- `Price` - The `price1` subtracted by `price2`.

**Example**

```ts
import { subtractPrices } from "@namehash/ens-utils";

const ethDomainPrice: Price = {
  value: X,
  currency: Currency.Eth,
};
const ethDomainPricePremium: Price = {
  value: Y,
  currency: Currency.Eth,
};

const totalCost = subtractPrices(ethDomainPrice, ethDomainPricePremium);

// totalCost equals {
//   value: X - Y,
//   currency: Currency.Eth
// }
```

**Throws**: Error if currencies do not match.

#### `multiplyPriceByNumber`

Multiplies a `Price` by a numeric value.

**Parameters**

- `price1`: `Price` - The Price to be multiplied.
- `price2`: `number` - A number to multiply `price1` for.

**Returns**

- `Price` - The `price1`, as a Price, having its `value` multiplied by `price2`.

**Example**

```ts
import { multiplyPriceByNumber } from "@namehash/ens-utils";

const ethDomainPrice: Price = {
  value: X,
  currency: Currency.Eth,
};
const multiplier = 2;

const totalCost = multiplyPriceByNumber(ethDomainPrice, multiplier);

// totalCost equals {
//   value: X * 2,
//   currency: Currency.Eth
// }
```

#### `formattedPrice`

Returns a string representing a `Price` formatted for display, with optional prefix or suffix.

**Parameters**

- `price`: `Price` - The Price to format.
- `withPrefix` = false: `boolean` - Wether to add a Currency prefix.
- `withSufix` = false: `boolean` - Wether to add a Currency sufix.

**Returns**

- `string` - A human-readable formatted Price string.

**Example**

```ts
import { formattedPrice } from "@namehash/ens-utils";

const fiveDollarsInEth = 5000000000000000000n;

const a = formattedPrice({
  price: { currency: Currency.Eth, value: fiveDollarsInEth },
});

const b = formattedPrice({
  price: { currency: Currency.Eth, value: fiveDollarsInEth },
  withSufix: true,
});

const c = formattedPrice({
  price: { currency: Currency.Eth, value: fiveDollarsInEth },
  withPrefix: true,
});

const d = formattedPrice({
  price: { currency: Currency.Eth, value: fiveDollarsInEth },
  withPrefix: true,
  withSufix: true,
});

// a equals 5.000
// b equals 5.000 ETH
// c equals Ξ5.000
// d equals Ξ5.000 ETH
```

#### `approxScalePrice`

Scales a `Price` object by a factor with a specified number of digits of precision.

**Parameters**

- `price`: Price - The Price to scale.
- `scaleFactor`: number - The factor to scale by.
- `digitsOfPrecision` = 20n: bigint - The number of digits of precision to use. Must be non-negative.

**Returns**

- `Price` - The `price` scaled by the `scaleFactor` considering the number of `digitsOfPrecision`.

**Example**

```ts
import { approxScalePrice } from "@namehash/ens-utils";

const decayedPrice = approxScalePrice(PREMIUM_START_PRICE, decayFactor);

// decayedPrice equals PREMIUM_START_PRICE scaled (up or down, depending on decayFactor value) by decayedPrice
```

#### `convertCurrencyWithRates`

Converts a `Price` from one currency to another using provided exchange rates.

**Parameters**

- `fromPrice`: `Price` - The price to be converted to a new Currency.
- `toCurrency`: `Currency` - The new Currency to convert `fromPrice` to.
- `exchangeRates`: `ExchangeRates` - The exchange rates object. Refer to [ExchangeRates](#exchange-rates)

**Returns**

- `Price` - The converted `fromPrice` into its `toCurrency` value, calculated based on the provided `exchangeRates`.

**Example**

```ts
import { convertCurrencyWithRates } from "@namehash/ens-utils";

const fromUsd = {
  value: 500n,
  currency: Currency.Usd,
};

const exchangeRatesRecord = {
  [Currency.Eth]: 2277.56570676,
  [Currency.Usd]: 1,
};

const fromUsdToEth = convertCurrencyWithRates(
  fromUsd,
  Currency.Eth,
  exchangeRatesRecord,
);

// fromUsdToEth equals the Eth amount of $5 based on the provided currencies exchange rates
```

⚠️ Price Exceptions

- **Arithmetic Operations (add, subtract)**: Throws an error if currencies do not match.
- **Conversion Operations**: Throws an error if exchange rates do not include the necessary currencies.

## Contact Us

Visit our [website](https://namehashlabs.org/) and get in contact.

## License

Licensed under the MIT License, Copyright &copy; 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
