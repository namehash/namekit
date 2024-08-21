import {
  Currency,
  type Price,
  formattedPrice,
  PriceCurrencyFormat,
  PriceSymbology,
} from "@namehash/ens-utils";

import React, { useEffect } from "react";
import {
  CurrencySymbol,
  CurrencySymbolSize,
} from "./CurrencySymbol/CurrencySymbol";

import cc from "classcat";
import { Tooltip } from "./Tooltip";

export enum PriceDisplaySize {
  Micro = "nk-text-xs md:nk-text-sm nk-font-normal",
  Small = "nk-text-sm nk-font-semibold",
  Medium = "nk-text-xl nk-font-semibold",
  Large = "nk-text-2xl nk-font-bold",
}

export enum AltPriceDisplayFormat {
  Tooltip,
  Text,
}

export enum CurrencySymbolPosition {
  Left = "nk-mr-1.5",
  Right = "nk-ml-1.5",
}

export enum PriceDisplayPosition {
  Right = "nk-flex nk-inline-flex nk-items-end nk-space-x-2",
  Bottom = "nk-flex nk-flex-col nk-text-right nk-items-end nk-space-y-1",
}

const parsePriceDisplaySizeToCurrencyDisplaySize = (
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
    parsePriceDisplaySizeToCurrencyDisplaySize(displaySize);

  return (
    <div
      role={onTextClick ? "button" : undefined}
      onClick={onTextClick ? onTextClick : undefined}
      className={cc([
        "nk-min-w-max nk-inline-flex nk-items-center nk-justify-end nk-tabular-nums nk-leading-none",
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
            "nk-mb-[1px]": price.currency !== Currency.Usd,
            "nk-mr-1": price.currency === Currency.Usd,
            "nk-order-1 nk-mr-0.5":
              symbolPosition === CurrencySymbolPosition.Left,
            "nk-mr-1.5 nk-order-3":
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
        <p className="nk-ml-1 nk-order-2">
          {PriceCurrencyFormat[price.currency].Acronym}
        </p>
      )}
    </div>
  );
};

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
        parsePriceDisplaySizeToCurrencyDisplaySize(altPriceDisplaySize);
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
                    <div className="nk-text-xs nk-text-white sm:nk-text-sm nk-inline-flex nk-items-center nk-space-x-0.5 nk-tabular-nums">
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
