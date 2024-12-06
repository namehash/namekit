import React, { useId } from "react";
import cc from "classcat";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  variant?: "primary" | "secondary";
  inputSize?: "small" | "medium" | "large";
  slotPosition?: "left" | "right";
  error?: string;
  disabled?: boolean;
}

interface SlotProps {
  children: React.ReactNode;
}

const wrapperClasses =
  "nk-group nk-flex nk-relative nk-w-full nk-rounded-md nk-border nk-shadow-sm nk-transition-colors nk-flex nk-items-center";

const sizeClasses = {
  small: "nk-py-1 nk-px-2 nk-text-sm",
  medium: "nk-py-2 nk-px-3.5",
  large: "nk-py-3 nk-px-6 nk-text-lg",
};

const slotBaseClasses =
  "nk-h-full nk-justify-center nk-flex nk-items-center nk-select-none nk-cursor-text";

const slotColorClasses = {
  primary: "nk-text-gray-500",
  secondary: "nk-text-black",
};

const getVariantClasses = (
  variant: "primary" | "secondary",
  disabled: boolean,
) => {
  const baseClasses = {
    primary:
      "nk-text-black nk-border-gray-300 nk-shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] has-[input:focus]:nk-border-gray-600 has-[input:focus:hover]:nk-border-gray-600",
    secondary:
      "nk-border-gray-200 has-[input:focus]:nk-border-gray-400 has-[input:focus:hover]:nk-border-gray-400",
  };

  const stateClasses = disabled
    ? {
        primary: "nk-text-gray-500 nk-bg-gray-50 nk-cursor-default",
        secondary: "nk-text-gray-500 nk-bg-gray-200 nk-cursor-default",
      }
    : {
        primary: "nk-bg-white hover:nk-border-gray-400 nk-cursor-text",
        secondary: "nk-bg-gray-100 hover:nk-border-gray-300 nk-cursor-text",
      };

  return cc([baseClasses[variant], stateClasses[variant]]);
};

export const Input: React.FC<InputProps> & { Slot: React.FC<SlotProps> } = ({
  className,
  variant = "primary",
  inputSize = "medium",
  slotPosition = "left",
  disabled = false,
  children,
  error,
  id,
  ...props
}) => {
  const inputId = id || useId();
  const slotClassName = cc([slotBaseClasses, slotColorClasses[variant]]);
  const hasSlot = React.Children.toArray(children).some(
    (child: any) => child.type === Input.Slot,
  );

  const combinedClassName = cc([
    wrapperClasses,
    getVariantClasses(variant, disabled),
    sizeClasses[inputSize],
    className,
    {
      "nk-border-red-300 hover:nk-border-red-600 has-[input:focus]:nk-border-red-600 has-[input:focus:hover]:nk-border-red-600":
        !!error,
    },
  ]);

  const inputClasses = cc([
    "nk-ring-0 nk-p-0 focus:nk-outline-none focus:nk-ring-0 focus:nk-ring-offset-0 nk-w-full h-full placeholder:nk-text-gray-500 nk-bg-transparent nk-outline-none nk-border-0 nk-flex-1",
    hasSlot && slotPosition === "left" ? "nk-pl-2" : "nk-pr-2",
  ]);

  const renderSlot = (position: "left" | "right") => {
    if (hasSlot && slotPosition === position) {
      return (
        <label htmlFor={inputId} className={slotClassName}>
          {children}
        </label>
      );
    }
    return null;
  };

  return (
    <div className="nk-gap-1">
      <div className={combinedClassName}>
        {renderSlot("left")}
        <input
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        {renderSlot("right")}
      </div>
      {error && (
        <span className="nk-mt-2 nk-text-sm nk-font-normal nk-text-red-600">
          {error}
        </span>
      )}
    </div>
  );
};

Input.Slot = ({ children }: SlotProps) => children;
