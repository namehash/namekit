import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

// import "@namehash/ens-webfont";

const meta: Meta = {};

export default meta;

type Story = StoryObj<JSX.Element>;

export const Default: Story = {
  render: () => <p className="ens-webfont">lightwalker.eth</p>,
};
