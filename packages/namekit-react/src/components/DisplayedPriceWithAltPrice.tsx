import {
  Currency,
  formattedPrice,
  Price,
  PriceSymbology,
} from "@namehash/ens-utils";
import {
  DisplayedPrice,
  PriceDisplaySize,
  CurrencySymbolPosition,
  parsePriceDisplaySizeToCurrencySymbolSize,
} from "./DisplayedPrice";
import { useEffect } from "react";
import { CurrencySymbol } from "./CurrencySymbol/CurrencySymbol";
import { Tooltip } from "./Tooltip";
import React from "react";
import cc from "classcat";

export const AltPriceDisplayFormat = {
  /**
   * Display the alternative price as a tooltip.
   */
  Tooltip: "tooltip",
  /**
   * Display the alternative price as a text.
   */
  Text: "text",
} as const;
export type AltPriceDisplayFormat =
  (typeof AltPriceDisplayFormat)[keyof typeof AltPriceDisplayFormat];

export const PriceDisplayPosition = {
  Right: "nk-flex nk-inline-flex nk-items-end nk-space-x-2",
  Bottom: "nk-flex nk-flex-col nk-text-right nk-items-end nk-space-y-1",
} as const;
export type PriceDisplayPosition =
  (typeof PriceDisplayPosition)[keyof typeof PriceDisplayPosition];

interface DisplayedPriceWithAltPriceProps {
  // The price to be displayed
  price: Price;
  // The alternative price to be displayed (the price converted to another currency)
  altPrice?: Price;
  // The onClick event handler for the price text
  onTextClick?: () => void;
  // The onClick event handler for the alt. price text
  onAltPriceTextClick?: () => void;
  // Wether to display the alternative price as a text instead of a tooltip
  altPriceDisplayFormat: AltPriceDisplayFormat;
  // Wether to display a currency symbology as its acronym or symbol
  currencySymbology?: PriceSymbology;
  // The place to display the currency symbology
  symbolPosition?: CurrencySymbolPosition;
  // The size of the price display
  priceTextDisplaySize?: PriceDisplaySize;
  // The size of the alternative price to display, which must be smaller than the price display size
  altPriceDisplaySize?: PriceDisplaySize;
  // The place to display the alternative price when displayed as text
  altPriceDisplayPosition?: PriceDisplayPosition;
  // Wether or not to display the name of the currency in a tooltip when its symbol is hovered
  describeCurrencyInTooltip?: boolean;
}

