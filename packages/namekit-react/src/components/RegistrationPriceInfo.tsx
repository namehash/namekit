import React from "react";
import { Tooltip } from "./Tooltip";
import {
  getPriceDescription,
  Registration,
  DomainName,
  formatTimestampAsDistanceToNow,
  formatTimestamp,
} from "@namehash/ens-utils";
import { InfoIcon } from "./icons/InfoIcon";

interface RegistrationPriceInfoProps {
  parsedName: DomainName;
  registration: Registration;
  // Wether to display the icon with a tooltip or the icon with a text
  displayIconWithTooltip?: RegistrationPriceInfoDisplayingFormat;
}

export enum RegistrationPriceInfoDisplayingFormat {
  IconWithTooltip,
  IconWithText,
}

export const RegistrationPriceInfo = ({
  displayIconWithTooltip = RegistrationPriceInfoDisplayingFormat.IconWithTooltip,
  registration,
  parsedName,
}: RegistrationPriceInfoProps) => {
  const priceDescription = getPriceDescription(registration, parsedName);

  if (!priceDescription || !registration.expiryTimestamp) return <></>;

  const priceDescriptionElm = (
    <div className="nk-font-normal nk-flex nk-flex-wrap nk-items-center">
      <Tooltip
        trigger={
          <p className="nk-mr-1">{priceDescription.descriptiveTextBeginning}</p>
        }
      >
        <p>{formatTimestamp(registration.expiryTimestamp)}</p>
      </Tooltip>
      <p>{priceDescription.pricePerYearDescription}</p>
      <p>{priceDescription.descriptiveTextEnd}</p>
    </div>
  );

  /*
    If only an icon must be shown in the UI, we return the icon and when the user hovers over it, the info tooltip will be shown.
    Otherwise, we return the icon and the text in the UI directly.
  */
  if (
    displayIconWithTooltip ===
    RegistrationPriceInfoDisplayingFormat.IconWithTooltip
  )
    return (
      <Tooltip
        trigger={
          <InfoIcon className="nk-h-5 nk-w-5 nk-text-gray-300 nk-transition hover:nk-text-gray-400 nk-cursor-pointer" />
        }
      >
        <p className="nk-text-white">{priceDescriptionElm}</p>
      </Tooltip>
    );
  else
    return (
      <div className="nk-flex nk-items-center nk-flex-row nk-mb-4">
        <div className="nk-h-5 nk-w-5">
          <InfoIcon className="nk-h-5 nk-w-5 nk-text-gray-300" />
        </div>
        <p className="nk-text-sm nk-text-gray-500 nk-ml-3">
          {priceDescriptionElm}
        </p>
      </div>
    );
};
