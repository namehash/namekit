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
    href: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    href: "https://namekit.io",
    children: "Primary Medium Link",
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    href: "https://namekit.io",
    children: "Secondary Medium Link",
  },
};

export const UnderlineMedium: Story = {
  args: {
    variant: "underline",
    size: "medium",
    href: "https://namekit.io",
    children: "Underline Medium Link",
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    href: "https://namekit.io",
    children: "Primary Small Link",
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: "secondary",
    size: "small",
    href: "https://namekit.io",
    children: "Secondary Small Link",
  },
};

export const UnderlineSmall: Story = {
  args: {
    variant: "underline",
    size: "small",
    href: "https://namekit.io",
    children: "Underline Small Link",
  },
};
export const PrimaryXSmall: Story = {
  args: {
    variant: "primary",
    size: "xsmall",
    href: "https://namekit.io",
    children: "Primary Extra Small Link",
  },
};

export const SecondaryXSmall: Story = {
  args: {
    variant: "secondary",
    size: "xsmall",
    href: "https://namekit.io",
    children: "Secondary Extra Small Link",
  },
};

export const UnderlineXSmall: Story = {
  args: {
    variant: "underline",
    size: "xsmall",
    href: "https://namekit.io",
    children: "Underline Extra Small Link",
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: "primary",
    size: "large",
    href: "https://namekit.io",
    children: "Primary Large Link",
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: "secondary",
    size: "large",
    href: "https://namekit.io",
    children: "Secondary Large Link",
  },
};

export const UnderlineLarge: Story = {
  args: {
    variant: "underline",
    size: "large",
    href: "https://namekit.io",
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
    href: "https://namekit.io",
    children: "Custom Class Link",
    className: "custom-class-name",
  },
};

export const AsChild: Story = {
  args: {
    variant: "primary",
    href: "https://namekit.io",
    children: <span>Hello world</span>,
    asChild: true,
  },
};

export const CurrentColor: Story = {
  args: {
    variant: "primary",
    children: (
      <span style={{ color: "green" }}>
        External Link
        <Link.ExternalIcon />
      </span>
    ),
    asChild: true,
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
