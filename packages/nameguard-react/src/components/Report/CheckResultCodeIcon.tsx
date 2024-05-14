import React from "react";
import { Tooltip } from "../Tooltip/Tooltip";
import { CheckResultCode, Rating } from "@namehash/nameguard";
import { CheckResultCodePassIcon } from "../icons/CheckResultCodePassIcon";
import { CheckResultCodeWarnIcon } from "../icons/CheckResultCodeWarnIcon";
import { CheckResultCodeAlertIcon } from "../icons/CheckResultCodeAlertIcon";
import { CheckResultCodeInfoIcon } from "../icons/CheckResultCodeInfoIcon";
import { CheckResultCodeSkipIcon } from "../icons/CheckResultCodeSkipIcon";

function text(code: CheckResultCode | Rating) {
  switch (code) {
    case CheckResultCode.pass:
    case Rating.pass:
      return "All Checks Passed";
    case CheckResultCode.warn:
    case Rating.warn:
      return "Warning";
    case CheckResultCode.alert:
    case Rating.alert:
      return "Alert";
    case CheckResultCode.info:
      return "Informational Notice";
    case CheckResultCode.skip:
      return "Check Not Applicable";
  }
}

function icon(
  code: CheckResultCode | Rating,
  isInteractive = false,
  onClick = () => {},
  className = "",
): React.ReactNode {
  switch (code) {
    case CheckResultCode.pass:
    case Rating.pass:
      return (
        <CheckResultCodePassIcon
          isInteractive={isInteractive}
          className={className}
          onClick={onClick}
        />
      );
    case CheckResultCode.warn:
    case Rating.warn:
      return (
        <CheckResultCodeWarnIcon
          isInteractive={isInteractive}
          className={className}
          onClick={onClick}
        />
      );
    case CheckResultCode.alert:
    case Rating.alert:
      return (
        <CheckResultCodeAlertIcon
          isInteractive={isInteractive}
          className={className}
          onClick={onClick}
        />
      );
    case CheckResultCode.info:
      return (
        <CheckResultCodeInfoIcon
          isInteractive={isInteractive}
          className={className}
          onClick={onClick}
        />
      );
    case CheckResultCode.skip:
      return (
        <CheckResultCodeSkipIcon
          isInteractive={isInteractive}
          className={className}
          onClick={onClick}
        />
      );
  }
}

/**
 * A component that displays a check result code as an icon with a tooltip.
 * @param {CheckResultCode} code - The CheckResultCode status to display.
 * @param {boolean} isInteractive - Wether to display a Tooltip and a color effect on icon hover or not.
 */
export function CheckResultCodeIcon({
  code,
  onClick = () => {},
  isInteractive = false,
  className = "",
}: {
  onClick?: () => void;
  code: CheckResultCode | Rating;
  isInteractive?: boolean;
  className?: string;
}) {
  const tooltipText = text(code);
  const Icon = icon(code, isInteractive, onClick, className);

  if (isInteractive) {
    return <Tooltip trigger={Icon} children={tooltipText} />;
  } else {
    return Icon;
  }
}
