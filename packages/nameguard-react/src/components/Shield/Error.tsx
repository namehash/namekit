import React, { type ReactNode } from "react";

import { Shield as ShieldIcon } from "../Report/Shield";
import { Tooltip } from "../Tooltip/Tooltip";

type ShieldErrorProps = {
  children?: ReactNode;
  size?: "small" | "medium" | "large" | "micro";
} & React.ComponentProps<typeof ShieldIcon>;

export const ShieldError = ({
  children,
  size = "small",
  ...props
}: ShieldErrorProps) => {
  return (
    <Tooltip trigger={<ShieldIcon status="skip" size={size} {...props} />}>
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <ShieldIcon status="skip" size="small" />
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
          {children}
        </div>
      </div>
    </Tooltip>
  );
};
