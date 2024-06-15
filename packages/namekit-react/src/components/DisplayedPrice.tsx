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
  AltPriceDisplayFormat,
} from "./PriceSymbol";

import cc from "classcat";
import { Tooltip } from "./Tooltip";

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
  showCurrencyTooltipDescription = true,
  symbolPosition = PriceSymbolPosition.Left,
  currencySymbology = PriceSymbology.Symbol,
  altPriceDisplaySize = PriceDisplaySize.Micro,
  priceTextDisplaySize = PriceDisplaySize.Small,
  altPriceDisplayPosition = PriceDisplayPosition.Right,
  altPriceDisplayFormat = AltPriceDisplayFormat.Tooltip,
}: DisplayedPriceProps) => {
  const triggerElm = (
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

      {(currencySymbology === PriceSymbology.Symbol &&
        altPriceDisplayFormat === AltPriceDisplayFormat.Tooltip &&
        !altPrice) ||
      (currencySymbology === PriceSymbology.Symbol &&
        altPriceDisplayFormat === AltPriceDisplayFormat.Text) ? (
        <div
          className={cc([
            "nk-leading-none",
            {
              "nk-mb-[1px]": price.currency !== Currency.Usd,
              "nk-order-1 nk-mr-1": symbolPosition === PriceSymbolPosition.Left,
              "nk-mr-1.5 nk-order-3":
                symbolPosition === PriceSymbolPosition.Right,
            },
          ])}
        >
          <PriceSymbol
            describeCurrencyInTooltip={showCurrencyTooltipDescription}
            currency={price.currency}
            size={priceTextDisplaySize}
          />
        </div>
      ) : null}

      {currencySymbology === PriceSymbology.Acronym && (
        <p className="nk-ml-1 nk-order-2">
          {PriceCurrencyFormat[price.currency].Acronym}
        </p>
      )}
    </div>
  );

  if (!altPrice && altPriceDisplayFormat === AltPriceDisplayFormat.Tooltip)
    return triggerElm;
  else if (altPrice) {
    const altPriceDisplayElm = (
      <div
        className={cc([
          "nk-text-gray-500 nk-text-xs sm:nk-text-sm nk-inline-flex nk-items-end nk-justify-end nk-tabular-nums nk-leading-none nk-mb-0.5",
          altPriceDisplaySize,
          {
            "nk-cursor-text": !onTextClick,
            "nk-cursor-pointer": !!onTextClick,
          },
        ])}
      >
        <p className="nk-order-2 nk-leading-none">
          {formattedPrice({ price: altPrice })}
        </p>

        {currencySymbology === PriceSymbology.Symbol ||
        altPrice.currency === Currency.Usd ? (
          <div
            className={cc([
              "nk-leading-none",
              {
                "nk-order-1 nk-mr-1":
                  symbolPosition === PriceSymbolPosition.Left &&
                  altPrice.currency === Currency.Usd,
                "nk-order-1":
                  symbolPosition === PriceSymbolPosition.Left &&
                  altPrice.currency !== Currency.Usd,
                "nk-mr-1.5 nk-order-3":
                  symbolPosition === PriceSymbolPosition.Right,
              },
            ])}
          >
            <PriceSymbol
              symbolFillColor={"currentColor"}
              describeCurrencyInTooltip={showCurrencyTooltipDescription}
              currency={altPrice.currency}
              size={altPriceDisplaySize}
            />
          </div>
        ) : null}

        {currencySymbology === PriceSymbology.Acronym && (
          <p className="nk-ml-1 nk-order-2">
            {PriceCurrencyFormat[altPrice.currency].Acronym}
          </p>
        )}
      </div>
    );

    if (altPriceDisplayFormat === AltPriceDisplayFormat.Text) {
      return (
        <div className={altPriceDisplayPosition}>
          {triggerElm}
          {altPriceDisplayElm}
        </div>
      );
    } else if (altPrice) {
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
                    symbolPosition === PriceSymbolPosition.Left &&
                    price.currency !== Currency.Usd,
                  "nk-mr-1.5 nk-order-1":
                    symbolPosition === PriceSymbolPosition.Left &&
                    price.currency === Currency.Usd,
                  "nk-ml-1.5 nk-order-3":
                    symbolPosition === PriceSymbolPosition.Right,
                },
              ])}
            >
              <PriceSymbol
                describeCurrencyInTooltip={showCurrencyTooltipDescription}
                currency={price.currency}
                size={priceTextDisplaySize}
              />
            </div>
          )}

          <div className="nk-order-2 nk-leading-none">
            <Tooltip trigger={triggerElm}>
              <>
                {altPrice ? (
                  <div className="nk-bg-gray-900 focus:nk-outline-none nk-relative nk-h-full nk-rounded-md">
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
    } else return <></>;
  } else return <></>;
};
