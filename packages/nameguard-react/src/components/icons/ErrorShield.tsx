import { ShieldSize } from "../Report/Shield";
import { ErrorShieldLarge } from "./ErrorShieldLarge";
import { ErrorShieldMedium } from "./ErrorShieldMedium";
import { ErrorShieldSmall } from "./ErrorShieldSmall";
import { ErrorShieldMicro } from "./ErrorShieldMicro";

import React from "react";

export const ErrorShield = ({
  size,
  ...props
}: { size: ShieldSize } & React.ComponentProps) => {
  switch (size) {
    case ShieldSize.large:
      return <ErrorShieldLarge {...props} />;
    case ShieldSize.medium:
      return <ErrorShieldMedium {...props} />;
    case ShieldSize.small:
      return <ErrorShieldSmall {...props} />;
    case ShieldSize.micro:
      return <ErrorShieldMicro {...props} />;
    default:
      return <ErrorShieldMicro {...props} />;
  }
};
