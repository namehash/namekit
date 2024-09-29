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

export const ExternalIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    className="nk-fill-current nk-w-5 nk-h-5"
  >
    <path d="M11 3C10.4477 3 10 3.44772 10 4C10 4.55228 10.4477 5 11 5H13.5858L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L15 6.41421V9C15 9.55228 15.4477 10 16 10C16.5523 10 17 9.55228 17 9V4C17 3.44772 16.5523 3 16 3H11Z"></path>
    <path d="M5 5C3.89543 5 3 5.89543 3 7V15C3 16.1046 3.89543 17 5 17H13C14.1046 17 15 16.1046 15 15V12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12V15H5V7L8 7C8.55228 7 9 6.55228 9 6C9 5.44772 8.55228 5 8 5H5Z"></path>
  </svg>
);

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
