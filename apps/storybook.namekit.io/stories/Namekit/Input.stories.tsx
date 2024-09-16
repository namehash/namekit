import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@namehash/namekit-react";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["primary", "secondary"],
      },
    },
    inputSize: {
      control: {
        type: "select",
        options: ["small", "medium", "large"],
      },
    },
    type: {
      control: {
        type: "select",
        options: ["text", "email", "number", "password"],
      },
    },
    asChild: { control: { disable: true } },
    className: { control: "text" },
    placeholder: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    inputSize: "medium",
    type: "text",
    placeholder: "Primary Medium Input",
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: "secondary",
    inputSize: "medium",
    type: "email",
    placeholder: "Secondary Medium Input",
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    inputSize: "small",
    placeholder: "Primary Small Input",
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: "secondary",
    inputSize: "small",
    placeholder: "Secondary Small Input",
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: "primary",
    inputSize: "large",
    placeholder: "Primary Large Input",
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: "secondary",
    inputSize: "large",
    placeholder: "Secondary Large Input",
  },
};

export const CustomClass: Story = {
  args: {
    variant: "primary",
    inputSize: "medium",
    placeholder: "Custom Class Input",
    className: "custom-class-name",
  },
};

export const WithSlotLeft: Story = {
  args: {
    variant: "primary",
    inputSize: "medium",
    placeholder: "Say something",
    children: <Input.Slot>@</Input.Slot>,
  },
};

export const WithSlotRight: Story = {
  args: {
    variant: "primary",
    inputSize: "medium",
    placeholder: "Say something",
    slotPosition: "right",
    children: <Input.Slot>@</Input.Slot>,
  },
};

export const WithSlotLeftSmall: Story = {
  args: {
    variant: "primary",
    inputSize: "small",
    placeholder: "Say something",
  },
};

export const WithError: Story = {
  args: {
    variant: "primary",
    inputSize: "medium",
    placeholder: "Email address",
    error: "Email is required",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    inputSize: "medium",
    value: "Disabled input",
    disabled: true,
  },
};
