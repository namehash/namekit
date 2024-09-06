/**
 * This TruncatedText component is a duplicate of @namehash/nameguard-react
 * TruncatedText component. This duplicate will, in the near future, be the
 * only TruncatedText component in the NameKit libraries. The duplicate is
 * necessary for the moment so that it is included in main branch while
 * @namehash/nameguard-react still has its TruncatedText: why is that?
 *
 * So any imports of @namehash/nameguard-react TruncatedText component
 * do not break once this change is merged into main! Once this duplicate
 * is in main, NameHash Labs will remove the TruncatedText component from
 * @namehash/nameguard-react and update the imports to use this component
 * instead, the @namehash/namekit-react TruncatedText.
 *
 * A ShortCut story was created to track this migration:
 * https://app.shortcut.com/ps-web3/story/25261/next-steps-on-displayedname-and-truncatedtext
 */

import React, { useEffect, useState, useRef } from "react";
import cc from "classcat";
import { Tooltip } from "./Tooltip";

interface TruncatedTextProps {
  text: string;
  maxDisplayWidth: number;
  textStylingClasses?: string;
  displayTooltipWhenTextOverflows?: boolean;
  maxTooltipWidth?: number;
  tooltipTextStylingClasses?: string;
}

export const TruncatedText = ({
  text,
  maxDisplayWidth,
  textStylingClasses = "",
  displayTooltipWhenTextOverflows = true,
  maxTooltipWidth,
  tooltipTextStylingClasses = "",
}: TruncatedTextProps) => {
  const invisibleTextWidthTester = useRef<null | HTMLParagraphElement>(null);

  /* 
    `textOverflows` is `true` if and only if the width of `text` is greater
    than `maxDisplayWidth`.
  */
  const [textOverflows, setTextOverflows] = useState<boolean>(false);

  useEffect(() => {
    if (displayTooltipWhenTextOverflows && invisibleTextWidthTester.current) {
      const textOverflows =
        Math.ceil(
          invisibleTextWidthTester.current.getBoundingClientRect().width,
        ) > maxDisplayWidth;

      setTextOverflows(textOverflows);
    }
  }, [
    displayTooltipWhenTextOverflows,
    invisibleTextWidthTester,
    maxDisplayWidth,
    text,
  ]);

  const getTextElm = (
    classes: string,
    maxWidth?: number,
  ): JSX.Element => {
    return (
      <p style={maxWidth !== undefined ? { maxWidth } : undefined} className={classes}>
        {text}
      </p>
    );
  };

  const textDefaultClasses = "nk-truncate";

  const renderText = (): JSX.Element => {
    return getTextElm(cc([textStylingClasses, textDefaultClasses]), maxDisplayWidth);
  };

  const renderTextWithATooltip = (): JSX.Element => {
    return (
      <div>


        <div
          className={cc([
            textStylingClasses,
            "nk-invisible nk-absolute nk-left-0 nk-top-0 nk-pointer-events-none",
          ])}
        >
        {/* 
          This invisible div is used to measure the true width of `text` as it
          would be rendered in the DOM.
        */}
          <div ref={invisibleTextWidthTester}>{text}</div>
        </div>

        {textOverflows ? (
          <>
            {/* 
              
              `text` overflows `maxDisplayWidth`, therefore we need to render
              it twice:

              1. Truncated on a single line with a max width of `maxDisplayWidth`.
                 This is used as the anchor text trigger of a `Tooltip`.
              2. Untruncated on one or more lines inside a `Tooltip`, with a
                 max width per line of of `maxTooltipWidth`.
          */}
            <Tooltip trigger={renderText()}>
              {getTextElm(
                cc([
                  "nk-text-white nk-text-sm nk-leading-5 nk-break-all",
                  tooltipTextStylingClasses,
                ]),
                maxTooltipWidth,
              )}
            </Tooltip>
          </>
        ) : (

          // `text` doesn't overflow `maxDisplayWidth`, therefore we can render
          // it once without any truncation
          
          renderText()
        )}
      </div>
    );
  };

  return displayTooltipWhenTextOverflows
    ? renderTextWithATooltip()
    : renderText();
};
