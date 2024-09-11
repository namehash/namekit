import React from "react";
import { Button, ButtonProps } from "./Button";
import cc from "classcat";

export interface IconButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, ...props }, ref) => {
    const combinedClassName = cc([
      "nk-inline-flex nk-items-center nk-justify-center",
      className,
    ]);

    return (
      <Button ref={ref} className={combinedClassName} {...props}>
        {children}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
