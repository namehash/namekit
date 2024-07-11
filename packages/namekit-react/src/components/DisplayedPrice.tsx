import {
  Currency,
  type Price,
  formattedPrice,
  PriceCurrencyFormat,
} from "@namehash/ens-utils";

import React from "react";
import {
  CurrencySymbol,
  CurrencySymbolPosition,
  CurrencySymbology,
} from "./CurrencySymbol";

import cc from "classcat";
import { Tooltip } from "./Tooltip";

export enum AltPriceDisplayFormat {
  Tooltip,
  Text,
}

export enum PriceDisplaySize {
  Micro = "nk-text-xs md:nk-text-sm nk-font-normal",
  Small = "nk-text-sm nk-font-semibold",
  Medium = "nk-text-xl nk-font-semibold",
  Large = "nk-text-xl nk-font-semibold md:nk-text-2xl md:nk-font-bold",
}

export enum PriceDisplayPosition {
  Right = "nk-flex nk-inline-flex nk-items-end nk-space-x-2",
  Bottom = "nk-flex nk-flex-col nk-text-right nk-items-end nk-space-y-1",
}

interface DisplayedPriceProps {
  // The price to be displayed
  price: Price;
  // The alternative price to be displayed (the price converted to another currency)
  altPrice?: Price;
  // The onClick event handler for the price text
  onTextClick?: () => void;
  // Wether to display the alternative price as a text instead of a tooltip
  altPriceDisplayFormat: AltPriceDisplayFormat;
  // Wether to display a currency symbology as its acronym or symbol
  currencySymbology?: CurrencySymbology;
  // The place to display the currency symbology
  symbolPosition?: CurrencySymbolPosition;
  // The size of the alternative price display
  altPriceDisplaySize?: PriceDisplaySize;
  // The size of the price display
  priceTextDisplaySize?: PriceDisplaySize;
  // The place to display the alternative price when displayed as text
  altPriceDisplayPosition?: PriceDisplayPosition;
  // Wether or not to display the name of the currency in a tooltip when its symbol is hovered
  describeCurrencyInTooltip?: boolean;
}

