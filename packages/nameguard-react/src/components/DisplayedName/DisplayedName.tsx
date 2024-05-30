import { Normalization } from "@namehash/nameguard";
import React, { useEffect, useState, useRef } from "react";

import { Tooltip } from "../..";
import { ENSName } from "@namehash/ens-utils";

interface DisplayedNameProps {
  ensName: ENSName;
  maxEnsNameDisplayWidth?: number;
  displayUnnormalizedNames?: boolean;
  displayTooltipWhenNameClamps?: boolean;
}

const DEFAULT_MAX_ENSNAME_DISPLAY_WIDTH = 200;

export function DisplayedName({
  ensName,
  displayUnnormalizedNames = false,
  displayTooltipWhenNameClamps = true,
  maxEnsNameDisplayWidth = DEFAULT_MAX_ENSNAME_DISPLAY_WIDTH,
}: DisplayedNameProps) {
  const invisibleNameWidthTester = useRef<null | HTMLParagraphElement>(null);

  /* 
    Below state is only true if the ensName displayed is longer 
    than ensName max-width (defined by MAX_ENSNAME_DISPLAY_WIDTH)
  */
  const [displayFullNameInTooltip, setDisplayFullNameInTooltip] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      displayTooltipWhenNameClamps &&
      invisibleNameWidthTester &&
      invisibleNameWidthTester.current
    ) {
      const nameIsBiggerThanMax =
        Math.ceil(
          invisibleNameWidthTester.current.getBoundingClientRect().width,
        ) > maxEnsNameDisplayWidth;

      setDisplayFullNameInTooltip(nameIsBiggerThanMax);
    }
  }, [invisibleNameWidthTester]);

  const showUnnormalizedName =
    displayUnnormalizedNames &&
    ensName.normalization === Normalization.unnormalized;
  const displayName = showUnnormalizedName ? ensName.name : ensName.displayName;

  return (
    <div>
      {/* 
        To ensure a DisplayedName doesn't grow too wide the ensName that is
        actually displayed has a max-width applied by CSS. If the width required
        to display the full ensName exceeds that maximum, CSS automatically
        truncates the displayed name with an ellipsis to ensure it fits within the
        required maximum. If and only if CSS performs this truncation we want to
        provide users with a tooltip on the DisplayedName mouseOver that allows them
        to view the full ensName. We use the invisible div defined below to check the
        width that would be required to display the full ensName in the DOM.
        We can use the width of this invisible div to determine if CSS performed
        truncation and if we should activate the tooltip. 
      */}
      <div className="invisible absolute left-0 top-0 pointer-events-none">
        <div ref={invisibleNameWidthTester}>{displayName}</div>
      </div>
      {/*
        Below HTML is the rendered text and tooltip, being the
        tooltip only shown when it is needed, on mouse hover. When is it needed?
        Whenever the ensName displayed is longer than MAX_ENSNAME_DISPLAY_WIDTH.
      */}
      {displayFullNameInTooltip && displayTooltipWhenNameClamps ? (
        <Tooltip
          trigger={
            <div
              style={{ maxWidth: maxEnsNameDisplayWidth }}
              className="cursor-pointer text-black text-sm leading-5 ens-webfont truncate pr-1"
            >
              {displayName}
            </div>
          }
        >
          <span className="text-white text-sm leading-5 ens-webfont">
            {displayName}
          </span>
        </Tooltip>
      ) : (
        <p
          style={{ maxWidth: maxEnsNameDisplayWidth }}
          className="text-black text-sm leading-5 ens-webfont truncate pr-1.5"
        >
          {displayName}
        </p>
      )}
    </div>
  );
}
