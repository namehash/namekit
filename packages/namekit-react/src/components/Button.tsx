import React from "react";
import cc from "classcat";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
  padding?: string;
}

const buttonAsChildClass = "nk-button-as-child";

const buttonBaseClasses =
  "nk-transition nk-text-base nk-rounded-lg nk-border nk-font-medium nk-flex nk-gap-2 nk-items-center nk-justify-center nk-whitespace-nowrap nk-underline-none";

const variantClasses = {
  primary: "nk-bg-black nk-text-white nk-border-black hover:nk-bg-mine-shaft",
  secondary:
    "nk-bg-white nk-text-black nk-border-alto nk-shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:nk-bg-gray-50",
  ghost: "nk-text-black nk-border-transparent hover:nk-bg-black/5",
};

const defaultSizeClasses = {
  small: "nk-py-1 nk-px-2 nk-text-sm",
  medium: "nk-py-2 nk-px-4",
  large: "nk-py-3 nk-px-6 nk-text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      children,
      variant = "primary",
      size = "medium",
      padding,
      ...props
    },
    ref,
  ) => {
    const combinedClassName = cc([
      buttonBaseClasses,
      variantClasses[variant],
      padding || defaultSizeClasses[size],
      asChild && buttonAsChildClass,
      className,
    ]);

    if (asChild) {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...props,
            ...child.props,
            className: cc([combinedClassName, child.props.className]),
            ref,
          });
        }
        return child;
      });
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
