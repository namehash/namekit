import React, { useState } from "react";
import { Float, type FloatProps } from "@headlessui-float/react";
import { Popover } from "@headlessui/react";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: FloatProps["placement"];
};

export function Tooltip({
  trigger,
  children,
  placement = "top",

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
    <Popover className="ng-flex ng-items-center ng-justify-center">
      <Float
        show={open}
        placement={placement}
        offset={15}
        shift={6}
        flip={10}
        arrow
        portal
        enter="ng-transition ng-duration-200 ng-ease-out"
        enterFrom="ng-opacity-0 ng--translate-y-1"
        enterTo="ng-opacity-100 ng-translate-y-0"
        leave="ng-transition ng-duration-150 ng-ease-in"
        leaveFrom="ng-opacity-100 ng-translate-y-0"
        leaveTo="ng-opacity-0 ng--translate-y-1"
        {...props}
      >
        <Popover.Group
          onClick={handleOpen}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          className="ng-cursor-auto"
        >
          {trigger}
        </Popover.Group>

        <Popover.Panel
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          className="ng-rounded-md ng-bg-black focus:ng-outline-none"
        >
          <Float.Arrow className="ng-absolute ng-h-5 ng-w-5 ng-rotate-45 ng-bg-black ng-rounded-b" />
          <div className="ng-relative ng-h-full ng-rounded-md ng-text-sm ng-font-medium ng-text-white ng-py-2 ng-px-4">
            {children}
          </div>
        </Popover.Panel>
      </Float>
    </Popover>
  );
}
