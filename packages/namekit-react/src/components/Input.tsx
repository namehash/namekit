import React from "react";
import cc from "classcat";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  variant?: "primary" | "secondary";
  inputSize?: "small" | "medium" | "large";
}

const inputBaseClasses = "nk-rounded nk-border nk-shadow-sm";

const variantClasses = {
  primary: "nk-bg-white nk-text-black nk-border-gray-300",
  secondary: "nk-border-gray-200 nk-bg-gray-100",
};

const sizeClasses = {
  small: "nk-py-1 nk-px-2 nk-text-sm",
  medium: "nk-py-2 nk-px-4",
  large: "nk-py-3 nk-px-6 nk-text-lg",
};

export const Input: React.FC<InputProps> = ({
  className,
  variant = "primary",
  inputSize = "medium",
  ...props
}) => {
  const combinedClassName = cc([
    inputBaseClasses,
    variantClasses[variant],
    sizeClasses[inputSize],
    className,
  ]);

  return <input className={combinedClassName} {...props} />;
};
