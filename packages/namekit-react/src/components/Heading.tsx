import React from "react";
import cc from "classcat";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  asChild?: React.ReactElement;
}

const headingBaseClasses = {
  h1: "nk-text-4xl nk-font-bold",
  h2: "nk-text-3xl nk-font-semibold",
  h3: "nk-text-2xl nk-font-semibold",
  h4: "nk-text-xl nk-font-medium",
  h5: "nk-text-lg nk-font-medium",
  h6: "nk-text-base nk-font-medium",
};

export const Heading: React.FC<HeadingProps> = ({
  as = "h1",
  asChild,
  children,
  className,
  ...props
}) => {
  const Tag = as;
  const combinedClassName = cc([headingBaseClasses[as], className]);

  if (asChild) {
    const childProps = {
      ...props,
      ...asChild.props,
      className: cc([
        headingBaseClasses[as],
        className,
        asChild.props.className,
      ]),
    };

    return React.cloneElement(asChild, childProps, children);
  }

  return (
    <Tag className={combinedClassName} {...props}>
      {children}
    </Tag>
  );
};
