import { DomainName, Price, Registration } from "@namehash/ens-utils";

import React from "react";
import { DisplayedPrice } from "./DisplayedPrice";
import { RegistrationPriceInfo } from "./RegistrationPriceInfo";
import {
  AltPriceDisplayFormat,
  PriceDisplayPosition,
  PriceDisplaySize,
  PriceSymbolPosition,
  PriceSymbology,
} from "./PriceSymbol";
import { RegistrationPriceInfoDisplayingFormat } from "./RegistrationPriceInfo";

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
  altPriceDisplayFormat: AltPriceDisplayFormat;
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
  showCurrencyTooltipDescription = true,
  symbolPosition = PriceSymbolPosition.Left,
  currencySymbology = PriceSymbology.Symbol,
  altPriceDisplaySize = PriceDisplaySize.Micro,
  priceTextDisplaySize = PriceDisplaySize.Small,
  altPriceDisplayPosition = PriceDisplayPosition.Right,
  altPriceDisplayFormat = AltPriceDisplayFormat.Tooltip,
}: NamePriceProps) => {
  return (
    <div
      role="button"
      className="nk-mr-4 nk-flex nk-items-center md:nk-space-x-2 nk-justify-end nk-outline-none sm:nk-mr-3 nk-px-3 nk-py-2 nk-bg-black nk-bg-opacity-0 nk-rounded-lg nk-transition nk-whitespace-nowrap hover:nk-bg-opacity-5"
    >
      <RegistrationPriceInfo
        displayIconWithTooltip={
          RegistrationPriceInfoDisplayingFormat.IconWithTooltip
        }
        registration={registration}
        parsedName={parsedName}
      />
      <div className="nk-ml-1 nk-flex nk-items-center nk-justify-end">
        <DisplayedPrice
          price={price}
          altPrice={altPrice}
          onTextClick={onTextClick}
          symbolPosition={symbolPosition}
          currencySymbology={currencySymbology}
          altPriceDisplaySize={altPriceDisplaySize}
          priceTextDisplaySize={priceTextDisplaySize}
          altPriceDisplayPosition={altPriceDisplayPosition}
          altPriceDisplayFormat={altPriceDisplayFormat}
          showCurrencyTooltipDescription={showCurrencyTooltipDescription}
        />
      </div>
    </div>
  );
};
