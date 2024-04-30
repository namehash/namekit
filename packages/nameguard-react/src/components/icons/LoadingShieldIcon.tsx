import { RatingIconSize } from "../Report/RatingIcon";
import { LoadingShieldLargeIcon } from "./LoadingShieldLargeIcon";
import { LoadingShieldMediumIcon } from "./LoadingShieldMediumIcon";
import { LoadingShieldSmallIcon } from "./LoadingShieldSmallIcon";
import { LoadingShieldMicroIcon } from "./LoadingShieldMicroIcon";

import React from "react";

export const LoadingShieldIcon = ({
  size,
  ...props
}: { size: RatingIconSize } & React.ComponentProps) => {
  switch (size) {
    case RatingIconSize.large:
      return <LoadingShieldLargeIcon {...props} />;
    case RatingIconSize.medium:
      return <LoadingShieldMediumIcon {...props} />;
    case RatingIconSize.small:
      return <LoadingShieldSmallIcon {...props} />;
    case RatingIconSize.micro:
      return <LoadingShieldMicroIcon {...props} />;
  }
};
