import { RatingIconSize } from "../Report/RatingIcon";
import { UnknownShieldLargeIcon } from "./UnknownShieldLargeIcon";
import { UnknownShieldMediumIcon } from "./UnknownShieldMediumIcon";
import { UnknownShieldSmallIcon } from "./UnknownShieldSmallIcon";
import { UnknownShieldMicroIcon } from "./UnknownShieldMicroIcon";

import React from "react";

export const UnknownShieldIcon = ({
  size,
  ...props
}: { size: RatingIconSize } & React.ComponentProps) => {
  switch (size) {
    case RatingIconSize.large:
      return <UnknownShieldLargeIcon {...props} />;
    case RatingIconSize.medium:
      return <UnknownShieldMediumIcon {...props} />;
    case RatingIconSize.small:
      return <UnknownShieldSmallIcon {...props} />;
    case RatingIconSize.micro:
      return <UnknownShieldMicroIcon {...props} />;
  }
};
