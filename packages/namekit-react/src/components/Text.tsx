import React from "react";
import cc from "classcat";

export interface TextProps {
  as?: "p" | "span" | "div" | "strong" | "em" | "label";
  asChild?: React.ReactElement;
  className?: string;
  children?: React.ReactNode;
}

const textBaseClasses = {
  p: "nk-text-base",
  span: "nk-text-base",
  div: "nk-text-base",
  strong: "nk-text-base nk-font-bold",
  em: "nk-text-base nk-font-italic",
  label: "nk-text-base nk-font-medium",
};

export const Text: React.FC<TextProps> = ({
  as = "p",
  asChild,
  children,
  className,
  ...props
}) => {
  const Tag = as;
  const combinedClassName = cc([textBaseClasses[as], className]);

  if (asChild) {
    const childProps = {
      ...props,
      ...asChild.props,
      className: cc([textBaseClasses[as], className, asChild.props.className]),
    };

    return React.cloneElement(asChild, childProps, children);
  }

  return (
    <Tag className={combinedClassName} {...props}>
      {children}
    </Tag>
  );
};
