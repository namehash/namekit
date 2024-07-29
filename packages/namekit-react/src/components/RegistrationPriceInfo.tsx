import React from "react";
import { Tooltip } from "./Tooltip";
import { getPriceDescription, DomainCard } from "@namehash/ens-utils";
import { InfoIcon } from "./icons/InfoIcon";

interface RegistrationPriceInfoProps {
  domain: DomainCard;
  // Wether to display the icon with a tooltip or the icon with a text
  displayIconWithTooltip?: RegistrationPriceInfoDisplayingFormat;
}

export enum RegistrationPriceInfoDisplayingFormat {
  IconWithTooltip,
  IconWithText,
}

export const RegistrationPriceInfo = ({
  displayIconWithTooltip = RegistrationPriceInfoDisplayingFormat.IconWithTooltip,
  domain,
}: RegistrationPriceInfoProps) => {
  const priceDescription = getPriceDescription(domain);

  if (!priceDescription) return <></>;

  const priceDescriptionElm = (
    <div className="nk-font-normal nk-inline">
      <p className="nk-inline">{priceDescription.descriptiveTextBeginning}</p>
      <p className="nk-inline">{priceDescription.pricePerYearDescription}</p>
      <p className="nk-inline">{priceDescription.descriptiveTextEnd}</p>
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
          <div className="nk-inline nk-mr-2">{priceDescriptionElm}</div>
        </p>
      </div>
    );
};
