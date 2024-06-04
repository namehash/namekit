import React, { useEffect, useState, useRef } from "react";

import { Tooltip } from "../..";

interface TextProps {
  displayTooltipWhenNameClamps?: boolean;
  maxTooltipWidth?: number;
  maxDisplayWidth?: number;
  stylingClasses?: string;
  string: string;
}

const DEFAULT_MAX_DISPLAY_WIDTH = 200;
const DEFAULT_MAX_TOOLTIP_WIDTH = 400;

export const Text = ({
  string,
  stylingClasses = "",
  displayTooltipWhenNameClamps = true,
  maxTooltipWidth = DEFAULT_MAX_TOOLTIP_WIDTH,
  maxDisplayWidth = DEFAULT_MAX_DISPLAY_WIDTH,
}: TextProps) => {
  const invisibleNameWidthTester = useRef<null | HTMLParagraphElement>(null);

  /* 
    Below state is only true if the name displayed is longer 
    than name max-width (defined by MAX_ENSNAME_DISPLAY_WIDTH)
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
        ) > maxDisplayWidth;

      setDisplayFullNameInTooltip(nameIsBiggerThanMax);
    }
  }, [invisibleNameWidthTester]);

  const getTextElm = (
    classes: string,
    maxWidth = maxDisplayWidth,
  ): JSX.Element => {
    return (
      <p style={{ maxWidth: maxWidth }} className={classes}>
        {string}
      </p>
    );
  };

  return (
    <div>
      {displayTooltipWhenNameClamps && (
        <div className="invisible absolute left-0 top-0 pointer-events-none">
          <div ref={invisibleNameWidthTester}>{string}</div>
        </div>
      )}
      {/*
        Below HTML is the rendered text and tooltip, being the
        tooltip only shown when it is needed, on mouse hover. When is it needed?
        Whenever the name displayed is longer than MAX_ENSNAME_DISPLAY_WIDTH.
      */}
      {displayFullNameInTooltip && displayTooltipWhenNameClamps ? (
        <>
          {/* 
            To ensure the DisplayedName doesn't appear wider than `maxDisplayWidth`. 
            If the width required to display the full name exceeds that maximum, CSS automatically
            truncates the displayed name with an ellipsis to ensure it fits within the
            required maximum. If and only if CSS performs this truncation we want to
            provide users with a tooltip on the DisplayedName mouseOver that allows them
            to view the full name. We use the invisible div defined below to check the
            width that would be required to display the full name in the DOM.
            We can use the width of this invisible div to determine if CSS performed
            truncation and if we should activate the tooltip. 
          */}
          <Tooltip
            trigger={
              <>
                {getTextElm(
                  `${stylingClasses} text-black text-sm leading-5 truncate pr-1`,
                )}
              </>
            }
          >
            {getTextElm(
              "text-white text-sm leading-5 break-all",
              maxTooltipWidth,
            )}
          </Tooltip>
        </>
      ) : (
        <>
          {getTextElm(
            `${stylingClasses} text-black text-sm leading-5 truncate pr-1.5`,
          )}
        </>
      )}
    </div>
  );
};
