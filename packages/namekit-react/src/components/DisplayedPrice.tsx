import { type Price, formattedPrice } from "@namehash/ens-utils";
import React from "react";
import cc from "classcat";
import {
  CurrencySymbol,
  CurrencySymbology,
  CurrencySymbolSize,
} from "./CurrencySymbol/CurrencySymbol";

export const PriceDisplaySize = {
  Micro: "nk-text-[12px] md:nk-text-[14px] nk-font-normal",
  Small: "nk-text-[14px] nk-font-semibold",
  Medium: "nk-text-[20px] nk-font-semibold",
  Large: "nk-text-[24px] nk-font-bold",
} as const;
export type PriceDisplaySize =
  (typeof PriceDisplaySize)[keyof typeof PriceDisplaySize];

export const CurrencySymbolPosition = {
  /**
   * Display the currency symbol to the left of the price. (e.g. $1.00)
   */
  Left: "nk-mr-1.5",
  /**
   * Display the currency symbol to the right of the price. (e.g. 1.00$)
   */
  Right: "nk-ml-1.5",
} as const;
export type CurrencySymbolPosition =
  (typeof CurrencySymbolPosition)[keyof typeof CurrencySymbolPosition];

export interface DisplayedPriceProps {
  /**
   * The price value to be displayed
   * @example { currency: Currency.Eth, value: 1000000000000000000n }
   */
  price: Price;
  /**
   * The `CurrencySymbol` to display alongside the `Price`.
   *
   * Whenever symbol is defined as null, no symbol is displayed.
   * Whenever no symbol is defined, the default symbol is displayed.
   */
  symbol?: React.ReactNode | null;
  /**
   * The position of the currency symbol relative to the price.
   * Defaults to `CurrencySymbolPosition.Left`.
   *
   * If `CurrencySymbolPosition.Left`, the currency symbol will be displayed to the left of the price.
   * If `CurrencySymbolPosition.Right`, the currency symbol will be displayed to the right of the price.
   */
  symbolPosition?: CurrencySymbolPosition;
  displaySize?: PriceDisplaySize;
}

/**
 * Below function makes possible to render a symbol sized according to the price display size.
 * @param displaySize PriceDisplaySize. The size the price will be displayed at.
 * @returns CurrencySymbolSize. The size the currency symbol should be displayed at.
 */
const fromPriceDisplaySizeToCurrencySymbolSize = (
  displaySize: PriceDisplaySize,
): CurrencySymbolSize => {
  switch (displaySize) {
    case PriceDisplaySize.Micro:
      return CurrencySymbolSize.Small;
    case PriceDisplaySize.Small:
      return CurrencySymbolSize.Small;
    case PriceDisplaySize.Medium:
      return CurrencySymbolSize.Large;
    case PriceDisplaySize.Large:
      return CurrencySymbolSize.Large;
  }
};

export const DisplayedPrice = ({
  price,
  symbol,
  symbolPosition = CurrencySymbolPosition.Left,
  displaySize = PriceDisplaySize.Small,
}: DisplayedPriceProps) => {
  const displayDefaultSymbol = typeof symbol === "undefined";

  const symbolToDisplay = displayDefaultSymbol ? (
    <CurrencySymbol
      currency={price.currency}
      style={{
        fontSize: fromPriceDisplaySizeToCurrencySymbolSize(displaySize),
      }}
    />
  ) : (
    symbol
  );

  const displayedPrice = (
    <div
      className={cc([
        "nk-min-w-max nk-inline-flex nk-justify-center nk-items-end nk-space-x-1 nk-tabular-nums nk-leading-none",
        displaySize,
      ])}
    >
      {symbolPosition === CurrencySymbolPosition.Left && symbolToDisplay}
      <p className="nk-leading-none">{formattedPrice({ price })}</p>
      {symbolPosition === CurrencySymbolPosition.Right && symbolToDisplay}
    </div>
  );

  return displayedPrice;
};
