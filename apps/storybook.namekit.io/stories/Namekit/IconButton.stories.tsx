import React, { SVGProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "@namehash/namekit-react";

const SomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.50065 6.04175H4.58398C3.54845 6.04175 2.70898 6.88121 2.70898 7.91675V15.4167C2.70898 16.4523 3.54845 17.2917 4.58398 17.2917H15.4173C16.4529 17.2917 17.2923 16.4523 17.2923 15.4167V7.91675C17.2923 6.88121 16.4529 6.04175 15.4173 6.04175H12.5007M12.5007 3.54175L10.0007 1.04175M10.0007 1.04175L7.50065 3.54175M10.0007 1.04175L10.0007 11.6667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: "UI/IconButton",
  component: IconButton,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["primary", "secondary", "ghost"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["small", "medium", "large"],
      },
    },
    children: {
      control: false,
    },
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: <SomeIcon style={{ height: "20px" }} />,
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    children: <SomeIcon style={{ height: "20px" }} />,
  },
};

export const GhostMedium: Story = {
  args: {
    variant: "ghost",
    size: "medium",
    children: <SomeIcon style={{ height: "20px" }} />,
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: <SomeIcon style={{ height: "16px" }} />,
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: "secondary",
    size: "small",
    children: <SomeIcon style={{ height: "16px" }} />,
  },
};

export const GhostSmall: Story = {
  args: {
    variant: "ghost",
    size: "small",
    children: <SomeIcon style={{ height: "16px" }} />,
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: "primary",
    size: "large",
    children: <SomeIcon style={{ height: "26px" }} />,
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: "secondary",
    size: "large",
    children: <SomeIcon style={{ height: "26px" }} />,
  },
};

export const CustomClass: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: <SomeIcon style={{ height: "26px" }} />,
    className: "custom-class-name",
  },
};
