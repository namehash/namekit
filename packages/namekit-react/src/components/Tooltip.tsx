import { Float } from "@headlessui-float/react";
import { Popover } from "@headlessui/react";
import React, { useState } from "react";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  maxTooltipWidth?: number;
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
  trigger,
  children,
  placement = DEFAULT_TOOLTIP_PLACEMENT,
  maxTooltipWidth = DEFAULT_MAX_TOOLTIP_WIDTH,

  /*
    Props are applied to the Float component,
    which is a wrapper for the tooltip "children".
  */
  ...props
}: Props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Popover className="nk-flex nk-items-center">
      <Float
        show={open}
        placement={placement} // our `TooltipPlacement` values are a subset of headlessui's `Placement` values
        offset={15}
        shift={6}
        flip={10}
        arrow
        portal
        enter="nk-transition nk-duration-200 nk-ease-out"
        enterFrom="nk-opacity-0 nk--translate-y-1"
        enterTo="nk-opacity-100 nk-translate-y-0"
        leave="nk-transition nk-duration-150 nk-ease-in"
        leaveFrom="nk-opacity-100 nk-translate-y-0"
        leaveTo="nk-opacity-0 nk--translate-y-1"
        {...props}
      >
        <Popover.Group
          onClick={handleOpen}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          className="nk-cursor-auto"
        >
          {trigger}
        </Popover.Group>

        <Popover.Panel
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          style={{ maxWidth: maxTooltipWidth }}
          className="nk-rounded-md nk-bg-black focus:nk-outline-none"
        >
          <Float.Arrow className="nk-absolute nk-h-5 nk-w-5 nk-rotate-45 nk-bg-black nk-rounded-b" />
          <div className="nk-relative nk-h-full nk-rounded-md nk-text-sm nk-font-medium nk-text-white nk-py-2 nk-px-4">
            {children}
          </div>
        </Popover.Panel>
      </Float>
    </Popover>
  );
}
