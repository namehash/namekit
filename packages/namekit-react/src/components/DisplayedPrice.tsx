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
 * A mapping from a `PriceDisplaySize` to a `CurrencySymbolSize`.
 * This is useful for determining the size of the currency symbol to display
 * for a given price display size. e.g. as needed in DisplayedPrice, when a
 * currency symbol is displayed alongside a price and the user can define
 * the size of the price display. This way both price display size and
 * currency symbol size can be controlled by the same prop, always
 * guaranteeing that they are displayed with aligned sizes.
 * @param priceDisplaySize: PriceDisplaySize. The size of the price display.
 * @returns CurrencySymbolSize. The size of the currency symbol to display.
 */
export const getCurrencySymbolSize = (
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

export interface DisplayedPriceProps {
  // The price to be displayed
  price: Price;
  // Wether to display a currency symbology as its acronym or symbol
  currencySymbology?: PriceSymbology;
  /**
   * The position of the currency symbol relative to the price.
   * Defaults to `CurrencySymbolPosition.Left`.
   *
   * If `CurrencySymbolPosition.Left`, the currency symbol will be displayed to the left of the price.
   * If `CurrencySymbolPosition.Right`, the currency symbol will be displayed to the right of the price.
   */
  symbolPosition?: CurrencySymbolPosition;
  // The size of the price display
  displaySize?: PriceDisplaySize;
  // Wether or not to display the name of the currency in a tooltip when its symbol is hovered
  describeCurrencyInTooltip?: boolean;
  // Whenever below prop is defined, the price is displayed inside a Tooltip which is triggered by the below content
  tooltipTriggerToDisplayPriceInTooltip?: React.ReactNode;
}

export const DisplayedPrice = ({
  price,
  describeCurrencyInTooltip = true,
  displaySize = PriceDisplaySize.Small,
  tooltipTriggerToDisplayPriceInTooltip,
  currencySymbology = PriceSymbology.Symbol,
  symbolPosition = CurrencySymbolPosition.Left,
}: DisplayedPriceProps) => {
  const priceDisplaySizeAsCurrencyDisplaySize =
    getCurrencySymbolSize(displaySize);

  const displayedPrice = (
    <div
      className={cc([
        "nk-min-w-max nk-inline-flex nk-justify-center nk-items-end nk-tabular-nums nk-leading-none",
        displaySize,
      ])}
    >
      <p className="nk-order-2 nk-leading-none">{formattedPrice({ price })}</p>

      {currencySymbology === PriceSymbology.Symbol && (
        <div
          className={cc([
            "nk-leading-none",
            {
              "nk-mr-1": price.currency === Currency.Usd,
              "nk-order-1 nk-mr-1":
                symbolPosition === CurrencySymbolPosition.Left,
              "nk-mr-1 nk-order-3":
                symbolPosition === CurrencySymbolPosition.Right,
            },
          ])}
        >
          <CurrencySymbol
            currency={price.currency}
            size={priceDisplaySizeAsCurrencyDisplaySize}
            describeCurrencyInTooltip={describeCurrencyInTooltip}
            className={price.currency === Currency.Usd ? "nk--mr-1" : ""}
          />
        </div>
      )}

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

  const displayedPriceInATooltip = (
    <div className={cc(["nk-inline-flex nk-items-center", displaySize])}>
      <div className="nk-order-2 nk-leading-none">
        <Tooltip trigger={tooltipTriggerToDisplayPriceInTooltip}>
          <>
            {price ? (
              <div className="nk-bg-gray-900 focus:nk-outline-none nk-relative nk-h-full nk-rounded-md">
                <div className="nk-text-[12px] nk-text-white sm:nk-text-[14px] nk-inline-flex nk-items-center nk-space-x-1 nk-tabular-nums nk-leading-none">
                  <p>
                    {formattedPrice({
                      price: price,
                      symbology: currencySymbology,
                      withPrefix: currencySymbology === PriceSymbology.Symbol,
                      withSufix: currencySymbology === PriceSymbology.Acronym,
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        </Tooltip>
      </div>
    </div>
  );

  return tooltipTriggerToDisplayPriceInTooltip
    ? displayedPriceInATooltip
    : displayedPrice;
};
