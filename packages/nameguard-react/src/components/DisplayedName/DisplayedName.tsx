import { Normalization } from "@namehash/nameguard";
import { ENSName } from "@namehash/ens-utils";
import React from "react";
import { Text } from "../Text/Text";

interface DisplayedNameProps {
  name: ENSName;
  stylingClasses?: string;
  maxDisplayWidth?: number;
  maxTooltipWidth?: number;
  displayUnnormalizedNames?: boolean;
  displayTooltipWhenNameClamps?: boolean;
}

export function DisplayedName({
  name,
  stylingClasses,
  maxDisplayWidth,
  maxTooltipWidth,
  displayUnnormalizedNames = false,
  displayTooltipWhenNameClamps = true,
}: DisplayedNameProps) {
  const showUnnormalizedName =
    displayUnnormalizedNames &&
    name.normalization === Normalization.unnormalized;
  const displayName = showUnnormalizedName ? name.name : name.displayName;

  return (
    <Text
      string={displayName}
      stylingClasses={stylingClasses + " ens-webfont"}
      maxTooltipWidth={maxTooltipWidth}
      maxDisplayWidth={maxDisplayWidth}
      displayTooltipWhenNameClamps={displayTooltipWhenNameClamps}
    />
  );
}
