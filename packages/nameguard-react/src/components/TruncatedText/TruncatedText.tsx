import React, { useEffect, useState, useRef } from "react";
import { Tooltip } from "../Tooltip/Tooltip";
import cc from "classcat";

interface TruncatedTextProps {
  text: string;
  maxTooltipWidth?: number;
  maxDisplayWidth?: number;
  textStylingClasses?: string;
  tooltipTextStylingClasses?: string;
  displayTooltipWhenTextOverflows?: boolean;
}

const DEFAULT_MAX_DISPLAY_WIDTH = 300;
const DEFAULT_MAX_TOOLTIP_WIDTH = 400;

export const TruncatedText = ({
  text,
  textStylingClasses = "",
  tooltipTextStylingClasses = "",
  displayTooltipWhenTextOverflows = true,
  maxTooltipWidth = DEFAULT_MAX_TOOLTIP_WIDTH,
  maxDisplayWidth = DEFAULT_MAX_DISPLAY_WIDTH,
}: TruncatedTextProps) => {
  const invisibleTextWidthTester = useRef<null | HTMLParagraphElement>(null);

  /* 
    Below state is only true if the text displayed 
    is longer than text maxDisplayWidth
  */
  const [textOverflows, setTextOverflows] = useState<boolean>(false);

  useEffect(() => {
    if (
      displayTooltipWhenTextOverflows &&
      invisibleTextWidthTester &&
      invisibleTextWidthTester.current
    ) {
      const textOverflows =
        Math.ceil(
          invisibleTextWidthTester.current.getBoundingClientRect().width,
        ) > maxDisplayWidth;

      setTextOverflows(textOverflows);
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

  const textDefaultClasses = "text-black text-sm truncate";

  return (
    <div>
      {/* 
        We use the invisible div defined below to acknowledge the 
        pixels amount required to display the full 'text' in the DOM.

        We then use this pixels count in comparison to maxDisplayWidth
        to determine if CSS truncation and full-text tooltip are needed. 
      */}
      {displayTooltipWhenTextOverflows && (
        <div className="invisible absolute left-0 top-0 pointer-events-none">
          <div ref={invisibleTextWidthTester}>{text}</div>
        </div>
      )}
      {/*
        Below HTML is the rendered text and tooltip, being the
        tooltip only shown when it is needed, on mouse hover. 
        
        But when is it needed?
        Whenever the text displayed is longer than maxDisplayWidth.
      */}
      {textOverflows && displayTooltipWhenTextOverflows ? (
        <>
          {/* 
            To ensure the TruncatedText doesn't appear wider than maxDisplayWidth,
            if the width required to display the full text exceeds that maximum CSS 
            automatically truncates the displayed text with an ellipsis ensuring it 
            fits within the required maximum width. If and only if CSS performs this 
            text truncation, a tooltip allows users to view the full text onMouseOver. 
          */}
          <Tooltip
            trigger={
              <>{getTextElm(cc([textStylingClasses, textDefaultClasses]))}</>
            }
          >
            {getTextElm(
              cc([
                "text-white text-sm leading-5 break-all",
                tooltipTextStylingClasses,
              ]),
              maxTooltipWidth,
            )}
          </Tooltip>
        </>
      ) : (
        <>{getTextElm(cc([textStylingClasses, textDefaultClasses]))}</>
      )}
    </div>
  );
};
