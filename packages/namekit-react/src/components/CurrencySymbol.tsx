import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "./Tooltip";

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
   * The symbol displayed for `Currency` will be its graphical icon (e.g. `EthIcon` that renders a SVG). If `Currency` is `Currency.Usd` then it will render as `CurrencySymbology.TextSymbol` instead.
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
   */
  iconSize?: CurrencyIconSize;

  /**
   * Classes applied to text-based symbologies (e.g. className="myCustomClassForTextSize")
   *
   * Defaults to "".
   * Useful when `symbology` is `CurrencySymbology.TextSymbol` or `CurrencySymbology.Acronym`.
   */
  className?: string;

  /**
   * If `true`, hovering over the `CurrencySymbol` will display the
   * name of `currency` in a `Tooltip`. If `false` then the `CurrencySymbol`
   * won't have any `Tooltip`.
   *
   * Defaults to `false`.
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
 * @param className: string. The classes to apply to the Icon.
 * @returns
 */
const getCurrencyIcon = ({
  currency,
  iconSize = CurrencyIconSize.Small,
  className = "",
  ...props
}: {
  currency: Currency;
  iconSize: CurrencyIconSize;
  className?: string;
}): JSX.Element => {
  let symbology = <></>;

  switch (currency) {
    case Currency.Usd:
      /**
       * USD is always displayed as a text symbol, never being represented as a SVG icon.
       */
      return (
        <CurrencySymbol
          {...props}
          currency={currency}
          className={className}
          symbology={CurrencySymbology.TextSymbol}
        />
      );
    case Currency.Usdc:
      symbology = (
        <UsdcIcon
          {...props}
          width={iconSize}
          height={iconSize}
          className={className}
        />
      );
      break;
    case Currency.Dai:
      symbology = (
        <DaiIcon
          {...props}
          width={iconSize}
          height={iconSize}
          className={className}
        />
      );
      break;
    case Currency.Weth:
      symbology = (
        <WethIcon
          {...props}
          width={iconSize}
          height={iconSize}
          className={className}
        />
      );
      break;
    case Currency.Eth:
      symbology = (
        <EthIcon
          {...props}
          width={iconSize}
          height={iconSize}
          className={className}
        />
      );
      break;
    case Currency.Gas:
      symbology = (
        <GasIcon
          {...props}
          width={iconSize}
          height={iconSize}
          className={className}
        />
      );
      break;
  }

  return (
    <span
      aria-label={`${PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular} symbol`}
    >
      {symbology}
    </span>
  );
};

/**
 * Returns a JSX.Element containing the currency's symbol, acronym or icon.
 * @param currency: Currency. The currency to get the symbology for (e.g. Currency.Eth)
 * @param symbology: CurrencySymbology. The symbology to use (e.g. CurrencySymbology.TextSymbol)
 * @param iconSize: CurrencyIconSize. The size to use for Icon Symbology.
 *                   For other symbologies it is ignored. We suggest you use props to define
 *                   other symbologies sizes, as these are not SVGs but texts, instead. (e.g. className="myCustomClassForTextSize")
 * @param className: string. The classes to apply to the symbology.
 * @returns: JSX.Element. The currency's symbol, acronym or icon inside a JSX.Element where all extra props will be applied.
 */
const getCurrencySymbology = ({
  currency,
  symbology = CurrencySymbology.TextSymbol,
  iconSize = CurrencyIconSize.Small,
  className = "",
  ...props
}: {
  currency: Currency;
  symbology: CurrencySymbology;
  iconSize?: CurrencyIconSize;
  className?: string;
}): JSX.Element => {
  switch (symbology) {
    case CurrencySymbology.Acronym:
      return (
        <p
          {...props}
          className={className}
          aria-label={`${PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular} symbol`}
        >
          {PriceCurrencyFormat[currency].Acronym}
        </p>
      );
    case CurrencySymbology.TextSymbol:
      return (
        <p
          {...props}
          className={className}
          aria-label={`${PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular} symbol`}
        >
          {PriceCurrencyFormat[currency].Symbol}
        </p>
      );
    case CurrencySymbology.Icon:
      return getCurrencyIcon({ currency, iconSize, className, ...props });
  }
};

export const CurrencySymbol = ({
  currency,
  iconSize = CurrencyIconSize.Small,
  describeCurrencyInTooltip = false,
  symbology = CurrencySymbology.TextSymbol,
  className = "",
  ...props
}: CurrencySymbolProps): JSX.Element => {
  const symbologyToDisplay = (
    <>
      {getCurrencySymbology({
        currency,
        iconSize,
        symbology,
        className,
        ...props,
      })}
    </>
  );

  if (!describeCurrencyInTooltip) return symbologyToDisplay;

  return (
    <Tooltip trigger={symbologyToDisplay}>
      <>{PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular}</>
    </Tooltip>
  );
};
