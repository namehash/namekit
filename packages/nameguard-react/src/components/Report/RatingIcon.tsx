import React from "react";
import { Rating } from "@namehash/nameguard";

import { PassShieldLargeIcon } from "../icons/PassShieldLargeIcon";
import { WarnShieldLargeIcon } from "../icons/WarnShieldLargeIcon";
import { AlertShieldLargeIcon } from "../icons/AlertShieldLargeIcon";
import { PassShieldMediumIcon } from "../icons/PassShieldMediumIcon";
import { WarnShieldMediumIcon } from "../icons/WarnShieldMediumIcon";
import { AlertShieldMediumIcon } from "../icons/AlertShieldMediumIcon";
import { PassShieldSmallIcon } from "../icons/PassShieldSmallIcon";
import { WarnShieldSmallIcon } from "../icons/WarnShieldSmallIcon";
import { AlertShieldSmallIcon } from "../icons/AlertShieldSmallIcon";
import { AlertShieldMicroIcon } from "../icons/AlertShieldMicroIcon";
import { WarnShieldMicroIcon } from "../icons/WarnShieldMicroIcon";
import { PassShieldMicroIcon } from "../icons/PassShieldMicroIcon";

export enum RatingIconSize {
  micro = "micro",
  small = "small",
  medium = "medium",
  large = "large",
}

type Props = {
  rating: Rating;
  size?: RatingIconSize;
  className?: string;
};

const STATUS_TO_BASE_NAME: { [key in Rating]: string } = {
  [Rating.alert]: "AlertShield",
  [Rating.pass]: "PassShield",
  [Rating.warn]: "WarnShield",
};

const getComponent = (rating: Rating, size: RatingIconSize): React.Node => {
  const baseName = STATUS_TO_BASE_NAME[rating];
  const componentName = `${baseName}${capitalizeFirstLetter(size)}Icon`;

  const components: { [key: string]: React.ComponentType } = {
    PassShieldLargeIcon,
    PassShieldMediumIcon,
    PassShieldSmallIcon,
    PassShieldMicroIcon,
    WarnShieldLargeIcon,
    WarnShieldMediumIcon,
    WarnShieldSmallIcon,
    WarnShieldMicroIcon,
    AlertShieldLargeIcon,
    AlertShieldMediumIcon,
    AlertShieldSmallIcon,
    AlertShieldMicroIcon,
  };

  if (!components[componentName]) {
    throw new Error(
      `RatingIcon could not be built with params: \n\n rating: ${rating}\n size: ${size}`
    );
  }

  return components[componentName];
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const RatingIcon = ({
  rating,
  size = RatingIconSize.small,
  ...props
}: Props) => {
  const Component = getComponent(rating, size);

  return <Component {...props} />;
};
