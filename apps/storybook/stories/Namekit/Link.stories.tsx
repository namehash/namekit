import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "@namehash/namekit-react";

const meta: Meta<typeof Link> = {
  title: "UI/Link",
  component: Link,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["primary", "secondary"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["small", "medium", "large"],
      },
    },
    className: { control: "text" },
    href: { control: "text" },
    target: { control: "text" },
    rel: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    href: "#",
    children: "Primary Medium Link",
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    href: "#",
    children: "Secondary Medium Link",
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    href: "#",
    children: "Primary Small Link",
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: "secondary",
    size: "small",
    href: "#",
    children: "Secondary Small Link",
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: "primary",
    size: "large",
    href: "#",
    children: "Primary Large Link",
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: "secondary",
    size: "large",
    href: "#",
    children: "Secondary Large Link",
  },
};

export const CustomClass: Story = {
  args: {
    variant: "primary",
    size: "medium",
    href: "#",
    children: "Custom Class Link",
    className: "my-custom-class",
  },
};

export const AsChild: Story = {
  args: {
    variant: "primary",
    size: "medium",
    href: "#",
    children:
      "Link as a Span (which won't work, but is good for next/link instances)",
    asChild: <span />,
  },
};
