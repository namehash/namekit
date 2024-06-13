import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Text } from "@namehash/namekit-react";

const meta: Meta<typeof Text> = {
  title: "UI/Text",
  component: Text,
  argTypes: {
    as: {
      control: {
        type: "select",
        options: ["p", "span", "div", "strong", "em", "label"],
      },
    },
    asChild: { control: { disable: true } },
    children: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Paragraph: Story = {
  args: {
    as: "p",
    children: "This is a paragraph.",
  },
};

export const Span: Story = {
  args: {
    as: "span",
    children: "This is a span.",
  },
};

export const Div: Story = {
  args: {
    as: "div",
    children: "This is a div.",
  },
};

export const Strong: Story = {
  args: {
    as: "strong",
    children: "This is strong text.",
  },
};

export const Emphasis: Story = {
  args: {
    as: "em",
    children: "This is emphasized text.",
  },
};

export const Label: Story = {
  args: {
    as: "label",
    children: "This is a label.",
  },
};

export const CustomClass: Story = {
  args: {
    as: "p",
    children: "Custom Class Text",
    className: "my-class-name",
  },
};

export const AsChild: Story = {
  args: {
    as: "p",
    children: "As Child",
    asChild: <span />,
  },
};
