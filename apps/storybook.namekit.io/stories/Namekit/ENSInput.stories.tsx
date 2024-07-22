import type { Meta, StoryObj } from "@storybook/react";
import { ENSInput } from "@namehash/namekit-react";

const meta: Meta<typeof ENSInput> = {
  title: "UI/ENSInput",
  component: ENSInput,
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

type Story = StoryObj<typeof ENSInput>;

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
