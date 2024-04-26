import React, { type ReactNode } from "react";

import { Shield as ShieldIcon, ShieldSize } from "../Report/Shield";
import { Tooltip } from "../Tooltip/Tooltip";
import { ErrorShield } from "../icons/ErrorShield";

type ShieldErrorProps = {
  children?: ReactNode;
  size?: ShieldSize;
} & React.ComponentProps<typeof ShieldIcon>;

export const ShieldError = ({
  children,
  size = ShieldSize.small,
  ...props
}: ShieldErrorProps) => {
  return (
    <Tooltip trigger={<ErrorShield size={size} {...props} />}>
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <ErrorShield size={ShieldSize.small} />
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