export const DisplayedPrice = ({
  price,
  altPrice,
  onTextClick,
  describeCurrencyInTooltip = true,
  symbolPosition = CurrencySymbolPosition.Left,
  currencySymbology = CurrencySymbology.Symbol,
  altPriceDisplaySize = PriceDisplaySize.Micro,
  priceTextDisplaySize = PriceDisplaySize.Small,
  altPriceDisplayPosition = PriceDisplayPosition.Right,
  altPriceDisplayFormat = AltPriceDisplayFormat.Tooltip,
}: DisplayedPriceProps) => {
  const displayCurrencySymbol = currencySymbology === CurrencySymbology.Symbol;
  const displayCurrencyAcronym =
    currencySymbology === CurrencySymbology.Acronym;
  const displayPriceConversionInTooltip =
    altPriceDisplayFormat === AltPriceDisplayFormat.Tooltip;
  const displayPriceConversionInInlineText =
    altPriceDisplayFormat === AltPriceDisplayFormat.Text;
  const displaySymbolInlineAndPriceConversionInTooltip =
    displayPriceConversionInTooltip && displayCurrencySymbol;

  const priceDisplayElm = (
    <div
      role={onTextClick ? "button" : undefined}
      onClick={onTextClick ? onTextClick : undefined}
      className={cc([
        "nk-min-w-max nk-inline-flex nk-items-center nk-justify-end nk-tabular-nums nk-leading-none",
        priceTextDisplaySize,
        {
          "nk-cursor-text": !onTextClick,
          "nk-cursor-pointer": onTextClick,
        },
      ])}
    >
      <p className="nk-order-2 nk-leading-none">{formattedPrice({ price })}</p>

      {/* 
        There is one important Ui logic here:

        If the user wants to display the price conversion in a tooltip it means
        that both price hover AND symbol hover would trigger a tooltip, being the 
        first one the altPrice displaying and the second one, the currency name
        displaying. In order to avoid the same element (priceDisplayElm) to
        trigger two different tooltips, we display the currency symbol
        as a sibling of the price text whenever the price conversion 
        is displayed in a tooltip. 
        
        Reference: last return statement of this file.

        - 
        
        But, if:
        1. The user wants to display the currency symbol inline 
        and the price conversion in a tooltip AND no altPrice is informed,
        we come back to the original behavior of displaying the currency symbol
        inline with the price text (this is OK because there is no altPrice to be
        displayed in a tooltip, thus, no tooltip trigger conflict will happen)

        2. The user wants to display the currency symbol inline and the price conversion
        inline as well, there is no need to display the currency symbol as a sibling
        of the price text because the tooltip trigger conflict will not happen in
        this case where price is not a trigger!

        These are the two conditionals below.
      */}
      {(displaySymbolInlineAndPriceConversionInTooltip && !altPrice) ||
      (displayCurrencySymbol && displayPriceConversionInInlineText) ? (
        <div
          className={cc([
            "nk-leading-none",
            {
              "nk-mb-[1px]": price.currency !== Currency.Usd,
              "nk-mr-1": price.currency === Currency.Usd,
              "nk-order-1 nk-mr-0.5":
                symbolPosition === CurrencySymbolPosition.Left,
              "nk-mr-1.5 nk-order-3":
                symbolPosition === CurrencySymbolPosition.Right,
            },
          ])}
        >
          <CurrencySymbol
            describeCurrencyInTooltip={describeCurrencyInTooltip}
            currency={price.currency}
            size={priceTextDisplaySize}
          />
        </div>
      ) : null}

      {displayCurrencyAcronym && (
        <p className="nk-ml-1 nk-order-2">
          {PriceCurrencyFormat[price.currency].Acronym}
        </p>
      )}
    </div>
  );

  /*
    There is no way to display alternative price without altPrice informed
  */
  if (!altPrice) return priceDisplayElm;
  else {
    const altPriceDisplayElm = (
      <div
        className={cc([
          "nk-text-gray-500 nk-text-xs sm:nk-text-sm nk-inline-flex nk-items-end nk-justify-end nk-tabular-nums nk-leading-none",
          onTextClick ? "nk-cursor-pointer" : "nk-cursor-text",
          altPriceDisplaySize,
        ])}
      >
        <p className="nk-order-2 nk-leading-none">
          {formattedPrice({ price: altPrice })}
        </p>

        {displayCurrencySymbol || altPrice.currency === Currency.Usd ? (
          <div
            className={cc([
              "nk-leading-none",
              {
                "nk-mr-1.5 nk-order-3":
                  symbolPosition === CurrencySymbolPosition.Right,
                "nk-order-1 nk-mr-1":
                  symbolPosition === CurrencySymbolPosition.Left &&
                  altPrice.currency === Currency.Usd,
                /*
                  Different margin for USD symbol since it is a single
                  character while other symbols are wider SVG icons
                */
                "nk-order-1":
                  symbolPosition === CurrencySymbolPosition.Left &&
                  altPrice.currency !== Currency.Usd,
              },
            ])}
          >
            <CurrencySymbol
              describeCurrencyInTooltip={describeCurrencyInTooltip}
              symbolFillColor="currentColor"
              currency={altPrice.currency}
              size={altPriceDisplaySize}
            />
          </div>
        ) : null}

        {displayCurrencyAcronym && (
          <p className="nk-ml-1 nk-order-2">
            {PriceCurrencyFormat[altPrice.currency].Acronym}
          </p>
        )}
      </div>
    );

    if (displayPriceConversionInInlineText) {
      return (
        <div className={altPriceDisplayPosition}>
          {priceDisplayElm}
          {altPriceDisplayElm}
        </div>
      );
    } else {
      // Display the alternative price in a tooltip
      return (
        <div
          className={cc([
            "nk-inline-flex nk-items-center",
            priceTextDisplaySize,
          ])}
        >
          {/* 
            This is done in order to avoid the same element (priceDisplayElm) to
            trigger two different tooltips. Broader information can be found up
            above in the same file, in previous lines of documentation.
          */}
          {displayCurrencySymbol && (
            <div
              className={cc([
                {
                  "nk-mr-0.5 nk-order-1 nk-mb-[2px]":
                    symbolPosition === CurrencySymbolPosition.Left &&
                    price.currency !== Currency.Usd,
                  /*
                    Different margin for USD symbol since it is a single
                    character while other symbols are wider SVG icons
                  */
                  "nk-mr-1.5 nk-order-1":
                    symbolPosition === CurrencySymbolPosition.Left &&
                    price.currency === Currency.Usd,
                  "nk-ml-1.5 nk-order-3":
                    symbolPosition === CurrencySymbolPosition.Right,
                },
              ])}
            >
              <CurrencySymbol
                describeCurrencyInTooltip={describeCurrencyInTooltip}
                currency={price.currency}
                size={priceTextDisplaySize}
              />
            </div>
          )}

          <div className="nk-order-2 nk-leading-none">
            <Tooltip trigger={priceDisplayElm}>
              <>
                {altPrice ? (
                  <div className="focus:nk-outline-none nk-relative nk-h-full nk-rounded-md">
                    <div className="nk-text-xs nk-text-white sm:nk-text-sm nk-inline-flex nk-items-center nk-space-x-0.5 nk-tabular-nums">
                      <p
                        className={
                          onTextClick ? "nk-cursor-pointer" : "nk-cursor-text"
                        }
                      >
                        {formattedPrice({
                          price: altPrice,
                          withPrefix: true,
                          withSufix: true,
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
    }
  }
};
