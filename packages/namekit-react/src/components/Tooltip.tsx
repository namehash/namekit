import React, { useId } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
};

export const DEFAULT_MAX_TOOLTIP_WIDTH = 400;

export const TooltipPlacement = {
  Top: "top",
  Right: "right",
  Bottom: "bottom",
  Left: "left",
} as const;

export type TooltipPlacement =
  (typeof TooltipPlacement)[keyof typeof TooltipPlacement];

export const DEFAULT_TOOLTIP_PLACEMENT = TooltipPlacement.Top;

export function Tooltip({
  children,
  placement = DEFAULT_TOOLTIP_PLACEMENT,
  trigger,
  /*
    Props are applied to the Float component,
    which is a wrapper for the tooltip "children".
  */
  ...props
}: Props) {
  const id = useId();

  return (
    <>
      <div data-tooltip-id={id}>{trigger}</div>
      <ReactTooltip
        id={id}
        clickable
        place={placement}
        opacity={1}
        delayHide={0}
        delayShow={0}
        className="!nk-z-50 !nk-bg-black !nk-rounded-[8px] !nk-p-0"
        openEvents={{ mouseenter: true, focus: true }}
        closeEvents={{ mouseleave: true, blur: true }}
        noArrow={false}
        arrowColor="black"
        {...props}
      >
        <div className="nk-relative nk-h-full nk-text-left nk-rounded-md nk-text-sm nk-font-medium nk-text-white nk-py-2 nk-px-4">
          {children}
        </div>
      </ReactTooltip>
    </>
  );
}
