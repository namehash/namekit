import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "./Tooltip";

import { EthereumCircleIcon } from "./icons/EthereumCircleIcon";
import { UsdcSymbol } from "./icons/UsdcSymbol";
import { WethSymbol } from "./icons/WethSymbol";
import { DaiSymbol } from "./icons/DaiSymbol";
import React from "react";

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

export enum PriceSymbolPosition {
  Left = "nk-mr-1.5",
  Right = "nk-ml-1.5",
}

export enum PriceDisplayPosition {
  Right = "nk-flex nk-inline-flex nk-items-end nk-space-x-2",
  Bottom = "nk-flex nk-flex-col nk-text-right nk-items-end nk-space-y-1",
}

export enum PriceSymbology {
  Acronym = "Acronym",
  Symbol = "Symbol",
}

interface PriceSymbolProps {
  currency: Currency;
  size: PriceDisplaySize;
  // Specifies, as a hex code, the symbol color to be set
  symbolFillColor?: string;
  describeCurrencyInTooltip: boolean;
}

const SymbolSize: Record<PriceDisplaySize, string> = {
  [PriceDisplaySize.Micro]: "nk-w-4",
  [PriceDisplaySize.Small]: "nk-w-4",
  [PriceDisplaySize.Medium]: "nk-w-5",
  [PriceDisplaySize.Large]: "nk-w-5",
};

const DEFAULT_ETHEREUM_ICON_COLOR = "#272727";

export const PriceSymbol = ({
  size,
  currency,
  symbolFillColor,
  describeCurrencyInTooltip,
}: PriceSymbolProps) => {
  let symbol: JSX.Element | null = null;

  switch (currency) {
    case Currency.Usd:
      symbol = (
        <p className="nk--mr-1" style={{ color: symbolFillColor || "inherit" }}>
          $
        </p>
      );
      break;
    case Currency.Usdc:
      symbol = (
        <UsdcSymbol
          className={SymbolSize[size]}
          fill={symbolFillColor || "inherit"}
        />
      );
      break;
    case Currency.Dai:
      symbol = (
        <DaiSymbol
          className={SymbolSize[size]}
          fill={symbolFillColor || "inherit"}
        />
      );
      break;
    case Currency.Weth:
      symbol = (
        <WethSymbol
          className={SymbolSize[size]}
          fill={symbolFillColor || "inherit"}
        />
      );
      break;
    case Currency.Eth:
      symbol = (
        <EthereumCircleIcon
          className={SymbolSize[size]}
          fill={symbolFillColor ? symbolFillColor : DEFAULT_ETHEREUM_ICON_COLOR}
        />
      );
      break;
  }

  if (!describeCurrencyInTooltip) return symbol;

  return (
    <Tooltip trigger={symbol}>
      <>{PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular}</>
    </Tooltip>
  );
};
