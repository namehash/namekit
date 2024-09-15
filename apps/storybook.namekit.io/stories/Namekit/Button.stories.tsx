import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, Link } from "@namehash/namekit-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
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
    children: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Primary Medium Button",
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    children: "Secondary Medium Button",
  },
};

export const GhostMedium: Story = {
  args: {
    variant: "ghost",
    size: "medium",
    children: "Ghost Medium Button",
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: "Primary Small Button",
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: "secondary",
    size: "small",
    children: "Secondary Small Button",
  },
};

export const GhostSmall: Story = {
  args: {
    variant: "ghost",
    size: "small",
    children: "Ghost Small Button",
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: "primary",
    size: "large",
    children: "Primary Large Button",
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: "secondary",
    size: "large",
    children: "Secondary Large Button",
  },
};

export const GhostLarge: Story = {
  args: {
    variant: "ghost",
    size: "large",
    children: "Secondary Large Button",
  },
};

export const CustomClass: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Custom Class Button",
    className: "custom-class-name",
  },
};

export const AsChild: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: <a href="https://namekit.io">Button with regular a tag</a>,
    asChild: true,
  },
};

export const LinkAsChild: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: <Link href="https://namekit.io">Button with Link component</Link>,
    asChild: true,
  },
};
