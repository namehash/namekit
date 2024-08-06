import React from "react";
import cc from "classcat";

export interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  className?: string;
  variant?: "primary" | "secondary" | "underline";
  size?: "small" | "medium" | "large";
  asChild?: React.ReactElement;
}

interface LinkComponent extends React.FC<LinkProps> {
  ExternalIcon: typeof ExternalIcon;
}

const linkBaseClasses = "nk-transition";

const variantClasses = {
  primary:
    "nk-text-current nk-underline nk-decoration-transparent hover:nk-decoration-current sm:nk-underline-offset-[4px] sm:nk-transition-all sm:nk-duration-200 sm:hover:nk-underline-offset-[2px]",
  secondary: "nk-text-gray-500 hover:nk-text-black",
  underline:
    "nk-text-current nk-underline nk-decoration-current sm:nk-underline-offset-[4px] sm:nk-transition-all sm:nk-duration-200 sm:hover:nk-underline-offset-[2px]",
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

export const ExternalIcon: React.FC = () => <span> ↗ </span>;

export const Link: LinkComponent = ({
  asChild,
  className,
  variant = "primary",
  size = "medium",
  children,
  ...props
}) => {
  const isExternal = !isInternalLink(props.href);

  const combinedClassName = cc([
    linkBaseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]);

  const enhancedProps = {
    ...props,
    ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}),
  };

  const enhancedChildren = isExternal
    ? React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === Link.ExternalIcon
          ? child
          : child,
      )
    : children;

  if (asChild) {
    const childProps = {
      ...enhancedProps,
      ...asChild.props,
      className: cc([
        linkBaseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
        asChild.props.className,
      ]),
    };

    return React.cloneElement(asChild, childProps, enhancedChildren);
  }

  return (
    <a className={combinedClassName} {...enhancedProps}>
      {enhancedChildren}
    </a>
  );
};

Link.ExternalIcon = ExternalIcon;
