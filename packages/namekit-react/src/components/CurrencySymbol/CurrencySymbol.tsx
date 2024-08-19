import { PriceCurrencyFormat, Currency } from "@namehash/ens-utils";
import { Tooltip } from "../Tooltip";

import { UsdcSymbol } from "./UsdcSymbol";
import { WethSymbol } from "./WethSymbol";
import { EthSymbol } from "./EthSymbol";
import { DaiSymbol } from "./DaiSymbol";
import React from "react";

export enum CurrencySymbolSize {
  Small = "nk-w-4",
  Large = "nk-w-5",
}

interface CurrencySymbolProps {
  /**
   * The `Currency` to display the symbol for.
   */
  currency: Currency;

  /**
   * The size of the `CurrencySymbol`.
   * 
   * Defaults to `CurrencySymbolSize.Small`.
   */
  size: CurrencySymbolSize;

  /**
   * If `true`, hovering over the `CurrencySymbol` will display the
   * name of `currency` in a `Tooltip`. If `false` then the `CurrencySymbol`
   * won't have any `Tooltip`.
   * 
   * Defaults to `true`.
   */
  describeCurrencyInTooltip: boolean;
  
  /**
   * Optional. Defines a custom color for the `CurrencySymbol` that overrides
   * the default symbol color for `currency`.
   * 
   * If defined, must be formatted as a hex color code.
   * 
   * If undefined, defaults to the default symbol color for `currency`.
   */
  symbolFillColor?: string;
}

export const CurrencySymbol = ({
  currency,
  size = CurrencySymbolSize.Small,
  describeCurrencyInTooltip = true,
  symbolFillColor = undefined,
}: CurrencySymbolProps) => {
  let symbol: JSX.Element;

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
    default:
      // TODO: We haven't created symbols for `Currency.Gas` yet.
      throw new Error(`Error creating CurrencySymbol: unsupported Currency: "${currency}".`);
  }

  if (!describeCurrencyInTooltip) return symbol;

  return (
    <Tooltip trigger={symbol}>
      <>{PriceCurrencyFormat[currency].ExtendedCurrencyNameSingular}</>
    </Tooltip>
  );
};
