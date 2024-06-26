import React from "react";
import cc from "classcat";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  variant?: "primary" | "secondary";
  inputSize?: "small" | "medium" | "large";
  slotPosition?: "left" | "right";
}

interface SlotProps {
  children: React.ReactNode;
}

const wrapperClasses =
  "nk-flex nk-relative nk-w-full nk-rounded-md nk-border nk-shadow-sm nk-transition-colors";

const variantClasses = {
  primary:
    "nk-bg-white nk-text-black nk-border-gray-300 nk-shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] has-[input:hover]:nk-border-gray-400 has-[input:focus]:nk-border-gray-600 has-[input:focus:hover]:nk-border-gray-600",
  secondary:
    "nk-border-gray-200 nk-bg-gray-100 has-[input:hover]:nk-border-gray-300 has-[input:focus]:nk-border-gray-400 has-[input:focus:hover]:nk-border-gray-400",
};

const sizeClasses = {
  small: "nk-py-1 nk-px-2 nk-text-sm",
  medium: "nk-py-2 nk-px-3.5",
  large: "nk-py-3 nk-px-6 nk-text-lg",
};

const slotBaseClasses = "nk-h-full nk-justify-center nk-flex nk-items-center";

const slotColorClasses = {
  primary: "nk-text-gray-500",
  secondary: "nk-text-black",
};

export const Input: React.FC<InputProps> & { Slot: React.FC<SlotProps> } = ({
  className,
  variant = "primary",
  inputSize = "medium",
  slotPosition = "left",
  children,
  ...props
}) => {
  const slotClassName = cc([slotBaseClasses, slotColorClasses[variant]]);

  const hasSlot = React.Children.toArray(children).some(
    (child: any) => child.type === Input.Slot,
  );

  const combinedClassName = cc([
    wrapperClasses,
    variantClasses[variant],
    sizeClasses[inputSize],
    className,
  ]);

  const inputClasses = cc([
    "nk-ring-0 focus:nk-outline-none nk-w-full h-full placeholder:nk-text-gray-500 nk-bg-transparent",
    hasSlot && slotPosition === "left" ? "nk-pl-2" : "nk-pr-2",
  ]);

  return (
    <div className={combinedClassName}>
      {hasSlot && slotPosition === "left" && (
        <div className={slotClassName}>{children}</div>
      )}
      <input className={inputClasses} {...props} />
      {hasSlot && slotPosition === "right" && (
        <div className={slotClassName}>{children}</div>
      )}
    </div>
  );
};

Input.Slot = ({ children }: SlotProps) => {
  return children;
};
