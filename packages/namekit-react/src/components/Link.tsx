import React from "react";
import cc from "classcat";

export interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  className?: string;
  variant?: "primary" | "secondary" | "underline";
  size?: "xsmall" | "small" | "medium" | "large";
  asChild?: boolean;
}

const linkBaseClasses = "nk-transition nk-cursor-pointer";

const variantClasses = {
  primary:
    "nk-text-current nk-underline nk-decoration-transparent hover:nk-decoration-current sm:nk-underline-offset-[4px] sm:nk-transition-all sm:nk-duration-200 sm:hover:nk-underline-offset-[2px]",
  secondary: "nk-text-gray-500 hover:nk-text-black",
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

interface LinkComponent
  extends React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  > {
  ExternalIcon: typeof ExternalIcon;
}

const LinkInner = React.forwardRef<HTMLAnchorElement, LinkProps>(
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
    const isExternal = !isInternalLink(props.href);
    const isButtonChild = className?.includes("nk-button-as-child");

    const combinedClassName = cc([
      linkBaseClasses,
      !isButtonChild && variantClasses[variant],
      !isButtonChild && sizeClasses[size],
      className,
    ]);

    const enhancedProps = {
      ...props,
      ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    };

    const enhancedChildren = isExternal
      ? React.Children.map(children, (child) =>
          React.isValidElement(child) && child.type === ExternalIcon
            ? child
            : child,
        )
      : children;

    if (asChild) {
      return React.Children.map(enhancedChildren, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...enhancedProps,
            ...child.props,
            className: cc([combinedClassName, child.props.className]),
            ref,
          });
        }
        return child;
      });
    }

    return (
      <a ref={ref} className={combinedClassName} {...enhancedProps}>
        {enhancedChildren}
      </a>
    );
  },
);

LinkInner.displayName = "Link";

export const Link = LinkInner as LinkComponent;
Link.ExternalIcon = ExternalIcon;
