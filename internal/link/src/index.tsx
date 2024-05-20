import Link from "next/link";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const linkStyles = cva(
  ["border font-medium leading-6 transition cursor-pointer shadow-sm"],
  {
    variants: {
      variant: {
        primary: ["bg-black", "text-white", "hover:bg-gray-900"],
        secondary: [
          "bg-white",
          "text-black",
          "border-gray-300",
          "hover:bg-gray-100",
        ],
      },
      size: {
        small: ["text-sm", "py-1", "px-2", "rounded-md"],
        medium: ["text-base", "py-2.5", "px-5", "rounded-lg"],
      },
    },
    compoundVariants: [
      // {
      //   variant: "primary",
      //   size: "medium",
      //   className: "w-full md:w-auto text-center"
      // },
    ],
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkStyles> {}

export const StyledLink: React.FC<LinkProps> = ({
  className,
  variant,
  size,
  ...props
}) => <a className={linkStyles({ variant, size, className })} {...props} />;

export const NextLink: React.FC<LinkProps & { href: string }> = ({
  href,
  className,
  variant,
  size,
  ...props
}) => (
  <Link
    href={href}
    className={linkStyles({ variant, size, className })}
    {...props}
  />
);
