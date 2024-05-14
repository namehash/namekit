import React from "react";
import { Tooltip } from "../Tooltip/Tooltip";
import { CheckResultCode } from "@namehash/nameguard";
import { CheckResultCodePassIcon } from "../icons/CheckResultCodePassIcon";
import { CheckResultCodeWarnIcon } from "../icons/CheckResultCodeWarnIcon";
import { CheckResultCodeAlertIcon } from "../icons/CheckResultCodeAlertIcon";
import { CheckResultCodeInfoIcon } from "../icons/CheckResultCodeInfoIcon";
import { CheckResultCodeSkipIcon } from "../icons/CheckResultCodeSkipIcon";

function text(code: CheckResultCode) {
  switch (code) {
    case CheckResultCode.pass:
      return "All Checks Passed";
    case CheckResultCode.warn:
      return "Warning";
    case CheckResultCode.alert:
      return "Alert";
    case CheckResultCode.info:
      return "Informational Notice";
    case CheckResultCode.skip:
      return "Check Not Applicable";
  }
}

function icon(code: CheckResultCode, isInteractive = false): React.ReactNode {
  switch (code) {
    case CheckResultCode.pass:
      return <CheckResultCodePassIcon isInteractive={isInteractive} />;
    case CheckResultCode.warn:
      return <CheckResultCodeWarnIcon isInteractive={isInteractive} />;
    case CheckResultCode.alert:
      return <CheckResultCodeAlertIcon isInteractive={isInteractive} />;
    case CheckResultCode.info:
      return <CheckResultCodeInfoIcon isInteractive={isInteractive} />;
    case CheckResultCode.skip:
      return <CheckResultCodeSkipIcon isInteractive={isInteractive} />;
  }
}

/**
 * A component that displays a check result code as an icon with a tooltip.
 * @param {CheckResultCode} code - The CheckResultCode status to display.
 * @param {boolean} isInteractive - Wether to display a Tooltip and a color effect on icon hover or not.
 */
export function CheckIcon({
  code,
  isInteractive = false,
}: {
  code: CheckResultCode;
  isInteractive?: boolean;
}) {
  const tooltipText = text(code);
  const Icon = icon(code, isInteractive);

  if (isInteractive) {
    return <Tooltip trigger={Icon} children={tooltipText} />;
  } else {
    return Icon;
  }
}