export const DisplayedPriceWithAltPrice = ({
  price,
  altPrice,
  onTextClick,
  onAltPriceTextClick,
  describeCurrencyInTooltip = true,
  currencySymbology = PriceSymbology.Symbol,
  altPriceDisplaySize = PriceDisplaySize.Micro,
  symbolPosition = CurrencySymbolPosition.Left,
  priceTextDisplaySize = PriceDisplaySize.Small,
  altPriceDisplayPosition = PriceDisplayPosition.Right,
  altPriceDisplayFormat = AltPriceDisplayFormat.Tooltip,
}: DisplayedPriceWithAltPriceProps) => {
  // Below useEffect checks wether the alternative price display size is smaller than the price display size
  useEffect(() => {
    switch (altPriceDisplaySize) {
      case PriceDisplaySize.Micro:
        break;
      case PriceDisplaySize.Small:
        if (priceTextDisplaySize === PriceDisplaySize.Micro) {
          throw new Error(
            "The size of the alternative price must be equal or smaller than the price display size.",
          );
        }
        break;
      case PriceDisplaySize.Medium:
        if (
          priceTextDisplaySize === PriceDisplaySize.Micro ||
          priceTextDisplaySize === PriceDisplaySize.Small
        ) {
          throw new Error(
            "The size of the alternative price must be equal or smaller than the price display size.",
          );
        }
        break;
      case PriceDisplaySize.Large:
        if (
          priceTextDisplaySize === PriceDisplaySize.Micro ||
          priceTextDisplaySize === PriceDisplaySize.Small ||
          priceTextDisplaySize === PriceDisplaySize.Medium
        ) {
          throw new Error(
            "The size of the alternative price must be equal or smaller than the price display size.",
          );
        }
    }
  }, []);

  const displayAltPriceAsText =
    altPriceDisplayFormat === AltPriceDisplayFormat.Text;
  const displayAltPriceInTooltip =
    altPriceDisplayFormat === AltPriceDisplayFormat.Tooltip;
  const displayCurrencySymbol = currencySymbology === PriceSymbology.Symbol;

  const triggerElm = (
    <DisplayedPrice
      currencySymbology={currencySymbology}
      displaySize={priceTextDisplaySize}
      symbolPosition={symbolPosition}
      onTextClick={onTextClick}
      price={price}
      withSymbol={
        (displayCurrencySymbol && displayAltPriceInTooltip && !altPrice) ||
        (displayCurrencySymbol && displayAltPriceAsText)
      }
    />
  );

  if (!altPrice && displayAltPriceInTooltip) return triggerElm;
  else if (altPrice) {
    const altPriceDisplayElm = (
      <DisplayedPrice
        price={altPrice}
        symbolPosition={symbolPosition}
        onTextClick={onAltPriceTextClick}
        displaySize={altPriceDisplaySize}
        currencySymbology={currencySymbology}
        describeCurrencyInTooltip={describeCurrencyInTooltip}
      />
    );

    if (displayAltPriceAsText) {
      return (
        <div className={altPriceDisplayPosition}>
          {triggerElm}
          {altPriceDisplayElm}
        </div>
      );
    } else if (altPrice) {
      const priceDisplaySizeAsCurrencyDisplaySize =
        parsePriceDisplaySizeToCurrencySymbolSize(altPriceDisplaySize);
      return (
        <div
          className={cc([
            "nk-inline-flex nk-items-center",
            priceTextDisplaySize,
          ])}
        >
          {displayCurrencySymbol && (
            <div
              className={cc([
                {
                  "nk-mr-1 nk-order-1 nk-mb-[2px]":
                    symbolPosition === CurrencySymbolPosition.Left &&
                    price.currency !== Currency.Usd,
                  "nk-mr-1 nk-order-1":
                    symbolPosition === CurrencySymbolPosition.Left &&
                    price.currency === Currency.Usd,
                  "nk-ml-1 nk-order-3":
                    symbolPosition === CurrencySymbolPosition.Right,
                },
              ])}
            >
              <CurrencySymbol
                additionalClasses={
                  onAltPriceTextClick ? "nk-cursor-pointer" : ""
                }
                describeCurrencyInTooltip={describeCurrencyInTooltip}
                size={priceDisplaySizeAsCurrencyDisplaySize}
                currency={price.currency}
              />
            </div>
          )}

          <div className="nk-order-2 nk-leading-none">
            <Tooltip trigger={triggerElm}>
              <>
                {altPrice ? (
                  <div
                    onClick={onAltPriceTextClick || undefined}
                    role={onAltPriceTextClick ? "button" : undefined}
                    className="nk-bg-gray-900 focus:nk-outline-none nk-relative nk-h-full nk-rounded-md"
                  >
                    <div className="nk-text-[12px] nk-text-white sm:nk-text-[14px] nk-inline-flex nk-items-center nk-space-x-1 nk-tabular-nums">
                      <p
                        className={
                          onAltPriceTextClick
                            ? "nk-cursor-pointer"
                            : "nk-cursor-text"
                        }
                      >
                        {formattedPrice({
                          price: altPrice,
                          symbology: currencySymbology,
                          withPrefix: displayCurrencySymbol,
                          withSufix:
                            currencySymbology === PriceSymbology.Acronym,
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
    } else return <></>;
  } else return <></>;
};
