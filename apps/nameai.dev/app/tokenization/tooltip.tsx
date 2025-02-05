import { Transition } from "@headlessui/react";
import cc from "classcat";
import React, { useState } from "react";

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  placement?: "top" | "right" | "bottom" | "left";
};

export function Tooltip({
  children,
  content,
  className,
  placement = "top",
}: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cc(["relative inline-block", className])}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <Transition
        show={isHovered}
        as="div"
        className={cc([
          "absolute z-50 px-4 py-2 text-sm font-medium text-white bg-black rounded-md whitespace-nowrap max-w-[400px]",
          "transition duration-200",
          placement === "top" &&
            "-top-2 left-1/2 -translate-x-1/2 -translate-y-full",
          placement === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
          placement === "left" && "right-full top-1/2 -translate-y-1/2 -mr-2",
          placement === "right" && "left-full top-1/2 -translate-y-1/2 ml-2",
        ])}
        data-closed="opacity-0 scale-95"
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {/* Arrow */}
        <div
          className={cc([
            "absolute w-2 h-2 bg-black rotate-45",
            placement === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
            placement === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
            placement === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
            placement === "right" && "left-[-4px] top-1/2 -translate-y-1/2",
          ])}
        />
        {content}
      </Transition>
    </div>
  );
}
