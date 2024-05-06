import { RatingIconSize } from "../Report/RatingIcon";
import { RatingUnknownLargeIcon } from "./RatingUnknownLargeIcon";
import { RatingUnknownMediumIcon } from "./RatingUnknownMediumIcon";
import { RatingUnknownSmallIcon } from "./RatingUnknownSmallIcon";
import { RatingUnknownMicroIcon } from "./RatingUnknownMicroIcon";

import React from "react";

export const RatingUnknownIcon = ({
  size,
  ...props
}: { size: RatingIconSize } & React.ComponentProps) => {
  switch (size) {
    case RatingIconSize.large:
      return <RatingUnknownLargeIcon {...props} />;
    case RatingIconSize.medium:
      return <RatingUnknownMediumIcon {...props} />;
    case RatingIconSize.small:
      return <RatingUnknownSmallIcon {...props} />;
    case RatingIconSize.micro:
      return <RatingUnknownMicroIcon {...props} />;
  }
};
