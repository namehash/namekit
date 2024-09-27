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
  "nk-h-full nk-justify-center nk-flex nk-items-center nk-select-none";

const slotColorClasses = {
  primary: "nk-text-gray-500",
  secondary: "nk-text-black",
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
  const generatedId = useId();
  const inputId = id || generatedId;

  const slotClassName = cc([slotBaseClasses, slotColorClasses[variant]]);

  const hasSlot = React.Children.toArray(children).some(
    (child: any) => child.type === Input.Slot,
  );

  const variantClasses = {
    primary: cc([
      "nk-text-black nk-border-gray-300 nk-shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:nk-border-gray-400 has-[input:focus]:nk-border-gray-600 has-[input:focus:hover]:nk-border-gray-600",
      disabled ? "nk-text-gray-500 nk-bg-gray-50" : "nk-bg-white",
    ]),
    secondary: [
      "nk-border-gray-200 hover:nk-border-gray-300 has-[input:focus]:nk-border-gray-400 has-[input:focus:hover]:nk-border-gray-400",
      disabled ? "nk-text-gray-500 nk-bg-gray-200" : "nk-bg-gray-100",
    ],
  };

  const combinedClassName = cc([
    wrapperClasses,
    variantClasses[variant],
    sizeClasses[inputSize],
    className,
    {
      "nk-border-red-300": !!error,
    },
  ]);

  const inputClasses = cc([
    "nk-ring-0 focus:nk-outline-none nk-w-full h-full placeholder:nk-text-gray-500 nk-bg-transparent nk-border-red-300  nk-flex-1",
    hasSlot && slotPosition === "left" ? "nk-pl-2" : "nk-pr-2",
  ]);

  return (
    <div className="nk-gap-1">
      <div className={combinedClassName}>
        {hasSlot && slotPosition === "left" && (
          <label htmlFor={inputId} className={slotClassName}>
            {children}
          </label>
        )}
        <input
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        {hasSlot && slotPosition === "right" && (
          <label htmlFor={inputId} className={slotClassName}>
            {children}
          </label>
        )}
      </div>
      {error && (
        <span className="nk-mt-2 nk-text-sm nk-font-normal nk-text-red-600">
          {error}
        </span>
      )}
    </div>
  );
};

Input.Slot = ({ children }: SlotProps) => {
  return children;
};
