import React from "react";
import cc from "classcat";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  error?: string;
  disabled?: boolean;
}

const textareaBaseClasses =
  "nk-rounded-md nk-border nk-shadow-sm nk-ring-0 focus:nk-outline-none nk-transition-colors w-full";

const sizeClasses = {
  small: "nk-py-1 nk-px-2 nk-text-sm",
  medium: "nk-py-2 nk-px-3.5",
  large: "nk-py-3 nk-px-6 nk-text-lg",
};

const getVariantClasses = (
  variant: "primary" | "secondary",
  disabled: boolean,
) => {
  const baseClasses = {
    primary:
      "nk-text-black nk-border-gray-300 nk-shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] focus:nk-border-gray-600 focus:hover:nk-border-gray-600 placeholder:nk-text-gray-500",
    secondary:
      "nk-border-gray-200 focus:nk-border-gray-400 focus:hover:nk-border-gray-400",
  };

  const stateClasses = disabled
    ? {
        primary: "nk-bg-gray-50 nk-text-gray-500",
        secondary: "nk-bg-gray-200 nk-text-gray-500",
      }
    : {
        primary: "nk-bg-white hover:nk-border-gray-400",
        secondary: "nk-bg-gray-100 hover:nk-border-gray-300",
      };

  return cc([baseClasses[variant], stateClasses[variant]]);
};

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  variant = "primary",
  size = "medium",
  error,
  disabled = false,
  ...props
}) => {
  const combinedClassName = cc([
    textareaBaseClasses,
    getVariantClasses(variant, disabled),
    sizeClasses[size],
    {
      "nk-border-red-300 hover:nk-border-red-600 focus:nk-border-red-600 focus:hover:nk-border-red-600":
        error,
    },
    className,
  ]);

  return (
    <div className="nk-flex nk-flex-col">
      <textarea className={combinedClassName} disabled={disabled} {...props} />
      {error && (
        <span className="nk-mt-2 nk-text-sm nk-font-normal nk-text-red-600">
          {error}
        </span>
      )}
    </div>
  );
};
