import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipPlacement } from "@namehash/namekit-react/client";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placement: {
      options: Object.values(TooltipPlacement),
      control: { type: "select" },
    },
    maxTooltipWidth: {
      control: { type: "number" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const TopPlacement: Story = {
  args: {
    placement: TooltipPlacement.Top,
  },
  render: (args) => {
    const trigger = <span>Tooltip Trigger</span>;
    return (
      <Tooltip {...args} trigger={trigger}>
        <span>Tooltip content</span>
      </Tooltip>
    );
  },
};

export const BottomPlacement: Story = {
  args: {
    placement: TooltipPlacement.Bottom,
  },
  render: (args) => {
    const trigger = <span>Tooltip Trigger</span>;
    return (
      <Tooltip {...args} trigger={trigger}>
        <span>Tooltip content</span>
      </Tooltip>
    );
  },
};

export const LeftPlacement: Story = {
  args: {
    placement: TooltipPlacement.Left,
  },
  render: (args) => {
    const trigger = <span>Tooltip Trigger</span>;
    return (
      <Tooltip {...args} trigger={trigger}>
        <span>Tooltip content</span>
      </Tooltip>
    );
  },
};

export const RightPlacement: Story = {
  args: {
    placement: TooltipPlacement.Right,
  },
  render: (args) => {
    const trigger = <span>Tooltip Trigger</span>;
    return (
      <Tooltip {...args} trigger={trigger}>
        <span>Tooltip content</span>
      </Tooltip>
    );
  },
};

export const DefaultMaxTooltipWidth: Story = {
  render: (args) => {
    const trigger = <span>Tooltip Trigger</span>;
    return (
      <Tooltip {...args} trigger={trigger}>
        <span>
          This is the default max tooltip width. You can customize the max width
          if desired. See the "Custom Max Tooltip Width" story for an example of
          setting a custom max width.
        </span>
      </Tooltip>
    );
  },
};

export const CustomMaxTooltipWidth: Story = {
  args: {
    maxTooltipWidth: 200,
  },
  render: (args) => {
    const trigger = <span>Tooltip Trigger</span>;
    return (
      <Tooltip {...args} trigger={trigger}>
        <span>
          This is a customized max tooltip width. You can customize the max
          width if desired.
        </span>
      </Tooltip>
    );
  },
};
