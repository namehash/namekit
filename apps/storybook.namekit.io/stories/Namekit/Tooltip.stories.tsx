import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "@namehash/namekit-react";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  argTypes: {
    placement: {
      options: ["top", "right", "bottom", "left"],
      control: { type: "select" },
    },
    children: {
      control: { type: "text" },
    },
    trigger: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const BottomPlacement: Story = {
  args: {
    placement: "bottom",
    trigger: <>Tooltip Trigger</>,
    children: <>Tooltip content</>,
  },
};

export const RightPlacement: Story = {
  args: {
    placement: "right",
    trigger: <>Tooltip Trigger</>,
    children: <>Tooltip content</>,
  },
};

export const LeftPlacement: Story = {
  args: {
    placement: "left",
    trigger: <>Tooltip Trigger</>,
    children: <>Tooltip content</>,
  },
};

export const DefaultMaxTooltipWidth: Story = {
  args: {
    placement: "bottom",
    trigger: <>Tooltip Trigger</>,
    children: (
      <>
        Tooltip content is very long so you can see when the tooltip content
        needs to break into a new line
      </>
    ),
  },
};

export const CustomMaxTooltipWidth: Story = {
  args: {
    placement: "bottom",
    maxTooltipWidth: 100,
    trigger: <>Tooltip Trigger for tooltip with 100px max width</>,
    children: (
      <>
        Tooltip content is very long so you can see when the tooltip content
        needs to break into a new line
      </>
    ),
  },
};
