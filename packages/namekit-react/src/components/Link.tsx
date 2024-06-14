import React from "react";
import cc from "classcat";

export interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  className?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  asChild?: React.ReactElement;
}

const linkBaseClasses = "";

const variantClasses = {
  primary:
    "nk-text-black nk-underline sm:nk-underline-offset-[4px] sm:nk-transition-all sm:nk-duration-200 sm:hover:nk-underline-offset-[2px]",
  secondary: "nk-text-black",
};

const sizeClasses = {
  small: "nk-py-1 nk-px-2 nk-text-sm",
  medium: "nk-py-2 nk-px-4",
  large: "nk-py-3 nk-px-6 nk-text-lg",
};

export const Link: React.FC<LinkProps> = ({
  asChild,
  className,
  variant = "primary",
  size = "medium",
  ...props
}) => {
  const combinedClassName = cc([
    linkBaseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]);

  if (asChild) {
    const childProps = {
      ...props,
      ...asChild.props,
      className: cc([
        linkBaseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
        asChild.props.className,
      ]),
    };

    return React.cloneElement(asChild, childProps);
  }

  return <a className={combinedClassName} {...props} />;
};
