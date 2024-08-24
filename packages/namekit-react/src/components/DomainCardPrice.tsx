import { DisplayedPrice, DisplayedPriceProps } from "./DisplayedPrice";
import {
  CurrencySymbology,
  getCurrencySymbology,
  Price,
} from "@namehash/ens-utils";
import { Tooltip } from "./Tooltip";
import React from "react";

interface DomainCardPriceProps extends DisplayedPriceProps {
  altPrice: Price;
  altPriceSymbology: CurrencySymbology;
}

export const DomainCardPrice = ({
  altPriceSymbology = CurrencySymbology.Symbol,
  altPrice,
  ...props
}: DomainCardPriceProps) => {
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
        price={altPrice}
        symbol={
          <span>
            {getCurrencySymbology(altPrice.currency, altPriceSymbology)}
          </span>
        }
      />
    </Tooltip>
  );
};
