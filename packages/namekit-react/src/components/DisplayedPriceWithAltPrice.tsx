import {
  Currency,
  formattedPrice,
  Price,
  PriceSymbology,
} from "@namehash/ens-utils";
import {
  AltPriceDisplayFormat,
  CurrencySymbolPosition,
  DisplayedPrice,
  parsePriceDisplaySizeToCurrencySymbolSize,
  PriceDisplayPosition,
  PriceDisplaySize,
} from "./DisplayedPrice";
import { useEffect } from "react";
import { CurrencySymbol } from "./CurrencySymbol/CurrencySymbol";
import { Tooltip } from "./Tooltip";
import React from "react";
import cc from "classcat";

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

  const triggerElm = (
    <DisplayedPrice
      currencySymbology={currencySymbology}
      displaySize={priceTextDisplaySize}
      symbolPosition={symbolPosition}
      onTextClick={onTextClick}
      price={price}
      withSymbol={
        (currencySymbology === PriceSymbology.Symbol &&
          altPriceDisplayFormat === AltPriceDisplayFormat.Tooltip &&
          !altPrice) ||
        (currencySymbology === PriceSymbology.Symbol &&
          altPriceDisplayFormat === AltPriceDisplayFormat.Text)
      }
    />
  );

  if (!altPrice && altPriceDisplayFormat === AltPriceDisplayFormat.Tooltip)
    return triggerElm;
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

    if (altPriceDisplayFormat === AltPriceDisplayFormat.Text) {
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
          {currencySymbology === PriceSymbology.Symbol && (
            <div
              className={cc([
                {
                  "nk-mr-0.5 nk-order-1 nk-mb-[2px]":
                    symbolPosition === CurrencySymbolPosition.Left &&
                    price.currency !== Currency.Usd,
                  "nk-mr-1.5 nk-order-1":
                    symbolPosition === CurrencySymbolPosition.Left &&
                    price.currency === Currency.Usd,
                  "nk-ml-1.5 nk-order-3":
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
                    <div className="nk-text-[12px] nk-text-white sm:nk-text-[14px] nk-inline-flex nk-items-center nk-space-x-0.5 nk-tabular-nums">
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
                          withPrefix:
                            currencySymbology === PriceSymbology.Symbol,
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
