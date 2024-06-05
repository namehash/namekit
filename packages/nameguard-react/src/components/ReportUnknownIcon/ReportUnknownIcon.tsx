import React from "react";

import { Tooltip } from "../Tooltip/Tooltip";
import { RatingIconSize } from "../Report/RatingIcon";
import { RatingUnknownIcon } from "../icons/RatingUnknownIcon";

type ReportUnknownIconProps = {
  onIconClickOverride?: (mouseEvent: React.MouseEvent) => void;
  onTooltipClickOverride?: (mouseEvent: React.MouseEvent) => void;
  size?: RatingIconSize;
} & React.ComponentProps<"svg">;

export const ReportUnknownIcon = ({
  onIconClickOverride,
  onTooltipClickOverride,
  size = RatingIconSize.small,

  /*
    Props are applied to the RatingUnknownIcon trigger which is the onHover trigger element 
    for the tooltip with Report information. For examples, please visit the
    https://nameguard.io/docs/report and see the ReportIcon docs. Any 
    additional props received are passed to the RatingUnknownIcon 
    that when hovered, displays the tooltip with the report information.
  */
  ...props
}: ReportUnknownIconProps) => {
  return (
    <Tooltip
      trigger={RatingUnknownIcon({
        size,
        isInteractive: true,
        onClick: (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          onIconClickOverride(e);
        },
        ...props,
      })}
    >
      <div className="flex items-start space-x-3 py-2.5 max-w-[300px]">
        <div className="mt-0.5">
          <RatingUnknownIcon size={RatingIconSize.small} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold mb-1 text-white">
              Error loading report
            </span>
          </div>

          <div className="text-sm text-white">
            <button
              className="appearance-none underline font-medium"
              onClick={(e?: React.MouseEvent) => {
                if (e) e.stopPropagation();
                onTooltipClickOverride(e);
              }}
            >
              Inspect name for details
            </button>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};
