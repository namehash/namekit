import { ShieldIconSize } from "../Report/ShieldIcon";
import { UnknownShieldLargeIcon } from "./UnknownShieldLargeIcon";
import { UnknownShieldMediumIcon } from "./UnknownShieldMediumIcon";
import { UnknownShieldSmallIcon } from "./UnknownShieldSmallIcon";
import { UnknownShieldMicroIcon } from "./UnknownShieldMicroIcon";

import React from "react";

export const UnknownShieldIcon = ({
  size,
  ...props
}: { size: ShieldIconSize } & React.ComponentProps) => {
  switch (size) {
    case ShieldIconSize.large:
      return <UnknownShieldLargeIcon {...props} />;
    case ShieldIconSize.medium:
      return <UnknownShieldMediumIcon {...props} />;
    case ShieldIconSize.small:
      return <UnknownShieldSmallIcon {...props} />;
    case ShieldIconSize.micro:
      return <UnknownShieldMicroIcon {...props} />;
  }
};
