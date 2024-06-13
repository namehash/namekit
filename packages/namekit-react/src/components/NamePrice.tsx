import { DomainName, Price, Registration } from "@namehash/ens-utils";

import React from "react";
import { DisplayedPrice } from "./DisplayedPrice";
import { PriceInfo } from "./PriceInfo";
import {
  PriceDisplayPosition,
  PriceDisplaySize,
  PriceSymbolPosition,
  PriceSymbology,
} from "./PriceSymbol";

interface NamePriceProps {
  registration: Registration;
  parsedName: DomainName;
  // The price to be displayed
  price: Price;
  // The alternative price to be displayed (the price converted to another currency)
  altPrice?: Price;
  // The onClick event handler for the price text
  onTextClick?: () => void;
  // Wether to display the alternative price as a text instead of a tooltip
  altPriceDisplayedAsText: boolean;
  // Wether to display a currency symbology as its acronym or symbol
  currencySymbology?: PriceSymbology;
  // The place to display the currency symbology
  symbolPosition?: PriceSymbolPosition;
  // The size of the alternative price display
  altPriceDisplaySize?: PriceDisplaySize;
  // The size of the price display
  priceTextDisplaySize?: PriceDisplaySize;
  // The place to display the alternative price when displayed as text
  altPriceDisplayPosition?: PriceDisplayPosition;
  // Wether or not to display the name of the currency in a tooltip when its symbol is hovered
  showCurrencyTooltipDescription?: boolean;
}

export const NamePrice = ({
  price,
  altPrice,
  parsedName,
  onTextClick,
  registration,
  altPriceDisplayedAsText,
  showCurrencyTooltipDescription = true,
  symbolPosition = PriceSymbolPosition.Left,
  currencySymbology = PriceSymbology.Symbol,
  altPriceDisplaySize = PriceDisplaySize.Micro,
  priceTextDisplaySize = PriceDisplaySize.Small,
  altPriceDisplayPosition = PriceDisplayPosition.Right,
}: NamePriceProps) => {
  return (
    <div
      role="button"
      className="mr-4 flex items-center md:space-x-2 justify-end outline-none sm:mr-3 px-3 py-2 bg-black bg-opacity-0 rounded-lg transition whitespace-nowrap hover:bg-opacity-5"
    >
      <PriceInfo registration={registration} parsedName={parsedName} />
      <div className="ml-1 flex items-center justify-end">
        <DisplayedPrice
          price={price}
          altPrice={altPrice}
          onTextClick={onTextClick}
          symbolPosition={symbolPosition}
          currencySymbology={currencySymbology}
          altPriceDisplaySize={altPriceDisplaySize}
          priceTextDisplaySize={priceTextDisplaySize}
          altPriceDisplayPosition={altPriceDisplayPosition}
          altPriceDisplayedAsText={altPriceDisplayedAsText}
          showCurrencyTooltipDescription={showCurrencyTooltipDescription}
        />
      </div>
    </div>
  );
};
