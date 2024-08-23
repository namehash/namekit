import {
  Currency,
  CurrencySymbology,
  PriceCurrencyFormat,
  getCurrencySymbology,
} from "@namehash/ens-utils";
import React from "react";
import {
  CurrencySymbol,
  CurrencySymbolSize,
} from "./CurrencySymbol/CurrencySymbol";
import cc from "classcat";
import { Tooltip } from "./Tooltip";
import {
  DisplayedPrice,
  PriceDisplaySize,
  DisplayedPriceProps,
} from "./DisplayedPrice";

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

export interface DisplayedPriceWithSymbolProps extends DisplayedPriceProps {
  // Wether to display a currency symbology as its acronym or symbol
  currencySymbology?: CurrencySymbology;
  /**
   * The position of the currency symbol relative to the price.
   * Defaults to `CurrencySymbolPosition.Left`.
   *
   * If `CurrencySymbolPosition.Left`, the currency symbol will be displayed to the left of the price.
   * If `CurrencySymbolPosition.Right`, the currency symbol will be displayed to the right of the price.
   */
  symbolPosition?: CurrencySymbolPosition;
  // Wether or not to display the name of the currency in a tooltip when its symbol is hovered
  describeCurrencyInTooltip?: boolean;
}

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

export const DisplayedPriceWithSymbol = ({
  currencySymbology = CurrencySymbology.Symbol,
  symbolPosition = CurrencySymbolPosition.Left,
  displaySize = PriceDisplaySize.Small,
  describeCurrencyInTooltip = true,
  ...props
}: DisplayedPriceWithSymbolProps) => {
  const priceDisplaySizeAsCurrencyDisplaySize =
    getCurrencySymbolSize(displaySize);

  const displayedPriceWithSymbol = (
    <DisplayedPrice
      displaySize={displaySize}
      price={props.price}
      symbol={
        <>
          {currencySymbology === CurrencySymbology.Symbol && (
            <div
              className={cc([
                "nk-leading-none",
                {
                  "nk-mr-1": props.price.currency === Currency.Usd,
                  "nk-order-1 nk-mr-1":
                    symbolPosition === CurrencySymbolPosition.Left,
                  "nk-mr-1 nk-order-3":
                    symbolPosition === CurrencySymbolPosition.Right,
                },
              ])}
            >
              <CurrencySymbol
                currency={props.price.currency}
                size={priceDisplaySizeAsCurrencyDisplaySize}
                describeCurrencyInTooltip={describeCurrencyInTooltip}
                className={
                  props.price.currency === Currency.Usd ? "nk--mr-1" : ""
                }
              />
            </div>
          )}

          {currencySymbology === CurrencySymbology.Acronym && (
            <>
              {describeCurrencyInTooltip ? (
                <div className="nk-ml-1 nk-order-2">
                  <Tooltip
                    trigger={
                      <p>{PriceCurrencyFormat[props.price.currency].Acronym}</p>
                    }
                  >
                    {
                      PriceCurrencyFormat[props.price.currency]
                        .ExtendedCurrencyNameSingular
                    }
                  </Tooltip>
                </div>
              ) : (
                <p className="nk-ml-1 nk-order-2">
                  {PriceCurrencyFormat[props.price.currency].Acronym}
                </p>
              )}
            </>
          )}
        </>
      }
    />
  );

  const displayedPriceWithSymbolInATooltip = (
    <DisplayedPrice
      {...props}
      displaySize={displaySize}
      tooltipTriggerToDisplayPriceInTooltip={
        props.tooltipTriggerToDisplayPriceInTooltip
      }
      symbol={
        <>
          <div
            className={cc([
              {
                "nk-order-1 nk-mr-1":
                  symbolPosition === CurrencySymbolPosition.Left,
                "nk-order-3 nk-ml-1":
                  symbolPosition === CurrencySymbolPosition.Right,
              },
            ])}
          >
            {getCurrencySymbology(props.price.currency, currencySymbology)}
          </div>
        </>
      }
    />
  );

  return props.tooltipTriggerToDisplayPriceInTooltip
    ? displayedPriceWithSymbolInATooltip
    : displayedPriceWithSymbol;
};
