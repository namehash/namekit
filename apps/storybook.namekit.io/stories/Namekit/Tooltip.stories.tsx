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
        The default max tooltip width is the largest positive number possible so
        it is really up to you to decider when to limit the text content,
        horizontally! Note: see example below to understand how to do it 😉
      </>
    ),
  },
};

export const CustomMaxTooltipWidth: Story = {
  args: {
    placement: "bottom",
    maxTooltipWidth: 400,
    trigger: <>Tooltip Trigger for tooltip with 400px max width</>,
    children: (
      <>
        See it! The tooltip content is limited to 400px width. You can set the
        maxTooltipWidth to any number you want to limit the text content display
        width!
      </>
    ),
  },
};
