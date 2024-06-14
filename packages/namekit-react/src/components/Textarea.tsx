import React from "react";
import cc from "classcat";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

const textareaBaseClasses = "nk-rounded nk-border nk-shadow-sm";

const variantClasses = {
  primary: "nk-bg-white nk-text-black nk-border-gray-300",
  secondary: "nk-border-gray-200 nk-bg-gray-100",
};

const sizeClasses = {
  small: "nk-py-1 nk-px-2 nk-text-sm",
  medium: "nk-py-2 nk-px-4",
  large: "nk-py-3 nk-px-6 nk-text-lg",
};

export const Textarea: React.FC<TextareaProps> = ({
  className,
  variant = "primary",
  size = "medium",
  ...props
}) => {
  const combinedClassName = cc([
    textareaBaseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]);

  return <textarea className={combinedClassName} {...props} />;
};
