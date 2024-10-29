import type { Meta, StoryObj } from "@storybook/react";
import { ENSTextArea } from "@namehash/namekit-react";

const meta: Meta<typeof ENSTextArea> = {
  title: "UI/ENSTextArea",
  component: ENSTextArea,
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

type Story = StoryObj<typeof ENSTextArea>;

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
