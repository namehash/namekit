import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "./Tooltip";

import { UsdSymbol } from "./icons/UsdSymbol";
import { UsdcSymbol } from "./icons/UsdcSymbol";
import { WethSymbol } from "./icons/WethSymbol";
import { EthSymbol } from "./icons/EthSymbol";
import { DaiSymbol } from "./icons/DaiSymbol";
import React from "react";

/**
 * The size of the `CurrencySymbol`.
 * This is defined as a mapping from a `CurrencySymbolSize` to a number.
 * This number represents the size (width and height) a `CurrencySymbol` should be displayed at, in pixels.
 */
export const CurrencySymbolSize = {
  Small: 16,
  Large: 20,
} as const;
export type CurrencySymbolSize =
  (typeof CurrencySymbolSize)[keyof typeof CurrencySymbolSize];

export const CurrencySymbology = {
  /**
   * The symbol displayed for `Currency` will be its acronym as text. (e.g. "USD").
   */
  Acronym: "Acronym",
  /**
   * The symbol displayed for `Currency` will be its text-based symbol (e.g. "$").
   */
  Symbol: "Symbol",
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
   * Defaults to `CurrencySymbolSize.Small`.
   * Only applicable when `symbology` is `CurrencySymbology.Icon`.
   * If you want to set a custom size for other symbologies, use props to define it (e.g. className="myCustomClassForTextSize")
   */
  iconSize?: CurrencySymbolSize;

  /**
   * If `true`, hovering over the `CurrencySymbol` will display the
   * name of `currency` in a `Tooltip`. If `false` then the `CurrencySymbol`
   * won't have any `Tooltip`.
   *
   * Defaults to `true`.
   */
  describeCurrencyInTooltip?: boolean;

  /**
   * The symbology to use when displaying the currency.
   *
   * Defaults to `CurrencySymbology.Symbol`.
   */
  symbology?: CurrencySymbology;
}

/**
 *
 * @param currency: Currency. The currency to get the Icon for (e.g. Currency.Eth)
 * @param iconSize: CurrencySymbolSize. The Icon size (width and height), in pixels.
 * @returns
 */
const getCurrencyIcon = ({
  currency,
  iconSize = CurrencySymbolSize.Small,
  ...props
}: {
  iconSize: CurrencySymbolSize;
  currency: Currency;
}): JSX.Element => {
  switch (currency) {
    case Currency.Usd:
      return <UsdSymbol {...props} />;
    case Currency.Usdc:
      return <UsdcSymbol {...props} width={iconSize} height={iconSize} />;
    case Currency.Dai:
      return <DaiSymbol {...props} width={iconSize} height={iconSize} />;
    case Currency.Weth:
      return <WethSymbol {...props} width={iconSize} height={iconSize} />;
    case Currency.Eth:
      return <EthSymbol {...props} width={iconSize} height={iconSize} />;
    default:
      // TODO: We haven't created symbols for `Currency.Gas` yet.
      throw new Error(
        `Error creating CurrencySymbol: unsupported Currency: "${currency}".`,
      );
  }
};

/**
 * Returns a JSX.Element containing the currency's symbol, acronym or icon.
 * @param currency: Currency. The currency to get the symbology for (e.g. Currency.Eth)
 * @param symbology: CurrencySymbolSize. The size to use for Icon Symbology.
 *                   For other symbologies it is ignored. We suggest you use props to define
 *                   other symbologies sizes, as these are not SVGs but texts, instead. (e.g. className="myCustomClassForTextSize")
 * @param symbology: CurrencySymbology. The symbology to use (e.g. CurrencySymbology.Symbol)
 * @returns: JSX.Element. The currency's symbol, acronym or icon inside a JSX.Element where all extra props will be applied.
 */
const getCurrencySymbology = ({
  currency,
  iconSize = CurrencySymbolSize.Small,
  symbology = CurrencySymbology.Symbol,
  ...props
}: {
  currency: Currency;
  iconSize?: CurrencySymbolSize;
  symbology: CurrencySymbology;
}): JSX.Element => {
  switch (symbology) {
    case CurrencySymbology.Acronym:
      return <p {...props}>{PriceCurrencyFormat[currency].Acronym}</p>;
    case CurrencySymbology.Symbol:
      return <p {...props}>{PriceCurrencyFormat[currency].Symbol}</p>;
    case CurrencySymbology.Icon:
      return getCurrencyIcon({ currency, iconSize, ...props });
  }
};

export const CurrencySymbol = ({
  currency,
  iconSize = CurrencySymbolSize.Small,
  describeCurrencyInTooltip = true,
  symbology = CurrencySymbology.Symbol,
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
