import { ShieldSize } from "../Report/Shield";
import { LoadingShieldLarge } from "./LoadingShieldLarge";
import { LoadingShieldMedium } from "./LoadingShieldMedium";
import { LoadingShieldSmall } from "./LoadingShieldSmall";
import { LoadingShieldMicro } from "./LoadingShieldMicro";

import React from "react";

export const LoadingShield = ({
  size,
  ...props
}: { size: ShieldSize } & React.ComponentProps) => {
  switch (size) {
    case ShieldSize.large:
      return <LoadingShieldLarge {...props} />;
    case ShieldSize.medium:
      return <LoadingShieldMedium {...props} />;
    case ShieldSize.small:
      return <LoadingShieldSmall {...props} />;
    case ShieldSize.micro:
      return <LoadingShieldMicro {...props} />;
    default:
      return <LoadingShieldMicro {...props} />;
  }
};
