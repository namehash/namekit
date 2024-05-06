import { RatingIconSize } from "../Report/RatingIcon";
import { RatingLoadingLargeIcon } from "./RatingLoadingLargeIcon";
import { RatingLoadingMediumIcon } from "./RatingLoadingMediumIcon";
import { RatingLoadingSmallIcon } from "./RatingLoadingSmallIcon";
import { RatingLoadingMicroIcon } from "./RatingLoadingMicroIcon";

import React from "react";

export const RatingLoadingIcon = ({
  size,
  ...props
}: { size: RatingIconSize } & React.ComponentProps) => {
  switch (size) {
    case RatingIconSize.large:
      return <RatingLoadingLargeIcon {...props} />;
    case RatingIconSize.medium:
      return <RatingLoadingMediumIcon {...props} />;
    case RatingIconSize.small:
      return <RatingLoadingSmallIcon {...props} />;
    case RatingIconSize.micro:
      return <RatingLoadingMicroIcon {...props} />;
  }
};
