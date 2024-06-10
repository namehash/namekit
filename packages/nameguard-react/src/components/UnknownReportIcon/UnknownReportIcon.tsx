import React, { type ReactNode } from "react";

import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { Tooltip } from "../Tooltip/Tooltip";
import { RatingUnknownIcon } from "../icons/RatingUnknownIcon";

type UnknownShieldProps = {
  size?: RatingIconSize;
  children?: ReactNode;
} & React.ComponentProps<typeof RatingIcon> &
  React.FC;

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
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <RatingUnknownIcon size={RatingIconSize.small} />
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
