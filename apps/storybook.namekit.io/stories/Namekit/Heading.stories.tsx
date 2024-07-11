import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "@namehash/namekit-react";

const meta: Meta<typeof Heading> = {
  title: "UI/Heading",
  component: Heading,
  argTypes: {
    as: {
      control: {
        type: "select",
        options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      },
    },
    asChild: { control: { disable: true } },
    children: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  args: {
    as: "h1",
    children: "Heading 1",
  },
};

export const H2: Story = {
  args: {
    as: "h2",
    children: "Heading 2",
  },
};

export const H3: Story = {
  args: {
    as: "h3",
    children: "Heading 3",
  },
};

export const H4: Story = {
  args: {
    as: "h4",
    children: "Heading 4",
  },
};

export const H5: Story = {
  args: {
    as: "h5",
    children: "Heading 5",
  },
};

export const H6: Story = {
  args: {
    as: "h6",
    children: "Heading 6",
  },
};

export const CustomClass: Story = {
  args: {
    as: "h1",
    children: "Custom Class Text",
    className: "my-class-name",
  },
};

export const AsChild: Story = {
  args: {
    as: "h1",
    children: "Heading as a span",
    asChild: <span />,
  },
};
