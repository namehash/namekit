import * as React from "react";
import cc from "classcat";
import { checkResultCodeTextColor } from "../../utils/colors";
import { CheckResultCode } from "@namehash/nameguard";

export const CheckResultCodeSkipIcon = ({
  isInteractive = false,
  onClick = () => {},
  className = "",
}) => (
  <svg
    onClick={onClick}
    className={cc([
      className,
      "w-[12px] h-[10px] fill-current transition",
      checkResultCodeTextColor(CheckResultCode.skip, isInteractive),
    ])}
    viewBox="0 0 12 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0.23017 8.70938C-0.0684091 8.99647 -0.0777185 9.47125 0.209377 9.76983C0.496472 10.0684 0.971254 10.0777 1.26983 9.79063L5.76983 5.54062C5.91689 5.39922 6 5.20401 6 5C6 4.79599 5.91689 4.60078 5.76983 4.45938L1.26983 0.209376C0.971253 -0.077719 0.496471 -0.0684092 0.209376 0.230169C-0.0777189 0.528748 -0.0684095 1.00353 0.230169 1.29063L4.16792 5L0.23017 8.70938Z" />
    <path d="M6.23017 8.70938C5.93159 8.99647 5.92228 9.47125 6.20938 9.76983C6.49647 10.0684 6.97125 10.0777 7.26983 9.79063L11.7698 5.54062C11.9169 5.39922 12 5.20401 12 5C12 4.79599 11.9169 4.60078 11.7698 4.45938L7.26983 0.209376C6.97125 -0.077719 6.49647 -0.0684092 6.20938 0.230169C5.92228 0.528748 5.93159 1.00353 6.23017 1.29063L10.1679 5L6.23017 8.70938Z" />
  </svg>
);
