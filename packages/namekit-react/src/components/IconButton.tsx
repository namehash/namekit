import React from "react";
import { Button, ButtonProps } from "./Button";
import cc from "classcat";

export interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconPosition = "left",
  children,
  className,
  ...props
}) => {
  const combinedClassName = cc([
    "nk-inline-flex nk-gap-2.5 nk-items-center",
    className,
  ]);

  return (
    <Button className={combinedClassName} {...props}>
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </Button>
  );
};
