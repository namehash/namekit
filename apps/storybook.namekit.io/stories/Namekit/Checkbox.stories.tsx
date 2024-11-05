import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@namehash/namekit-react";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    className: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    id: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const WithClassName: Story = {
  args: {
    className: "bg-red-500",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Checkbox",
    description: "This is a checkbox",
    id: "checkbox-1",
    disabled: true,
  },
};

export const CustomStyling: Story = {
  args: {
    style: {
      width: "24px",
      height: "24px",
      backgroundColor: "blue",
      borderWidth: "2px",
      borderColor: "red",
      transition: "all 0.3s ease",
    },
  },
};
