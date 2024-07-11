import React from "react";

import { Tooltip } from "@namehash/namekit-react";
import { RatingIconSize } from "../Report/RatingIcon";
import { RatingUnknownIcon } from "../icons/RatingUnknownIcon";

type UnknownShieldProps = {
  size?: RatingIconSize;
} & React.ComponentProps<"svg">;

export const UnknownReportIcon = ({
  size = RatingIconSize.small,

  /*
    Props are applied to the shield icon which is the onHover trigger element
    for the tooltip with Report information. For examples, please visit the
    https://nameguard.io/docs/report and see the ReportIcon docs. Any
    additional props are passed to the shield icon that when hovered,
    displays the tooltip with the report information.
  */
  ...props
}: UnknownShieldProps) => {
  return (
    <Tooltip
      trigger={RatingUnknownIcon({
        size,
        isInteractive: true,
        ...props,
      })}
    >
      <div className="ng-flex ng-items-start ng-space-x-3 ng-py-2.5 ng-min-w-[300px] ng-max-w-[300px]">
        <div className="ng-mt-0.5">
          <RatingUnknownIcon size={RatingIconSize.small} />
        </div>

        <div className="ng-flex-1">
          <div className="ng-flex ng-items-center ng-justify-between">
            <span className="ng-font-semibold ng-mb-1 ng-text-white">
              Unable to analyze
            </span>
          </div>

          <div className="ng-text-sm ng-text-white ng-font-normal">
            Refresh the page to try again.
          </div>
        </div>
      </div>
    </Tooltip>
  );
};
