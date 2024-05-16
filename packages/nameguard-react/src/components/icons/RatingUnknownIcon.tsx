import { RatingIconSize } from "../Report/RatingIcon";
import { RatingUnknownLargeIcon } from "./RatingUnknownLargeIcon";
import { RatingUnknownMediumIcon } from "./RatingUnknownMediumIcon";
import { RatingUnknownSmallIcon } from "./RatingUnknownSmallIcon";
import { RatingUnknownMicroIcon } from "./RatingUnknownMicroIcon";

import React from "react";

export const RatingUnknownIcon = ({
  size,
  isInteractive = false,
  ...props
}: {
  size: RatingIconSize;
  isInteractive?: boolean;
} & React.ComponentProps) => {
  switch (size) {
    case RatingIconSize.large:
      return RatingUnknownLargeIcon(props);
    case RatingIconSize.medium:
      return RatingUnknownMediumIcon(props, isInteractive);
    case RatingIconSize.small:
      return RatingUnknownSmallIcon(props, isInteractive);
    case RatingIconSize.micro:
      return RatingUnknownMicroIcon(props, isInteractive);
  }
};
