import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@namehash/namekit-react";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    children: "Accept Terms & Conditions",
  },
};

export const EnabledUnchecked: Story = {
  args: {
    checked: false,
    disabled: false,
    children: "Accept Terms & Conditions",
  },
};

export const EnabledChecked: Story = {
  args: {
    checked: true,
    disabled: false,
    children: "Accept Terms & Conditions",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Accept Terms & Conditions",
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    children: "Accept Terms & Conditions",
  },
};

export const CustomStyling: Story = {
  args: {
    children: <p style={{ color: "red" }}>Accept Terms & Conditions</p>,
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

export const WithoutLabel: Story = {};

export const WithAdvancedChildren: Story = {
  args: {
    children: (
      <>
        <p>Accept Terms & Conditions</p>
        <p
          style={{
            color: "gray",
            fontWeight: "normal",
          }}
        >
          I agree to the Terms of Service and Privacy Policy. By checking this
          box, I acknowledge that I have read and understood all terms and
          conditions.
        </p>
      </>
    ),
    disabled: false,
  },
};
