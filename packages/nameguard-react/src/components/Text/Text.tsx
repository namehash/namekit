import React, { useEffect, useState, useRef } from "react";

import { Tooltip } from "../..";

interface TextProps {
  displayTooltipWhenTextOverflows?: boolean;
  maxTooltipWidth?: number;
  maxDisplayWidth?: number;
  textStylingClasses?: string;
  text: string;
}

const DEFAULT_MAX_DISPLAY_WIDTH = 300;
const DEFAULT_MAX_TOOLTIP_WIDTH = 400;

export const Text = ({
  text,
  textStylingClasses = "",
  displayTooltipWhenTextOverflows = true,
  maxTooltipWidth = DEFAULT_MAX_TOOLTIP_WIDTH,
  maxDisplayWidth = DEFAULT_MAX_DISPLAY_WIDTH,
}: TextProps) => {
  const invisibleTextWidthTester = useRef<null | HTMLParagraphElement>(null);

  /* 
    Below state is only true if the text displayed 
    is longer than text maxDisplayWidth
  */
  const [displayFullTextInTooltip, setDisplayFullTextInTooltip] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      displayTooltipWhenTextOverflows &&
      invisibleTextWidthTester &&
      invisibleTextWidthTester.current
    ) {
      const textIsBiggerThanMax =
        Math.ceil(
          invisibleTextWidthTester.current.getBoundingClientRect().width,
        ) > maxDisplayWidth;

      setDisplayFullTextInTooltip(textIsBiggerThanMax);
    }
  }, [invisibleTextWidthTester]);

  const getTextElm = (
    classes: string,
    maxWidth = maxDisplayWidth,
  ): JSX.Element => {
    return (
      <p style={{ maxWidth: maxWidth }} className={classes}>
        {text}
      </p>
    );
  };

  const textDefaultClasses = "text-black text-sm leading-5 truncate pr-1.5";

  return (
    <div>
      {displayTooltipWhenTextOverflows && (
        <div className="invisible absolute left-0 top-0 pointer-events-none">
          <div ref={invisibleTextWidthTester}>{text}</div>
        </div>
      )}
      {/*
        Below HTML is the rendered text and tooltip, being the
        tooltip only shown when it is needed, on mouse hover. When is it needed?
        Whenever the text displayed is longer than maxDisplayWidth.
      */}
      {displayFullTextInTooltip && displayTooltipWhenTextOverflows ? (
        <>
          {/* 
            To ensure the Text doesn't appear wider than `maxDisplayWidth`. 
            If the width required to display the full text exceeds that maximum, CSS automatically
            truncates the displayed text with an ellipsis to ensure it fits within the
            required maximum. If and only if CSS performs this truncation we want to
            provide users with a tooltip on the Text mouseOver that allows them
            to view the full text. We use the invisible div defined below to check the
            width that would be required to display the full text in the DOM.
            We can use the width of this invisible div to determine if CSS performed
            truncation and if we should activate the tooltip. 
          */}
          <Tooltip
            trigger={
              <>{getTextElm(`${textStylingClasses} ${textDefaultClasses}`)}</>
            }
          >
            {getTextElm(
              "text-white text-sm leading-5 break-all",
              maxTooltipWidth,
            )}
          </Tooltip>
        </>
      ) : (
        <>{getTextElm(`${textStylingClasses} ${textDefaultClasses}`)}</>
      )}
    </div>
  );
};
