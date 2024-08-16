import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "../Tooltip";

import { UsdcSymbol } from "./UsdcSymbol";
import { WethSymbol } from "./WethSymbol";
import { EthSymbol } from "./EthSymbol";
import { DaiSymbol } from "./DaiSymbol";
import React from "react";

export enum AltPriceDisplayFormat {
  Tooltip,
  Text,
}

export enum PriceDisplaySize {
  Micro = "nk-text-xs md:nk-text-sm nk-font-normal",
  Small = "nk-text-sm nk-font-semibold",
  Medium = "nk-text-xl nk-font-semibold",
  Large = "nk-text-2xl nk-font-bold",
}

export enum CurrencySymbolPosition {
  Left = "nk-mr-1.5",
  Right = "nk-ml-1.5",
}

export enum CurrencySymbology {
  Acronym = "Acronym",
  Symbol = "Symbol",
}

interface CurrencySymbolProps {
  currency: Currency;
  size: PriceDisplaySize;
  // Specifies, as a hex code, the symbol color to be set
  symbolFillColor?: string;
  describeCurrencyInTooltip: boolean;
}

export enum CurrencySymbolSize {
  Small = "nk-w-4",
  Large = "nk-w-5",
}

const SymbolSize: Record<PriceDisplaySize, string> = {
  [PriceDisplaySize.Micro]: CurrencySymbolSize.Small,
  [PriceDisplaySize.Small]: CurrencySymbolSize.Small,
  [PriceDisplaySize.Medium]: CurrencySymbolSize.Large,
  [PriceDisplaySize.Large]: CurrencySymbolSize.Large,
};

export const CurrencySymbol = ({
  size,
  currency,
  describeCurrencyInTooltip,
  symbolFillColor = undefined,
}: CurrencySymbolProps) => {
  let symbol: JSX.Element | null = null;

  switch (currency) {
    case Currency.Usd:
      symbol = (
        <p className="nk--mr-1" style={{ color: symbolFillColor }}>
          $
        </p>
      );
      break;
    case Currency.Usdc:
      symbol = (
        <UsdcSymbol className={SymbolSize[size]} fill={symbolFillColor} />
      );
      break;
    case Currency.Dai:
      symbol = (
        <DaiSymbol className={SymbolSize[size]} fill={symbolFillColor} />
      );
      break;
    case Currency.Weth:
      symbol = (
        <WethSymbol className={SymbolSize[size]} fill={symbolFillColor} />
      );
      break;
    case Currency.Eth:
      symbol = (
        <EthSymbol className={SymbolSize[size]} fill={symbolFillColor} />
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
