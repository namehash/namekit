import React from "react";
import { Button, ButtonProps } from "./Button";
import cc from "classcat";

export interface IconButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const iconButtonSizeClasses = {
  small: "nk-p-1",
  medium: "nk-p-2",
  large: "nk-p-3",
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, size = "medium", ...props }, ref) => {
    const combinedClassName = cc([
      "nk-inline-flex nk-items-center nk-justify-center nk-p-2",
      iconButtonSizeClasses[size],
      className,
    ]);

    return (
      <Button
        ref={ref}
        className={combinedClassName}
        size={size}
        padding={iconButtonSizeClasses[size]}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
