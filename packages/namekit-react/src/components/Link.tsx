import React from "react";
import cc from "classcat";

export interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  className?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  asChild?: React.ReactElement;
}

const linkBaseClasses = "nk-transition";

const variantClasses = {
  primary:
    "nk-text-black nk-underline sm:nk-underline-offset-[4px] sm:nk-transition-all sm:nk-duration-200 sm:hover:nk-underline-offset-[2px]",
  secondary: "nk-text-gray-500 hover:nk-text-black",
};

const sizeClasses = {
  small: "nk-text-sm",
  medium: "nk-text-base",
  large: "nk-text-lg",
};

const isInternalLink = (href: string | undefined) => {
  if (!href) return false;
  return href.startsWith("/") || href.startsWith("#") || !href.includes("://");
};

export const Link: React.FC<LinkProps> = ({
  asChild,
  className,
  variant = "primary",
  size = "medium",
  children,
  ...props
}) => {
  const combinedClassName = cc([
    linkBaseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]);

  const enhancedChildren = !isInternalLink(props.href) ? (
    <>{children} ↗</>
  ) : (
    children
  );

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

  return (
    <a className={combinedClassName} {...props}>
      {enhancedChildren}
    </a>
  );
};
