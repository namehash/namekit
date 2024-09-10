import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "./Tooltip";

import { UsdTextSymbol } from "./icons/UsdTextSymbol";
import { UsdcIcon } from "./icons/UsdcIcon";
import { WethIcon } from "./icons/WethIcon";
import { EthIcon } from "./icons/EthIcon";
import { DaiIcon } from "./icons/DaiIcon";
import { GasIcon } from "./icons/GasIcon";

import React from "react";

/**
 * The size of the `CurrencySymbol` icon.
 * This is defined as a mapping from a `CurrencyIconSize` to a number.
 * This number represents the size (width and height) that the icon for a `CurrencySymbol` should be displayed at, in pixels.
 */
export const CurrencyIconSize = {
  Small: 16,
  Large: 20,
} as const;
export type CurrencyIconSize =
  (typeof CurrencyIconSize)[keyof typeof CurrencyIconSize];

export const CurrencySymbology = {
  /**
   * The symbol displayed for `Currency` will be its acronym as text. (e.g. "USD").
   */
  Acronym: "Acronym",
  /**
   * The symbol displayed for `Currency` will be its text-based symbol (e.g. "$").
   */
  TextSymbol: "TextSymbol",
  /**
   * The symbol displayed for `Currency` will be its graphical icon (e.g. the Ethereum Icon as an SVG).
   */
  Icon: "Icon",
} as const;
export type CurrencySymbology =
  (typeof CurrencySymbology)[keyof typeof CurrencySymbology];

interface CurrencySymbolProps extends React.ComponentProps<React.ElementType> {
  /**
   * The `Currency` to display the symbol for.
   */
  currency: Currency;

  /**
   * The size of the `CurrencySymbol` icon.
   *
   * Defaults to `CurrencyIconSize.Small`.
   * Only applicable when `symbology` is `CurrencySymbology.Icon`.
   * If you want to set a custom appearance for other text-based symbologies, use the `className` prop to define it (e.g. className="myCustomClassForTextSize")
   */
  iconSize?: CurrencyIconSize;

  /**
   * If `true`, hovering over the `CurrencySymbol` will display the
   * name of `currency` in a `Tooltip`. If `false` then the `CurrencySymbol`
   * won't have any `Tooltip`.
   *
   * Defaults to `true`.
   */
  describeCurrencyInTooltip?: boolean;

  /**
   * The symbology to use when displaying `currency`.
   *
   * Defaults to `CurrencySymbology.TextSymbol`.
   */
  symbology?: CurrencySymbology;
}

/**
 *
 * @param currency: Currency. The currency to get the Icon for (e.g. Currency.Eth)
 * @param iconSize: CurrencyIconSize. The Icon size (width and height), in pixels.
 * @returns
 */
const getCurrencyIcon = ({
  currency,
  iconSize = CurrencyIconSize.Small,
  ...props
}: {
  currency: Currency;
  iconSize: CurrencyIconSize;
}): JSX.Element => {
  switch (currency) {
    case Currency.Usd:
      /**
       * USD is always displayed as a text symbol, never being represented as a SVG icon.
       */
      return <UsdTextSymbol {...props} />;
    case Currency.Usdc:
      return <UsdcIcon {...props} width={iconSize} height={iconSize} />;
    case Currency.Dai:
      return <DaiIcon {...props} width={iconSize} height={iconSize} />;
    case Currency.Weth:
      return <WethIcon {...props} width={iconSize} height={iconSize} />;
    case Currency.Eth:
      return <EthIcon {...props} width={iconSize} height={iconSize} />;
    case Currency.Gas:
      return <GasIcon {...props} width={iconSize} height={iconSize} />;
  }
};

/**
 * Returns a JSX.Element containing the currency's symbol, acronym or icon.
 * @param currency: Currency. The currency to get the symbology for (e.g. Currency.Eth)
 * @param iconSize: CurrencyIconSize. The size to use for Icon Symbology.
 *                   For other symbologies it is ignored. We suggest you use props to define
 *                   other symbologies sizes, as these are not SVGs but texts, instead. (e.g. className="myCustomClassForTextSize")
 * @param symbology: CurrencySymbology. The symbology to use (e.g. CurrencySymbology.TextSymbol)
 * @returns: JSX.Element. The currency's symbol, acronym or icon inside a JSX.Element where all extra props will be applied.
 */
const getCurrencySymbology = ({
  currency,
  symbology = CurrencySymbology.TextSymbol,
  iconSize = CurrencyIconSize.Small,
  ...props
}: {
  currency: Currency;
  symbology: CurrencySymbology;
  iconSize?: CurrencyIconSize;
}): JSX.Element => {
  switch (symbology) {
    case CurrencySymbology.Acronym:
      return <p {...props}>{PriceCurrencyFormat[currency].Acronym}</p>;
    case CurrencySymbology.TextSymbol:
      return <p {...props}>{PriceCurrencyFormat[currency].Symbol}</p>;
    case CurrencySymbology.Icon:
      return getCurrencyIcon({ currency, iconSize, ...props });
  }
};

export const CurrencySymbol = ({
  currency,
  iconSize = CurrencyIconSize.Small,
  describeCurrencyInTooltip = false,
  symbology = CurrencySymbology.TextSymbol,
  ...props
}: CurrencySymbolProps): JSX.Element => {
  const symbologyToDisplay = (
    <span
      aria-label={`${PriceCurrencyFormat[Currency.Eth].ExtendedCurrencyNameSingular} symbol`}
    >
      {getCurrencySymbology({
        currency,
        iconSize,
        symbology,
        ...props,
      })}
    </span>
  );

  if (!describeCurrencyInTooltip) return symbologyToDisplay;

  return (
    <Tooltip trigger={symbologyToDisplay}>
      <>{PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular}</>
    </Tooltip>
  );
};
