import {
  Currency,
  type Price,
  formattedPrice,
  PriceCurrencyFormat,
} from "@namehash/ens-utils";

import React, { useEffect } from "react";
import {
  CurrencySymbol,
  CurrencySymbolPosition,
  CurrencySymbology,
  AltPriceDisplayFormat,
} from "./CurrencySymbol";

import cc from "classcat";
import { Tooltip } from "./Tooltip";

export enum PriceDisplaySize {
  Micro = "nk-text-xs md:nk-text-sm nk-font-normal",
  Small = "nk-text-sm nk-font-semibold",
  Medium = "nk-text-xl nk-font-semibold",
  Large = "nk-text-2xl nk-font-bold",
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
  // The size of the price display
  priceTextDisplaySize?: PriceDisplaySize;
  // The size of the alternative price to display, which must be smaller than the price display size
  altPriceDisplaySize?: PriceDisplaySize;
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

      {(currencySymbology === CurrencySymbology.Symbol &&
        altPriceDisplayFormat === AltPriceDisplayFormat.Tooltip &&
        !altPrice) ||
      (currencySymbology === CurrencySymbology.Symbol &&
        altPriceDisplayFormat === AltPriceDisplayFormat.Text) ? (
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

      {currencySymbology === CurrencySymbology.Acronym && (
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
          "nk-text-gray-500 nk-inline-flex nk-items-end nk-justify-end nk-tabular-nums nk-leading-none",
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

        {currencySymbology === CurrencySymbology.Symbol ||
        altPrice.currency === Currency.Usd ? (
          <div
            className={cc([
              "nk-leading-none",
              {
                "nk-order-1 nk-mr-1":
                  symbolPosition === CurrencySymbolPosition.Left &&
                  altPrice.currency === Currency.Usd,
                "nk-order-1":
                  symbolPosition === CurrencySymbolPosition.Left &&
                  altPrice.currency !== Currency.Usd,
                "nk-mr-1.5 nk-order-3":
                  symbolPosition === CurrencySymbolPosition.Right,
              },
            ])}
          >
            <CurrencySymbol
              symbolFillColor={"currentColor"}
              describeCurrencyInTooltip={describeCurrencyInTooltip}
              currency={altPrice.currency}
              size={altPriceDisplaySize}
            />
          </div>
        ) : null}

        {currencySymbology === CurrencySymbology.Acronym && (
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
          {currencySymbology === CurrencySymbology.Symbol && (
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
                describeCurrencyInTooltip={describeCurrencyInTooltip}
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
