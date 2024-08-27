import { type Price, formattedPrice } from "@namehash/ens-utils";
import React from "react";
import cc from "classcat";

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
   */
  symbol: React.ReactNode;
  /**
   * The position of the currency symbol relative to the price.
   * Defaults to `CurrencySymbolPosition.Left`.
   *
   * If `CurrencySymbolPosition.Left`, the currency symbol will be displayed to the left of the price.
   * If `CurrencySymbolPosition.Right`, the currency symbol will be displayed to the right of the price.
   */
  symbolPosition?: CurrencySymbolPosition;
  /**
   * The position of the currency symbol relative to the price.
   * Defaults to `CurrencySymbolPosition.Left`.
   *
   * If `CurrencySymbolPosition.Left`, the currency symbol will be displayed to the left of the price.
   * If `CurrencySymbolPosition.Right`, the currency symbol will be displayed to the right of the price.
   */
  displaySize?: PriceDisplaySize;
}

export const DisplayedPrice = ({
  price,
  symbol,
  displaySize = PriceDisplaySize.Small,
  symbolPosition = CurrencySymbolPosition.Left,
}: DisplayedPriceProps) => {
  const displayedPrice = (
    <div
      className={cc([
        "nk-min-w-max nk-inline-flex nk-justify-center nk-items-end nk-space-x-1 nk-tabular-nums nk-leading-none",
        displaySize,
      ])}
    >
      {symbolPosition === CurrencySymbolPosition.Left && symbol}
      <p className="nk-leading-none">{formattedPrice({ price })}</p>
      {symbolPosition === CurrencySymbolPosition.Right && symbol}
    </div>
  );

  return displayedPrice;
};
