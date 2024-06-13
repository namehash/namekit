import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "@namehash/nameguard-react";

import EthereumCircleIcon from "./EthereumCircleIcon";
import { UsdcSymbol } from "./UsdcSymbol";
import { WethSymbol } from "./WethSymbol";
import { DaiSymbol } from "./DaiSymbol";
import React from "react";

export enum PriceDisplaySize {
  Micro = "text-xs md:text-sm font-normal",
  Small = "text-sm font-semibold",
  Medium = "text-xl font-semibold",
  Large = "text-xl font-semibold md:text-2xl md:font-bold",
}

export enum PriceSymbolPosition {
  Left = "mr-1.5",
  Right = "ml-1.5",
}

export enum PriceDisplayPosition {
  Right = "flex inline-flex items-end space-x-2",
  Bottom = "flex flex-col text-right items-end space-y-1",
}

export enum PriceSymbology {
  Acronym = "Acronym",
  Symbol = "Symbol",
}

interface PriceSymbolProps {
  currency: Currency;
  size: PriceDisplaySize;
  symbolFillColor?: string;
  showTooltipDescription: boolean;
}

const SymbolSize: Record<PriceDisplaySize, string> = {
  [PriceDisplaySize.Micro]: "w-4",
  [PriceDisplaySize.Small]: "w-4",
  [PriceDisplaySize.Medium]: "w-5",
  [PriceDisplaySize.Large]: "w-5",
};

export const PriceSymbol = ({
  size,
  currency,
  symbolFillColor,
  showTooltipDescription,
}: PriceSymbolProps) => {
  const symbol =
    currency === Currency.Usd ? (
      <p className="-mr-1" style={{ color: symbolFillColor || "inherit" }}>
        $
      </p>
    ) : currency === Currency.Usdc ? (
      <UsdcSymbol
        className={SymbolSize[size]}
        fill={symbolFillColor || "inherit"}
      />
    ) : currency === Currency.Dai ? (
      <DaiSymbol
        className={SymbolSize[size]}
        fill={symbolFillColor || "inherit"}
      />
    ) : currency === Currency.Weth ? (
      <WethSymbol
        className={SymbolSize[size]}
        fill={symbolFillColor || "inherit"}
      />
    ) : currency === Currency.Eth ? (
      <EthereumCircleIcon
        className={SymbolSize[size]}
        fill={symbolFillColor ? symbolFillColor : "#272727"}
      />
    ) : (
      <></>
    );

  if (!showTooltipDescription) return symbol;

  return (
    <Tooltip trigger={symbol}>
      <>{PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular}</>
    </Tooltip>
  );
};
