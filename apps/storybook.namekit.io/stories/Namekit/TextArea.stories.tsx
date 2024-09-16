import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "@namehash/namekit-react";

const meta: Meta<typeof TextArea> = {
  title: "UI/TextArea",
  component: TextArea,
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
    placeholder: { control: "text" },
    rows: { control: "number" },
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    placeholder: "Primary Medium Textarea",
    rows: 4,
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    placeholder: "Secondary Medium Textarea",
    rows: 4,
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    placeholder: "Primary Small Textarea",
    rows: 3,
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: "secondary",
    size: "small",
    placeholder: "Secondary Small Textarea",
    rows: 3,
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: "primary",
    size: "large",
    placeholder: "Primary Large Textarea",
    rows: 5,
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: "secondary",
    size: "large",
    placeholder: "Secondary Large Textarea",
    rows: 5,
  },
};

export const CustomClass: Story = {
  args: {
    variant: "primary",
    size: "medium",
    placeholder: "Custom Class Textarea",
    className: "custom-class-name",
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "medium",
    value: "Disabled Textarea",
    rows: 4,
    disabled: true,
  },
};
