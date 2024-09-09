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
        options: ["primary", "secondary", "underline"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["xsmall", "small", "medium", "large"],
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

export const UnderlineMedium: Story = {
  args: {
    variant: "underline",
    size: "medium",
    href: "#",
    children: "Underline Medium Link",
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

export const UnderlineSmall: Story = {
  args: {
    variant: "underline",
    size: "small",
    href: "#",
    children: "Underline Small Link",
  },
};
export const PrimaryXSmall: Story = {
  args: {
    variant: "primary",
    size: "xsmall",
    href: "#",
    children: "Primary Extra Small Link",
  },
};

export const SecondaryXSmall: Story = {
  args: {
    variant: "secondary",
    size: "xsmall",
    href: "#",
    children: "Secondary Extra Small Link",
  },
};

export const UnderlineXSmall: Story = {
  args: {
    variant: "underline",
    size: "xsmall",
    href: "#",
    children: "Underline Extra Small Link",
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

export const UnderlineLarge: Story = {
  args: {
    variant: "underline",
    size: "large",
    href: "#",
    children: "Underline Large Link",
  },
};

export const PrimaryExternal: Story = {
  args: {
    variant: "primary",
    href: "https://nameguard.io",
    children: "Primary External",
  },
};

export const SecondaryExternal: Story = {
  args: {
    variant: "secondary",
    href: "https://namekit.io",
    children: "Secondary External",
  },
};

export const CustomClass: Story = {
  args: {
    variant: "primary",
    href: "#",
    children: "Custom Class Link",
    className: "custom-class-name",
  },
};

export const AsChild: Story = {
  args: {
    variant: "primary",
    href: "#",
    children:
      "Link as a Span (which won't work, but is good for next/link instances)",
    asChild: <span />,
  },
};

export const CurrentColor: Story = {
  args: {
    variant: "primary",
    children: (
      <>
        External Link
        <Link.ExternalIcon />
      </>
    ),
    asChild: <span style={{ color: "green" }} />,
  },
};

export const ExternalLinkIconAfter: Story = {
  args: {
    variant: "primary",
    href: "https://namekit.io",
    children: (
      <>
        External Link
        <Link.ExternalIcon />
      </>
    ),
  },
};

export const ExternalLinkIconBefore: Story = {
  args: {
    variant: "primary",
    size: "medium",
    href: "https://namekit.io",
    children: (
      <>
        <Link.ExternalIcon />
        External Link
      </>
    ),
  },
};
