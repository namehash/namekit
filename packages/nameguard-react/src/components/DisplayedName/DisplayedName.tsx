import { Normalization } from "@namehash/nameguard";
import { ENSName } from "@namehash/ens-utils";
import React from "react";
import { TruncatedText } from "../TruncatedText/TruncatedText";

interface DisplayedNameProps {
  name: ENSName;
  maxDisplayWidth?: number;
  maxTooltipWidth?: number;
  textStylingClasses?: string;
  displayUnnormalizedNames?: boolean;
  tooltipContentStylingClasses?: string;
  displayTooltipWhenNameOverflows?: boolean;
}

const DEFAULT_MAX_DISPLAY_WIDTH = 200;

export function DisplayedName({
  name,
  maxTooltipWidth,
  textStylingClasses,
  tooltipContentStylingClasses,
  displayUnnormalizedNames = false,
  displayTooltipWhenNameOverflows = true,
  maxDisplayWidth = DEFAULT_MAX_DISPLAY_WIDTH,
}: DisplayedNameProps) {
  const showUnnormalizedName =
    displayUnnormalizedNames &&
    name.normalization === Normalization.unnormalized;
  const displayName = showUnnormalizedName ? name.name : name.displayName;

  return (
    <TruncatedText
      text={displayName}
      maxTooltipWidth={maxTooltipWidth}
      maxDisplayWidth={maxDisplayWidth}
      textStylingClasses={textStylingClasses + " ens-webfont"}
      tooltipContentStylingClasses={tooltipContentStylingClasses}
      displayTooltipWhenTextOverflows={displayTooltipWhenNameOverflows}
    />
  );
}
