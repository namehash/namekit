import React, { type ReactNode } from "react";

import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { Tooltip } from "../Tooltip/Tooltip";
import { RatingUnknownIcon } from "../icons/RatingUnknownIcon";

type UnknownShieldProps = {
  size?: RatingIconSize;

  /*
    Props are applied to the shield icon component, 
    which is a trigger for the tooltip with Report information.
  */
  props: React.SVGProps<SVGSVGElement>;
} & React.ComponentProps<typeof RatingIcon>;

export const UnknownReportIcon = ({
  size = RatingIconSize.small,
  props,
}: UnknownShieldProps) => {
  return (
    <Tooltip
      trigger={RatingUnknownIcon({
        size,
        className: "cursor-pointer",
      })}
    >
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <RatingUnknownIcon
            isNotInteractive={true}
            size={RatingIconSize.small}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold mb-1 text-white">
              Unable to analyze
            </span>
          </div>

          <div className="text-sm text-white font-normal">
            Refresh the page to try again.
          </div>
        </div>
      </div>
    </Tooltip>
  );
};
