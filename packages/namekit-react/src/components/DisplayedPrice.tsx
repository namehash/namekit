import {
  Currency,
  type Price,
  formattedPrice,
  PriceCurrencyFormat,
} from "@namehash/ens-utils";

import React from "react";
import {
  PriceSymbol,
  PriceSymbolPosition,
  PriceDisplayPosition,
  PriceDisplaySize,
  PriceSymbology,
} from "./PriceSymbol";

import cc from "classcat";
import { Tooltip } from "@namehash/nameguard-react";

interface PriceProps {
  // The price to be displayed
  price: Price;
  // The alternative price to be displayed (the price converted to another currency)
  altPrice?: Price;
  // The onClick event handler for the price text
  onTextClick?: () => void;
  // Wether to display the alternative price as a text instead of a tooltip
  altPriceDisplayedAsText: boolean;
  // Wether to display a currency symbology as its acronym or symbol
  currencySymbology?: PriceSymbology;
  // The place to display the currency symbology
  symbolPosition?: PriceSymbolPosition;
  // The size of the alternative price display
  altPriceDisplaySize?: PriceDisplaySize;
  // The size of the price display
  priceTextDisplaySize?: PriceDisplaySize;
  // The place to display the alternative price when displayed as text
  altPriceDisplayPosition?: PriceDisplayPosition;
  // Wether or not to display the name of the currency in a tooltip when its symbol is hovered
  showCurrencyTooltipDescription?: boolean;
}

export const DisplayedPrice = ({
  price,
  altPrice,
  onTextClick,
  altPriceDisplayedAsText,
  showCurrencyTooltipDescription = true,
  symbolPosition = PriceSymbolPosition.Left,
  currencySymbology = PriceSymbology.Symbol,
  altPriceDisplaySize = PriceDisplaySize.Micro,
  priceTextDisplaySize = PriceDisplaySize.Small,
  altPriceDisplayPosition = PriceDisplayPosition.Right,
}: PriceProps) => {
  const triggerElm = (
    <div
      role={onTextClick ? "button" : undefined}
      onClick={onTextClick ? onTextClick : undefined}
      className={cc([
        "min-w-max inline-flex items-center justify-end tabular-nums leading-none",
        priceTextDisplaySize,
        {
          "cursor-text": !onTextClick,
          "cursor-pointer": onTextClick,
        },
      ])}
    >
      <p className="order-2 leading-none">{formattedPrice({ price })}</p>

      {(currencySymbology === PriceSymbology.Symbol &&
        !altPriceDisplayedAsText &&
        !altPrice) ||
      (currencySymbology === PriceSymbology.Symbol &&
        altPriceDisplayedAsText) ? (
        <div
          className={cc([
            "leading-none",
            {
              "mb-[1px]": price.currency !== Currency.Usd,
              "order-1 mr-1": symbolPosition === PriceSymbolPosition.Left,
              "mr-1.5 order-3": symbolPosition === PriceSymbolPosition.Right,
            },
          ])}
        >
          <PriceSymbol
            showTooltipDescription={showCurrencyTooltipDescription}
            currency={price.currency}
            size={priceTextDisplaySize}
          />
        </div>
      ) : null}

      {currencySymbology === PriceSymbology.Acronym && (
        <p className="ml-1 order-2">
          {PriceCurrencyFormat[price.currency].Acronym}
        </p>
      )}
    </div>
  );

  if (!altPrice && !altPriceDisplayedAsText) return triggerElm;
  else if (altPrice) {
    const altPriceDisplayElm = (
      <div
        className={cc([
          "text-gray-500 text-xs sm:text-sm inline-flex items-end justify-end tabular-nums leading-none mb-0.5",
          altPriceDisplaySize,
          {
            "cursor-text": !onTextClick,
            "cursor-pointer": !!onTextClick,
          },
        ])}
      >
        <p className="order-2 leading-none">
          {formattedPrice({ price: altPrice })}
        </p>

        {currencySymbology === PriceSymbology.Symbol ||
        altPrice.currency === Currency.Usd ? (
          <div
            className={cc([
              "leading-none",
              {
                "order-1 mr-1":
                  symbolPosition === PriceSymbolPosition.Left &&
                  altPrice.currency === Currency.Usd,
                "order-1":
                  symbolPosition === PriceSymbolPosition.Left &&
                  altPrice.currency !== Currency.Usd,
                "mr-1.5 order-3": symbolPosition === PriceSymbolPosition.Right,
              },
            ])}
          >
            <PriceSymbol
              symbolFillColor={"currentColor"}
              showTooltipDescription={showCurrencyTooltipDescription}
              currency={altPrice.currency}
              size={altPriceDisplaySize}
            />
          </div>
        ) : null}

        {currencySymbology === PriceSymbology.Acronym && (
          <p className="ml-1 order-2">
            {PriceCurrencyFormat[altPrice.currency].Acronym}
          </p>
        )}
      </div>
    );

    if (altPriceDisplayedAsText) {
      return (
        <div className={altPriceDisplayPosition}>
          {triggerElm}
          {altPriceDisplayElm}
        </div>
      );
    } else if (altPrice) {
      return (
        <div className={cc(["inline-flex items-center", priceTextDisplaySize])}>
          {currencySymbology === PriceSymbology.Symbol && (
            <div
              className={cc([
                {
                  "mr-0.5 order-1 mb-[2px]":
                    symbolPosition === PriceSymbolPosition.Left &&
                    price.currency !== Currency.Usd,
                  "mr-1.5 order-1":
                    symbolPosition === PriceSymbolPosition.Left &&
                    price.currency === Currency.Usd,
                  "ml-1.5 order-3":
                    symbolPosition === PriceSymbolPosition.Right,
                },
              ])}
            >
              <PriceSymbol
                showTooltipDescription={showCurrencyTooltipDescription}
                currency={price.currency}
                size={priceTextDisplaySize}
              />
            </div>
          )}

          <div className="order-2 leading-none">
            <Tooltip trigger={triggerElm}>
              <>
                {altPrice ? (
                  <div className="bg-gray-900 focus:outline-none relative h-full rounded-md">
                    <div className="text-xs text-white sm:text-sm inline-flex items-center space-x-0.5 tabular-nums">
                      <p
                        className={
                          onTextClick ? "cursor-pointer" : "cursor-text"
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
    } else return <></>;
  } else return <></>;
};
