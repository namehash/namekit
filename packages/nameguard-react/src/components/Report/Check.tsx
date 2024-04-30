import React from "react";
import { CheckResultCode, Rating } from "@namehash/nameguard";
import { Tooltip } from "../Tooltip/Tooltip";
import cc from "classcat";
import { checkResultCodeTextColor } from "../../utils/text";

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
    default:
      return "Check Not Applicable";
  }
}

function icon(code: CheckResultCode): React.ReactNode {
  switch (code) {
    case CheckResultCode.pass:
      return (
        <svg
          className={cc([
            "w-5 h-5 fill-current transition cursor-pointer",
            checkResultCodeTextColor(CheckResultCode.pass, true),
          ])}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM13.8566 8.19113C14.1002 7.85614 14.0261 7.38708 13.6911 7.14345C13.3561 6.89982 12.8871 6.97388 12.6434 7.30887L9.15969 12.099L7.28033 10.2197C6.98744 9.92678 6.51256 9.92678 6.21967 10.2197C5.92678 10.5126 5.92678 10.9874 6.21967 11.2803L8.71967 13.7803C8.87477 13.9354 9.08999 14.0149 9.30867 13.9977C9.52734 13.9805 9.72754 13.8685 9.85655 13.6911L13.8566 8.19113Z"
          />
        </svg>
      );
    case CheckResultCode.warn:
      return (
        <svg
          className={cc([
            "w-5 h-5 fill-current transition cursor-pointer",
            checkResultCodeTextColor(CheckResultCode.warn, true),
          ])}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.4845 2.49499C9.15808 1.32833 10.842 1.32833 11.5156 2.495L17.7943 13.37C18.4678 14.5367 17.6259 15.995 16.2787 15.995H3.72136C2.37421 15.995 1.53224 14.5367 2.20582 13.37L8.4845 2.49499ZM10 5C10.4142 5 10.75 5.33579 10.75 5.75V9.25C10.75 9.66421 10.4142 10 10 10C9.58579 10 9.25 9.66421 9.25 9.25L9.25 5.75C9.25 5.33579 9.58579 5 10 5ZM10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14Z"
          />
        </svg>
      );
    case CheckResultCode.alert:
      return (
        <svg
          className={cc([
            "w-5 h-5 fill-current transition cursor-pointer",
            checkResultCodeTextColor(CheckResultCode.alert, true),
          ])}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.4845 2.49499C9.15808 1.32833 10.842 1.32833 11.5156 2.495L17.7943 13.37C18.4678 14.5367 17.6259 15.995 16.2787 15.995H3.72136C2.37421 15.995 1.53224 14.5367 2.20582 13.37L8.4845 2.49499ZM10 5C10.4142 5 10.75 5.33579 10.75 5.75V9.25C10.75 9.66421 10.4142 10 10 10C9.58579 10 9.25 9.66421 9.25 9.25L9.25 5.75C9.25 5.33579 9.58579 5 10 5ZM10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14Z"
          />
        </svg>
      );
    case CheckResultCode.info:
      return (
        <svg
          className={cc([
            "w-5 h-5 fill-current text-gray-400 hover:text-gray-500 transition cursor-pointer",
            checkResultCodeTextColor(CheckResultCode.info, true),
          ])}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM11 6C11 6.55228 10.5523 7 10 7C9.44771 7 9 6.55228 9 6C9 5.44772 9.44771 5 10 5C10.5523 5 11 5.44772 11 6ZM9 9C8.58579 9 8.25 9.33579 8.25 9.75C8.25 10.1642 8.58579 10.5 9 10.5H9.25338C9.41332 10.5 9.53213 10.6481 9.49743 10.8042L9.03829 12.8704C8.79542 13.9633 9.62706 15 10.7466 15H11C11.4142 15 11.75 14.6642 11.75 14.25C11.75 13.8358 11.4142 13.5 11 13.5H10.7466C10.5867 13.5 10.4679 13.3519 10.5026 13.1958L10.9617 11.1296C11.2046 10.0367 10.3729 9 9.25338 9H9Z"
          />
        </svg>
      );
    case CheckResultCode.skip:
    default:
      return (
        <svg
          className={cc([
            "w-[12px] h-[10px] fill-current transition cursor-pointer",
            checkResultCodeTextColor(CheckResultCode.skip, true),
          ])}
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0.23017 8.70938C-0.0684091 8.99647 -0.0777185 9.47125 0.209377 9.76983C0.496472 10.0684 0.971254 10.0777 1.26983 9.79063L5.76983 5.54062C5.91689 5.39922 6 5.20401 6 5C6 4.79599 5.91689 4.60078 5.76983 4.45938L1.26983 0.209376C0.971253 -0.077719 0.496471 -0.0684092 0.209376 0.230169C-0.0777189 0.528748 -0.0684095 1.00353 0.230169 1.29063L4.16792 5L0.23017 8.70938Z" />
          <path d="M6.23017 8.70938C5.93159 8.99647 5.92228 9.47125 6.20938 9.76983C6.49647 10.0684 6.97125 10.0777 7.26983 9.79063L11.7698 5.54062C11.9169 5.39922 12 5.20401 12 5C12 4.79599 11.9169 4.60078 11.7698 4.45938L7.26983 0.209376C6.97125 -0.077719 6.49647 -0.0684092 6.20938 0.230169C5.92228 0.528748 5.93159 1.00353 6.23017 1.29063L10.1679 5L6.23017 8.70938Z" />
        </svg>
      );
  }
}

export function Check({ code }: { code: CheckResultCode }) {
  const tooltipText = text(code);
  const Icon = icon(code);

  return <Tooltip trigger={Icon} children={tooltipText} />;
}
