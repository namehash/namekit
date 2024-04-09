import React from "react";
import { CheckResultCode } from "@namehash/nameguard";

import { PassShieldLarge } from "../icons/PassShieldLarge";
import { WarnShieldLarge } from "../icons/WarnShieldLarge";
import { AlertShieldLarge } from "../icons/AlertShieldLarge";
import { LoadingShieldLarge } from "../icons/LoadingShieldLarge";
import { ErrorShieldLarge } from "../icons/ErrorShieldLarge";
import { PassShieldMedium } from "../icons/PassShieldMedium";
import { WarnShieldMedium } from "../icons/WarnShieldMedium";
import { AlertShieldMedium } from "../icons/AlertShieldMedium";
import { LoadingShieldMedium } from "../icons/LoadingShieldMedium";
import { ErrorShieldMedium } from "../icons/ErrorShieldMedium";
import { PassShieldSmall } from "../icons/PassShieldSmall";
import { WarnShieldSmall } from "../icons/WarnShieldSmall";
import { AlertShieldSmall } from "../icons/AlertShieldSmall";
import { LoadingShieldSmall } from "../icons/LoadingShieldSmall";
import { ErrorShieldSmall } from "../icons/ErrorShieldSmall";
import { AlertIcon as AlertShieldMicro } from "../icons/Alert";
import { WarnIcon as WarnShieldMicro } from "../icons/Warn";
import { PassIcon as PassShieldMicro } from "../icons/Pass";
import { LoadingIcon as LoadingShieldMicro } from "../icons/Loading";
import { ErrorIcon as ErrorShieldMicro } from "../icons/Error";

export enum ShieldSize {
  micro = "micro",
  small = "small",
  medium = "medium",
  large = "large",
}

type Props = {
  size?: ShieldSize;
  status: CheckResultCode;
  className?: string;
};

const STATUS_TO_BASE_NAME: { [key in CheckResultCode]: string } = {
  [CheckResultCode.alert]: "AlertShield",
  [CheckResultCode.pass]: "PassShield",
  [CheckResultCode.warn]: "WarnShield",
  [CheckResultCode.info]: "LoadingShield",
  [CheckResultCode.skip]: "ErrorShield",
};

const getComponent = (status: CheckResultCode, size: ShieldSize) => {
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
    LoadingShieldLarge,
    LoadingShieldMedium,
    LoadingShieldSmall,
    LoadingShieldMicro,
    ErrorShieldLarge,
    ErrorShieldMedium,
    ErrorShieldSmall,
    ErrorShieldMicro,
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
