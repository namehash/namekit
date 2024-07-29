import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "./Tooltip";

import { EthSymbol } from "./icons/EthSymbol";
import { UsdcSymbol } from "./icons/UsdcSymbol";
import { WethSymbol } from "./icons/WethSymbol";
import { DaiSymbol } from "./icons/DaiSymbol";
import React from "react";
import { PriceDisplaySize } from "./DisplayedPrice";

export enum AltPriceDisplayFormat {
  Tooltip,
  Text,
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
