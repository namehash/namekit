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
import { AlertIcon as AlertShieldMicroIcon } from "../icons/AlertIcon";
import { WarnIcon as WarnShieldMicroIcon } from "../icons/WarnIcon";
import { PassIcon as PassShieldMicroIcon } from "../icons/PassIcon";

export function getNameGuardRatingHoverTextColors(rating: Rating) {
  switch (rating) {
    case Rating.alert: {
      return "hover:text-red-700";
    }
    case Rating.pass: {
      return "hover:text-emerald-800";
    }
    case Rating.warn: {
      return "hover:text-yellow-600";
    }
  }
}

export function getNameGuardRatingTextColors(rating: Rating) {
  switch (rating) {
    case Rating.alert: {
      return "text-red-600";
    }
    case Rating.pass: {
      return "text-emerald-600";
    }
    case Rating.warn: {
      return "text-yellow-500";
    }
  }
}

export enum ShieldIconSize {
  micro = "micro",
  small = "small",
  medium = "medium",
  large = "large",
}

type Props = {
  rating: Rating;
  size?: ShieldIconSize;
  className?: string;
};

const STATUS_TO_BASE_NAME: { [key in Rating]: string } = {
  [Rating.alert]: "AlertShield",
  [Rating.pass]: "PassShield",
  [Rating.warn]: "WarnShield",
};

const getComponent = (rating: Rating, size: ShieldIconSize) => {
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
      `ShieldIcon could not be built with params: \n\n rating: ${rating}\n size: ${size}`
    );
  }

  return components[componentName];
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const ShieldIcon = ({
  rating,
  size = ShieldIconSize.small,
  ...props
}: Props) => {
  const Component = getComponent(rating, size);

  return Component ? <Component {...props} /> : null;
};
