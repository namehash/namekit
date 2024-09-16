import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "@namehash/namekit-react/client";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    trigger: {
      control: { type: "select" },
      options: ["Tooltip Trigger", "Any JSX element can be used as a trigger"],
      mapping: {
        "Tooltip Trigger": <>Tooltip Trigger</>,
        "Any JSX element can be used as a trigger": (
          <button disabled={true}>
            Any JSX element can be used as a trigger
          </button>
        ),
      },
    },
    children: {
      control: { type: "select" },
      options: ["Tooltip Trigger", "Any JSX element can be used as a trigger"],
      mapping: {
        "Tooltip content": <>Tooltip content</>,
        "Any JSX element can be used as a content": (
          <h1>Any JSX element can be used as a content</h1>
        ),
      },
    },
    placement: {
      options: ["top", "right", "bottom", "left"],
      control: { type: "select" },
    },
    maxTooltipWidth: {
      control: { type: "number" },
    },
  },
  args: {
    placement: "top",
    maxTooltipWidth: 400,
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
  render: (args) => {
    return (
      <div className="nk-w-full nk-flex nk-justify-center">
        <Tooltip {...args} />
      </div>
    );
  },
};

export const TopPlacement: Story = {
  args: {
    placement: "top",
    trigger: <>Tooltip Trigger</>,
    children: <>Tooltip content</>,
  },
  render: (args) => {
    return (
      <div className="nk-h-screen nk-flex nk-items-center">
        <Tooltip {...args} />
      </div>
    );
  },
};

export const DefaultMaxTooltipWidth: Story = {
  args: {
    placement: "bottom",
    trigger: <>Tooltip Trigger</>,
    children: (
      <>
        The default max tooltip width is 400px and it is up to you to set
        another explicit max width limit, See the "Custom Max Tooltip Width"
        story for an example of setting a max width.
      </>
    ),
  },
};

export const CustomMaxTooltipWidth: Story = {
  args: {
    placement: "bottom",
    maxTooltipWidth: 600,
    trigger: <>Tooltip Trigger for tooltip with 600px max width</>,
    children: (
      <>
        See it! The tooltip content is limited to 600px width. You can set the
        maxTooltipWidth to the desired value to limit the text content display
        width!
      </>
    ),
  },
};
