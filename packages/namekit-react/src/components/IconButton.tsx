import React from "react";
import { ButtonProps } from "./Button";
import cc from "classcat";

export interface IconButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const buttonAsChildClass = "nk-button-as-child";

const buttonBaseClasses =
  "nk-transition nk-text-base nk-rounded-lg nk-border nk-font-medium nk-flex nk-gap-2 nk-items-center nk-justify-center nk-whitespace-nowrap nk-underline-none";

const variantClasses = {
  primary: "nk-bg-black nk-text-white nk-border-black hover:nk-bg-mine-shaft",
  secondary:
    "nk-bg-white nk-text-black nk-border-alto nk-shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:nk-bg-gray-50",
  ghost: "nk-text-black nk-border-transparent hover:nk-bg-black/5",
};

const defaultSizeClasses = {
  small: "nk-py-1 nk-px-1 nk-text-sm",
  medium: "nk-py-2 nk-px-2",
  large: "nk-py-3 nk-px-3 nk-text-lg",
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      asChild,
      className,
      children,
      variant = "primary",
      size = "medium",
      padding,
      ...props
    },
    ref,
  ) => {
    const combinedClassName = cc([
      "nk-iconbutton",
      buttonBaseClasses,
      variantClasses[variant],
      defaultSizeClasses[size],
      asChild && buttonAsChildClass,
      className,
    ]);

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
