import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva(
  ["flex border font-medium leading-6 transition cursor-pointer shadow-sm"],
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
        small: ["text-sm", "py-1.5", "px-3", "rounded-md"],
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  ...props
}) => <button className={button({ variant, size, className })} {...props} />;
