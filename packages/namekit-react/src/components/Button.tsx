import React from "react";
import cc from "classcat";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  padding?: string;
  loading?: boolean;
}

const buttonAsChildClass = "nk-button-as-child";

const buttonBaseClasses =
  "nk-transition nk-text-base nk-rounded-lg nk-border nk-font-medium nk-inline-flex nk-gap-2 nk-items-center nk-whitespace-nowrap nk-underline-none";

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
      disabled,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      primary: cc([
        "nk-bg-black nk-text-white nk-border-black",
        disabled ? "nk-opacity-50" : "hover:nk-bg-mine-shaft",
      ]),
      secondary: cc([
        "nk-bg-white nk-text-black nk-border-alto nk-shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
        disabled ? "nk-opacity-50" : "hover:nk-bg-gray-50",
      ]),
      ghost: cc([
        "nk-text-black nk-border-transparent ",
        disabled ? "nk-opacity-50" : "hover:nk-bg-black/5",
      ]),
    };

    const combinedClassName = cc([
      "nk-button",
      buttonBaseClasses,
      variantClasses[variant],
      defaultSizeClasses[size],
      asChild && buttonAsChildClass,
      "nk-relative",
      className,
    ]);

    const content = (
      <>
        <span className={loading ? "nk-opacity-0" : undefined}>{children}</span>
        {loading && (
          <div className="nk-absolute nk-inset-0 nk-flex nk-items-center nk-justify-center">
            <Spinner />
          </div>
        )}
      </>
    );

    if (asChild) {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...props,
            ...child.props,
            disabled,
            className: cc([combinedClassName, child.props.className]),
            ref,
          });
        }
        return child;
      });
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

const Spinner = () => (
  <svg className="nk-animate-spin nk-h-5 nk-w-5" viewBox="0 0 24 24">
    <circle
      className="nk-opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="nk-opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
