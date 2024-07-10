import { TruncatedText } from "./TruncatedText";
import { Normalization } from "@namehash/nameguard";
import { ENSName } from "@namehash/ens-utils";
import React from "react";
import cc from "classcat";

interface DisplayedNameProps {
  name: ENSName | null; // when null we show a loading state component skeleton
  maxDisplayWidth?: number;
  maxTooltipWidth?: number;
  textStylingClasses?: string;
  displayRawName?: boolean;
  displayUnnormalizedNames?: boolean;
  tooltipTextStylingClasses?: string;
  displayTooltipWhenNameOverflows?: boolean;
}

const DEFAULT_MAX_DISPLAY_WIDTH = 200;

export function DisplayedName({
  name,
  maxTooltipWidth,
  textStylingClasses,
  displayRawName = false,
  tooltipTextStylingClasses,
  displayUnnormalizedNames = false,
  displayTooltipWhenNameOverflows = true,
  maxDisplayWidth = DEFAULT_MAX_DISPLAY_WIDTH,
}: DisplayedNameProps) {
  if (!name) {
    return (
      <div className="nk-w-[120px] nk-h-3 nk-rounded-lg nk-animate-pulse nk-bg-gray-200"></div>
    );
  }

  const showUnnormalizedName =
    displayRawName ||
    (displayUnnormalizedNames &&
      name.normalization === Normalization.unnormalized);
  const displayName = showUnnormalizedName ? name.name : name.displayName;

  return (
    <TruncatedText
      text={displayName}
      maxTooltipWidth={maxTooltipWidth}
      maxDisplayWidth={maxDisplayWidth}
      textStylingClasses={cc([textStylingClasses, "ens-webfont"])}
      displayTooltipWhenTextOverflows={displayTooltipWhenNameOverflows}
      tooltipTextStylingClasses={cc([tooltipTextStylingClasses, "ens-webfont"])}
    />
  );
}
