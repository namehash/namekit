import {
  Currency,
  type Price,
  formattedPrice,
  PriceCurrencyFormat,
  PriceSymbology,
} from "@namehash/ens-utils";
import React from "react";
import {
  CurrencySymbol,
  CurrencySymbolSize,
} from "./CurrencySymbol/CurrencySymbol";
import cc from "classcat";
import { Tooltip } from "./Tooltip";

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

export const PriceDisplaySize = {
  Micro: "nk-text-[12px] md:nk-text-[14px] nk-font-normal",
  Small: "nk-text-[14px] nk-font-semibold",
  Medium: "nk-text-[20px] nk-font-semibold",
  Large: "nk-text-[24px] nk-font-bold",
} as const;
export type PriceDisplaySize =
  (typeof PriceDisplaySize)[keyof typeof PriceDisplaySize];

/**
 * A map of the `PriceDisplaySize` to the `CurrencySymbolSize`.
 * @param priceDisplaySize: PriceDisplaySize
 * @returns CurrencySymbolSize
 */
export const parsePriceDisplaySizeToCurrencySymbolSize = (
  priceDisplaySize: PriceDisplaySize,
): CurrencySymbolSize => {
  switch (priceDisplaySize) {
    case PriceDisplaySize.Micro:
    case PriceDisplaySize.Small:
      return CurrencySymbolSize.Small;
    case PriceDisplaySize.Medium:
    case PriceDisplaySize.Large:
      return CurrencySymbolSize.Large;
  }
};

interface DisplayedPriceProps {
  // The price to be displayed
  price: Price;
  // The onClick event handler for the price text
  onTextClick?: () => void;
  // Wether to display a currency symbology as its acronym or symbol
  currencySymbology?: PriceSymbology;
  // The place to display the currency symbology
  symbolPosition?: CurrencySymbolPosition;
  // The size of the price display
  displaySize?: PriceDisplaySize;
  // Wether or not to display the name of the currency in a tooltip when its symbol is hovered
  describeCurrencyInTooltip?: boolean;
  // Wether to display the currency symbology
  withSymbol?: boolean;
}

export const DisplayedPrice = ({
  price,
  onTextClick,
  describeCurrencyInTooltip = true,
  symbolPosition = CurrencySymbolPosition.Left,
  currencySymbology = PriceSymbology.Symbol,
  displaySize = PriceDisplaySize.Small,
  withSymbol = true,
}: DisplayedPriceProps) => {
  const priceDisplaySizeAsCurrencyDisplaySize =
    parsePriceDisplaySizeToCurrencySymbolSize(displaySize);

  return (
    <div
      role={onTextClick ? "button" : undefined}
      onClick={onTextClick ? onTextClick : undefined}
      className={cc([
        "nk-min-w-max nk-inline-flex nk-justify-center nk-items-end nk-tabular-nums nk-leading-none",
        displaySize,
        {
          "!nk-cursor-text": !onTextClick,
          "!nk-cursor-pointer": onTextClick,
        },
      ])}
    >
      <p className="nk-order-2 nk-leading-none">{formattedPrice({ price })}</p>

      <div
        className={cc([
          "nk-leading-none",
          {
            "nk-mr-1": price.currency === Currency.Usd,
            "nk-order-1 nk-mr-1":
              symbolPosition === CurrencySymbolPosition.Left,
            "nk-mr-1 nk-order-3":
              symbolPosition === CurrencySymbolPosition.Right,
            "nk-hidden":
              !withSymbol || currencySymbology === PriceSymbology.Acronym,
          },
        ])}
      >
        <CurrencySymbol
          additionalClasses={onTextClick ? "nk-cursor-pointer" : ""}
          describeCurrencyInTooltip={describeCurrencyInTooltip}
          size={priceDisplaySizeAsCurrencyDisplaySize}
          currency={price.currency}
        />
      </div>

      {currencySymbology === PriceSymbology.Acronym && (
        <>
          {describeCurrencyInTooltip ? (
            <div className="nk-ml-1 nk-order-2">
              <Tooltip
                trigger={<p>{PriceCurrencyFormat[price.currency].Acronym}</p>}
              >
                {
                  PriceCurrencyFormat[price.currency]
                    .ExtendedCurrencyNameSingular
                }
              </Tooltip>
            </div>
          ) : (
            <p className="nk-ml-1 nk-order-2">
              {PriceCurrencyFormat[price.currency].Acronym}
            </p>
          )}
        </>
      )}
    </div>
  );
};
