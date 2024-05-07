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

function icon(code: CheckResultCode, withHoverEffect = true): React.ReactNode {
  switch (code) {
    case CheckResultCode.pass:
      return <CheckResultCodePassIcon withHoverEffect={withHoverEffect} />;
    case CheckResultCode.warn:
      return <CheckResultCodeWarnIcon withHoverEffect={withHoverEffect} />;
    case CheckResultCode.alert:
      return <CheckResultCodeAlertIcon withHoverEffect={withHoverEffect} />;
    case CheckResultCode.info:
      return <CheckResultCodeInfoIcon withHoverEffect={withHoverEffect} />;
    case CheckResultCode.skip:
      return <CheckResultCodeSkipIcon withHoverEffect={withHoverEffect} />;
  }
}

/**
 * A component that displays a check result code as an icon with a tooltip.
 * @param {CheckResultCode} code - The CheckResultCode status to display.
 * @param {boolean} isInteractive - Wether to display a Tooltip and a color effect on icon hover.
 */
export function CheckIcon({
  code,
  isInteractive = true,
}: {
  code: CheckResultCode;
  isInteractive?: boolean;
}) {
  const tooltipText = text(code);
  const Icon = icon(code, isInteractive);

  if (!isInteractive) {
    return Icon;
  }

  return <Tooltip trigger={Icon} children={tooltipText} />;
}
