import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "../Tooltip";

import { UsdSymbol } from "./icons/UsdSymbol";
import { UsdcSymbol } from "./icons/UsdcSymbol";
import { WethSymbol } from "./icons/WethSymbol";
import { EthSymbol } from "./icons/EthSymbol";
import { DaiSymbol } from "./icons/DaiSymbol";
import React from "react";

/**
 * The size of the `CurrencySymbol`.
 * This is defined as a mapping from a `CurrencySymbolSize` to a number.
 * This number represents the size a `CurrencySymbol` should be displayed at, in pixels.
 */
export const CurrencySymbolSize = {
  Small: 16,
  Large: 20,
} as const;
export type CurrencySymbolSize =
  (typeof CurrencySymbolSize)[keyof typeof CurrencySymbolSize];

interface CurrencySymbolProps extends React.ComponentProps<React.ElementType> {
  /**
   * The `Currency` to display the symbol for.
   */
  currency: Currency;

  /**
   * The size of the `CurrencySymbol`.
   *
   * Defaults to `CurrencySymbolSize.Small`.
   */
  size?: CurrencySymbolSize;

  /**
   * If `true`, hovering over the `CurrencySymbol` will display the
   * name of `currency` in a `Tooltip`. If `false` then the `CurrencySymbol`
   * won't have any `Tooltip`.
   *
   * Defaults to `true`.
   */
  describeCurrencyInTooltip: boolean;
}

export const CurrencySymbol = ({
  size = CurrencySymbolSize.Small,
  describeCurrencyInTooltip = true,
  currency,
  ...props
}: CurrencySymbolProps): JSX.Element => {
  let symbol: JSX.Element;

  switch (currency) {
    case Currency.Usd:
      symbol = (
        <span
          aria-label={`${PriceCurrencyFormat[Currency.Usd].ExtendedCurrencyNameSingular} symbol`}
        >
          <UsdSymbol {...props} />
        </span>
      );
      break;
    case Currency.Usdc:
      symbol = (
        <span
          aria-label={`${PriceCurrencyFormat[Currency.Usdc].ExtendedCurrencyNameSingular} symbol`}
        >
          <UsdcSymbol {...props} width={size} height={size} />
        </span>
      );
      break;
    case Currency.Dai:
      symbol = (
        <span
          aria-label={`${PriceCurrencyFormat[Currency.Dai].ExtendedCurrencyNameSingular} symbol`}
        >
          <DaiSymbol {...props} width={size} height={size} />
        </span>
      );
      break;
    case Currency.Weth:
      symbol = (
        <span
          aria-label={`${PriceCurrencyFormat[Currency.Weth].ExtendedCurrencyNameSingular} symbol`}
        >
          <WethSymbol {...props} width={size} height={size} />
        </span>
      );
      break;
    case Currency.Eth:
      symbol = (
        <span
          aria-label={`${PriceCurrencyFormat[Currency.Eth].ExtendedCurrencyNameSingular} symbol`}
        >
          <EthSymbol {...props} width={size} height={size} />
        </span>
      );
      break;
    default:
      // TODO: We haven't created symbols for `Currency.Gas` yet.
      throw new Error(
        `Error creating CurrencySymbol: unsupported Currency: "${currency}".`,
      );
  }

  if (!describeCurrencyInTooltip) return symbol;

  return (
    <Tooltip trigger={symbol}>
      <>{PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular}</>
    </Tooltip>
  );
};
