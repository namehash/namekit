import React from "react";
import cc from "classcat";

export interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "underline";
  size?: "xsmall" | "small" | "medium" | "large";
  asChild?: boolean;
}

interface LinkComponent extends React.FC<LinkProps> {
  ExternalIcon: typeof ExternalIcon;
}

const linkBaseClasses = "nk-transition cursor-pointer";

const variantClasses = {
  primary:
    "nk-text-current nk-underline nk-decoration-transparent hover:nk-decoration-current sm:nk-underline-offset-[4px] sm:nk-transition-all sm:nk-duration-200 sm:hover:nk-underline-offset-[2px]",
  secondary: "nk-text-gray-500 hover:nk-text-black",
  ghost:
    "nk-text-current nk-underline nk-decoration-transparent sm:nk-transition-all sm:nk-duration-200",
  underline:
    "nk-text-current nk-underline nk-decoration-current sm:nk-underline-offset-[4px] sm:nk-transition-all sm:nk-duration-200 sm:hover:nk-underline-offset-[2px]",
};

const sizeClasses = {
  xsmall: "nk-text-xs",
  small: "nk-text-sm",
  medium: "nk-text-base",
  large: "nk-text-lg",
};

const isInternalLink = (href: string | undefined) => {
  if (!href) return false;
  return href.startsWith("/") || href.startsWith("#") || !href.includes("://");
};

export const ExternalIcon: React.FC = () => <span> ↗ </span>;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      asChild,
      className,
      variant = "primary",
      size = "medium",
      children,
      ...props
    },
    ref,
  ) => {
    const combinedClassName = cc([
      linkBaseClasses,
      variantClasses[variant],
      sizeClasses[size],
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
      <a ref={ref} className={combinedClassName} {...props}>
        {children}
      </a>
    );
  },
);

Link.displayName = "Link";
