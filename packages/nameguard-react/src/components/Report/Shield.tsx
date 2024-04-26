import React from "react";
import { Rating } from "@namehash/nameguard";

import { PassShieldLarge } from "../icons/PassShieldLarge";
import { WarnShieldLarge } from "../icons/WarnShieldLarge";
import { AlertShieldLarge } from "../icons/AlertShieldLarge";
import { PassShieldMedium } from "../icons/PassShieldMedium";
import { WarnShieldMedium } from "../icons/WarnShieldMedium";
import { AlertShieldMedium } from "../icons/AlertShieldMedium";
import { PassShieldSmall } from "../icons/PassShieldSmall";
import { WarnShieldSmall } from "../icons/WarnShieldSmall";
import { AlertShieldSmall } from "../icons/AlertShieldSmall";
import { AlertIcon as AlertShieldMicro } from "../icons/Alert";
import { WarnIcon as WarnShieldMicro } from "../icons/Warn";
import { PassIcon as PassShieldMicro } from "../icons/Pass";

export function getNameGuardRatingTextColors(rating: Rating) {
  switch (rating) {
    case Rating.alert: {
      return "text-red-600 hover:text-red-700";
    }
    case Rating.pass: {
      return "text-emerald-600 hover:text-emerald-800";
    }
    case Rating.warn: {
      return "text-yellow-500 hover:text-yellow-600";
    }
    default: {
      return "text-gray-400 hover:text-gray-500";
    }
  }
}

export enum ShieldSize {
  micro = "micro",
  small = "small",
  medium = "medium",
  large = "large",
}

type Props = {
  status: Rating;
  size?: ShieldSize;
  className?: string;
};

const STATUS_TO_BASE_NAME: { [key in Rating]: string } = {
  [Rating.alert]: "AlertShield",
  [Rating.pass]: "PassShield",
  [Rating.warn]: "WarnShield",
};

const getComponent = (status: Rating, size: ShieldSize) => {
  const baseName = STATUS_TO_BASE_NAME[status];
  const componentName = `${baseName}${capitalizeFirstLetter(size)}`;

  const components: { [key: string]: React.ComponentType } = {
    PassShieldLarge,
    PassShieldMedium,
    PassShieldSmall,
    PassShieldMicro,
    WarnShieldLarge,
    WarnShieldMedium,
    WarnShieldSmall,
    WarnShieldMicro,
    AlertShieldLarge,
    AlertShieldMedium,
    AlertShieldSmall,
    AlertShieldMicro,
  };

  return components[componentName] || null;
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Shield = ({
  status,
  size = ShieldSize.small,
  ...props
}: Props) => {
  const Component = getComponent(status, size);

  return Component ? <Component {...props} /> : null;
};
