import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  Tooltip,
  TooltipPlacement,
  DEFAULT_MAX_TOOLTIP_WIDTH,
} from "@namehash/namekit-react/client";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    trigger: {
      control: false,
    },
    children: {
      control: false,
    },
    placement: {
      options: Object.values(TooltipPlacement),
      control: { type: "select" },
    },
    maxTooltipWidth: {
      control: { type: "number" },
    },
  },
  args: {
    placement: TooltipPlacement.TOP,
    maxTooltipWidth: DEFAULT_MAX_TOOLTIP_WIDTH,
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const TopPlacement: Story = {
  args: {
    trigger: <>Tooltip Trigger</>,
    children: <>Tooltip content</>,
    placement: TooltipPlacement.TOP,
  },
};

export const BottomPlacement: Story = {
  args: {
    trigger: <>Tooltip Trigger</>,
    children: <>Tooltip content</>,
    placement: TooltipPlacement.BOTTOM,
  },
};

export const LeftPlacement: Story = {
  args: {
    trigger: <>Tooltip Trigger</>,
    children: <>Tooltip content</>,
    placement: TooltipPlacement.LEFT,
  },
};

export const RightPlacement: Story = {
  args: {
    trigger: <>Tooltip Trigger</>,
    children: <>Tooltip content</>,
    placement: TooltipPlacement.RIGHT,
  },
};

export const DefaultMaxTooltipWidth: Story = {
  args: {
    trigger: <>Tooltip Trigger</>,
    children: (
      <>
        This is the default max tooltip width. You can customize the max width
        if desired. See the "Custom Max Tooltip Width" story for an example of
        setting a custom max width.
      </>
    ),
    placement: TooltipPlacement.BOTTOM,
  },
};

export const CustomMaxTooltipWidth: Story = {
  args: {
    trigger: <>Tooltip Trigger</>,
    children: (
      <>
        This is a customized max tooltip width. You can customize the max width
        if desired.
      </>
    ),
    placement: TooltipPlacement.BOTTOM,
    maxTooltipWidth: 200,
  },
};
