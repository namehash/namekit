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

export const Default: Story = {};

export const EnabledUnchecked: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};

export const EnabledChecked: Story = {
  args: {
    checked: true,
    disabled: false,
  },
};

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

export const WithLabel: Story = {
  args: {
    children: "Accept Terms & Conditions",
  },
};

export const DisabledWithLabel: Story = {
  args: {
    children: "Accept Terms & Conditions",
    disabled: true,
  },
};

export const WithCustomLabel: Story = {
  args: {
    children: <p style={{ color: "red" }}>Accept Terms & Conditions</p>,
  },
};

export const WithDescriptiveText: Story = {
  args: {
    children: (
      <>
        <p>Accept Terms & Conditions</p>
        <p
          style={{
            color: "#6B7280",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
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

export const DisabledWithDescriptiveText: Story = {
  args: {
    children: (
      <>
        <p>Accept Terms & Conditions</p>
        <p
          style={{
            color: "#6B7280",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }}
        >
          I agree to the Terms of Service and Privacy Policy. By checking this
          box, I acknowledge that I have read and understood all terms and
          conditions.
        </p>
      </>
    ),
    disabled: true,
  },
};
