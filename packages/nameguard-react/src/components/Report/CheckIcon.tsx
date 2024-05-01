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

function icon(code: CheckResultCode): React.ReactNode {
  switch (code) {
    case CheckResultCode.pass:
      return <CheckResultCodePassIcon />;
    case CheckResultCode.warn:
      return <CheckResultCodeWarnIcon />;
    case CheckResultCode.alert:
      return <CheckResultCodeAlertIcon />;
    case CheckResultCode.info:
      return <CheckResultCodeInfoIcon />;
    case CheckResultCode.skip:
      return <CheckResultCodeSkipIcon />;
  }
}

export function CheckIcon({
  code,
  withTooltip = true,
}: {
  code: CheckResultCode;
  withTooltip?: boolean;
}) {
  const tooltipText = text(code);
  const Icon = icon(code);

  if (!withTooltip) {
    return Icon;
  }

  return <Tooltip trigger={Icon} children={tooltipText} />;
}
