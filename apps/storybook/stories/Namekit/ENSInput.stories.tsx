import type { Meta, StoryObj } from "@storybook/react";
import { EnsInput } from "@namehash/namekit-react";

const meta: Meta<typeof EnsInput> = {
  title: "UI/EnsInput",
  component: EnsInput,
  parameters: {
    layout: "centered",
  },
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

type Story = StoryObj<typeof EnsInput>;

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    inputSize: "medium",
    type: "text",
    placeholder: "lightwalker.eth",
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: "secondary",
    inputSize: "medium",
    type: "email",
    placeholder: "notrab.eth",
  },
};
