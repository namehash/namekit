import React from "react";
import cc from "classcat";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: React.ReactElement;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
}

const buttonBaseClasses =
  "nk-transition nk-text-base nk-rounded-lg nk-border nk-font-medium nk-flex nk-gap-2 nk-items-center nk-justify-center nk-whitespace-nowrap nk-underline-none";

const variantClasses = {
  primary: "nk-bg-black nk-text-white nk-border-black hover:nk-bg-mine-shaft",
  secondary:
    "nk-bg-white nk-text-black nk-border-alto nk-shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:nk-bg-gray-50",
  ghost: "nk-text-black nk-border-transparent hover:nk-bg-black/5",
};

const sizeClasses = {
  small: "nk-py-1 nk-px-2 nk-text-sm",
  medium: "nk-py-2 nk-px-4",
  large: "nk-py-3 nk-px-6 nk-text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  asChild,
  className,
  children,
  variant = "primary",
  size = "medium",
  ...props
}) => {
  const combinedClassName = cc([
    buttonBaseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]);

  if (asChild) {
    const childProps = {
      ...props,
      ...asChild.props,
      className: cc([
        buttonBaseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
        asChild.props.className,
      ]),
    };

    return React.cloneElement(asChild, childProps, children);
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
