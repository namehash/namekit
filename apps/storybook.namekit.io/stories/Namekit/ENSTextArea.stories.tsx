import type { Meta, StoryObj } from "@storybook/react";
import { EnsTextArea } from "@namehash/namekit-react";

const meta: Meta<typeof EnsTextArea> = {
  title: "UI/EnsTextArea",
  component: EnsTextArea,
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

type Story = StoryObj<typeof EnsTextArea>;

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    placeholder: "hello lightwalker.eth",
    rows: 4,
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    placeholder: "hello notrab.eth",
    rows: 4,
  },
};
