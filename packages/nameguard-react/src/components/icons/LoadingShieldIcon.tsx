import { ShieldIconSize } from "../Report/ShieldIcon";
import { LoadingShieldLargeIcon } from "./LoadingShieldLargeIcon";
import { LoadingShieldMediumIcon } from "./LoadingShieldMediumIcon";
import { LoadingShieldSmallIcon } from "./LoadingShieldSmallIcon";
import { LoadingShieldMicroIcon } from "./LoadingShieldMicroIcon";

import React from "react";

export const LoadingShieldIcon = ({
  size,
  ...props
}: { size: ShieldIconSize } & React.ComponentProps) => {
  switch (size) {
    case ShieldIconSize.large:
      return <LoadingShieldLargeIcon {...props} />;
    case ShieldIconSize.medium:
      return <LoadingShieldMediumIcon {...props} />;
    case ShieldIconSize.small:
      return <LoadingShieldSmallIcon {...props} />;
    case ShieldIconSize.micro:
      return <LoadingShieldMicroIcon {...props} />;
  }
};
