import React from "react";
import { CheckResultCode } from "@namehash/nameguard";

import { PassShieldLarge } from "./PassShieldLarge";
import { WarnShieldLarge } from "./WarnShieldLarge";
import { AlertShieldLarge } from "./AlertShieldLarge";
import { LoadingShieldLarge } from "./LoadingShieldLarge";
import { ErrorShieldLarge } from "./ErrorShieldLarge";
import { PassShieldMedium } from "./PassShieldMedium";
import { WarnShieldMedium } from "./WarnShieldMedium";
import { AlertShieldMedium } from "./AlertShieldMedium";
import { LoadingShieldMedium } from "./LoadingShieldMedium";
import { ErrorShieldMedium } from "./ErrorShieldMedium";
import { PassShieldSmall } from "./PassShieldSmall";
import { WarnShieldSmall } from "./WarnShieldSmall";
import { AlertShieldSmall } from "./AlertShieldSmall";
import { LoadingShieldSmall } from "./LoadingShieldSmall";
import { ErrorShieldSmall } from "./ErrorShieldSmall";

type Props = {
  size?: "small" | "medium" | "large";
  status: CheckResultCode;
};

const STATUS_TO_BASE_NAME: { [key in CheckResultCode]: string } = {
  alert: "AlertShield",
  pass: "PassShield",
  warn: "WarnShield",
  info: "LoadingShield",
  skip: "ErrorShield",
};

const getComponent = (
  status: CheckResultCode,
  size: "small" | "medium" | "large"
) => {
  const baseName = STATUS_TO_BASE_NAME[status];
  const componentName = `${baseName}${capitalizeFirstLetter(size)}`;

  const components: { [key: string]: React.ComponentType } = {
    PassShieldLarge,
    PassShieldMedium,
    PassShieldSmall,
    WarnShieldLarge,
    WarnShieldMedium,
    WarnShieldSmall,
    AlertShieldLarge,
    AlertShieldMedium,
    AlertShieldSmall,
    LoadingShieldLarge,
    LoadingShieldMedium,
    LoadingShieldSmall,
    ErrorShieldLarge,
    ErrorShieldMedium,
    ErrorShieldSmall,
  };

  return components[componentName] || null;
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Shield = ({ status, size = "medium" }: Props) => {
  const Component = getComponent(status, size);

  return Component ? <Component /> : null;
};
