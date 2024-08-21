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

export enum PriceDisplaySize {
  Micro = "nk-text-[12px] md:nk-text-[14px] nk-font-normal",
  Small = "nk-text-[14px] nk-font-semibold",
  Medium = "nk-text-[20px] nk-font-semibold",
  Large = "nk-text-[24px] nk-font-bold",
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
