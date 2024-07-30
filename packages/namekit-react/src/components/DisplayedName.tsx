/*
  This DisplayedName component is a duplicate of @namehash/nameguard-react
  DisplayedName component. This duplicate will, in the near future, be the
  only DisplayedName component in the NameKit libraries. The duplicate is
  necessary for the moment so that it is included in main branch while 
  @namehash/nameguard-react still has its DisplayedName: why is that?

  So any imports of @namehash/nameguard-react DisplayedName component
  do not break once this change is merged into main! Once this duplicate
  is in main, NameHash Labs will remove the DisplayedName component from
  @namehash/nameguard-react and update the imports to use this component
  instead, the @namehash/namekit-react DisplayedName.
*/

import { TruncatedText } from "./TruncatedText";
import { Normalization } from "@namehash/nameguard";
import { ENSName } from "@namehash/ens-utils";
import React from "react";
import cc from "classcat";

interface DisplayedNameProps {
  name: ENSName;
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
