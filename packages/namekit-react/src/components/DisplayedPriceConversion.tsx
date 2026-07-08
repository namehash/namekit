import { DisplayedPrice, DisplayedPriceProps } from "./DisplayedPrice";
import { Price } from "@namehash/ens-utils";
import { Tooltip } from "./Tooltip";
import React from "react";
import { CurrencySymbol, CurrencySymbology } from "./CurrencySymbol";

interface DisplayedPriceConversionProps extends DisplayedPriceProps {
  convertedPrice: Price;
  convertedPriceSymbology: CurrencySymbology;
}

export const DisplayedPriceConversion = ({
  convertedPriceSymbology = CurrencySymbology.TextSymbol,
  convertedPrice,
  ...props
}: DisplayedPriceConversionProps) => {
  return (
    <Tooltip
      trigger={
        <DisplayedPrice
          price={props.price}
          symbol={props.symbol}
          displaySize={props.displaySize}
          symbolPosition={props.symbolPosition}
        />
      }
    >
      <DisplayedPrice
        price={convertedPrice}
        symbolPosition={props.symbolPosition}
        symbol={
          <CurrencySymbol
            currency={convertedPrice.currency}
            symbology={convertedPriceSymbology}
          />
        }
      />
    </Tooltip>
  );
};
