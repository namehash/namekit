import { RatingIconSize } from "../Report/RatingIcon";
import { RatingUnknownLargeIcon } from "./RatingUnknownLargeIcon";
import { RatingUnknownMediumIcon } from "./RatingUnknownMediumIcon";
import { RatingUnknownSmallIcon } from "./RatingUnknownSmallIcon";
import { RatingUnknownMicroIcon } from "./RatingUnknownMicroIcon";

import React from "react";

export const RatingUnknownIcon = ({
  size,
  isNotInteractive = false,
  className = "",
}: {
  size: RatingIconSize;
  isNotInteractive?: boolean;
} & React.ComponentProps) => {
  console.log();
  switch (size) {
    case RatingIconSize.large:
      return RatingUnknownLargeIcon(className);
    case RatingIconSize.medium:
      return RatingUnknownMediumIcon(className, isNotInteractive);
    case RatingIconSize.small:
      return RatingUnknownSmallIcon(className, isNotInteractive);
    case RatingIconSize.micro:
      return RatingUnknownMicroIcon(className, isNotInteractive);
  }
};
