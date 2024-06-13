import React, { SVGProps } from "react";
import { Tooltip } from "@namehash/nameguard-react";
import {
  getPriceDescription,
  Registration,
  DomainName,
} from "@namehash/ens-utils";

interface PriceInfoProps {
  parsedName: DomainName;
  registration: Registration;
  // Wether to display the icon with a tooltip or the icon + the price info text directly
  displayIconWithTooltip?: boolean;
}

export const PriceInfo = ({
  displayIconWithTooltip = true,
  registration,
  parsedName,
}: PriceInfoProps) => {
  const priceDescription = getPriceDescription(registration, parsedName);

  if (!priceDescription) return <></>;

  const priceDescriptionElm = (
    <div className="font-normal inline">
      <p className="inline">{priceDescription.descriptiveTextBeginning}</p>
      <p className="font-medium inline">
        {priceDescription.pricePerYearDescription}
      </p>
      <p className="inline">{priceDescription.descriptiveTextEnd}</p>
    </div>
  );

  /*
    If only an icon must be shown in the UI, we return the icon and when the user hovers over it, the info tooltip will be shown.
    Otherwise, we return the icon and the text in the UI directly.
  */
  if (displayIconWithTooltip)
    return (
      <Tooltip
        trigger={
          <InfoFilledIcon className="h-5 w-5 text-gray-300 transition hover:text-gray-400 cursor-pointer" />
        }
      >
        <p className="text-white">{priceDescriptionElm}</p>
      </Tooltip>
    );
  else
    return (
      <div className="flex items-center flex-row mb-4">
        <div className="h-5 w-5">
          <InfoFilledIcon className="h-5 w-5 text-gray-300" />
        </div>
        <p className="text-sm text-gray-500 ml-3">
          <div className="inline mr-2">{priceDescriptionElm}</div>
        </p>
      </div>
    );
};

export function InfoFilledIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM11 6C11 6.55228 10.5523 7 10 7C9.44772 7 9 6.55228 9 6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6ZM9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11V14C9 14.5523 9.44772 15 10 15H11C11.5523 15 12 14.5523 12 14C12 13.4477 11.5523 13 11 13V10C11 9.44772 10.5523 9 10 9H9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default InfoFilledIcon;
