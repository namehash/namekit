import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "../Tooltip";

import { UsdcSymbol } from "./UsdcSymbol";
import { WethSymbol } from "./WethSymbol";
import { EthSymbol } from "./EthSymbol";
import { DaiSymbol } from "./DaiSymbol";
import React from "react";

interface CurrencySymbolProps {
  currency: Currency;
  size: CurrencySymbolSize;
  /*
   * symbolFillColor: specifies, as a hex code, the symbol color to be set
   */
  symbolFillColor?: string;
  /*
   * describeCurrencyInTooltip: wether to display the currency name in a tooltip or not
   */
  describeCurrencyInTooltip: boolean;
}

export enum CurrencySymbolSize {
  Small = "nk-w-4",
  Large = "nk-w-5",
}

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
      symbol = <UsdcSymbol className={size} fill={symbolFillColor} />;
      break;
    case Currency.Dai:
      symbol = <DaiSymbol className={size} fill={symbolFillColor} />;
      break;
    case Currency.Weth:
      symbol = <WethSymbol className={size} fill={symbolFillColor} />;
      break;
    case Currency.Eth:
      symbol = <EthSymbol className={size} fill={symbolFillColor} />;
      break;
  }

  if (!describeCurrencyInTooltip) return symbol;

  return (
    <Tooltip trigger={symbol}>
      <>{PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular}</>
    </Tooltip>
  );
};
