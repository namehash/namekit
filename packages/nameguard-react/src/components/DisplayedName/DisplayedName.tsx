import { Normalization } from "@namehash/nameguard";
import { ENSName } from "@namehash/ens-utils";
import React from "react";
import { Text } from "../Text/Text";

interface DisplayedNameProps {
  name: ENSName;
  textStylingClasses?: string;
  maxDisplayWidth?: number;
  maxTooltipWidth?: number;
  displayUnnormalizedNames?: boolean;
  displayTooltipWhenNameOverflows?: boolean;
}

const DEFAULT_MAX_DISPLAY_WIDTH = 200;

export function DisplayedName({
  name,
  textStylingClasses,
  maxTooltipWidth,
  displayUnnormalizedNames = false,
  displayTooltipWhenNameOverflows = true,
  maxDisplayWidth = DEFAULT_MAX_DISPLAY_WIDTH,
}: DisplayedNameProps) {
  const showUnnormalizedName =
    displayUnnormalizedNames &&
    name.normalization === Normalization.unnormalized;
  const displayName = showUnnormalizedName ? name.name : name.displayName;

  return (
    <Text
      text={displayName}
      textStylingClasses={textStylingClasses + " ens-webfont"}
      maxTooltipWidth={maxTooltipWidth}
      maxDisplayWidth={maxDisplayWidth}
      displayTooltipWhenTextOverflows={displayTooltipWhenNameOverflows}
    />
  );
}
