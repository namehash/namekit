import { TruncatedText } from "@namehash/namekit-react/client";
import type { Meta, StoryObj } from "@storybook/react";

const SHORT_TEXT = "heyiamsmall";
const LONG_TEXT = "heyiamaverylongtextthatkeepsgrowingunstopablyomgiamstillgoingonokdone";

const meta: Meta<typeof TruncatedText> = {
  component: TruncatedText,
  title: "Namekit/TruncatedText",
  argTypes: {
    text: {
      control: { type: "text" },
    },
    maxDisplayWidth: {
      control: { type: "number" },
    },
    textStylingClasses: {
      control: { type: "text" },
    },
    displayTooltipWhenTextOverflows: {
      control: { type: "boolean" },
    },
    maxTooltipWidth: {
      control: { type: "number" },
    },
    tooltipTextStylingClasses: {
      control: { type: "text" },
    },
  },
  args: {
    textStylingClasses: "",
    displayTooltipWhenTextOverflows: true,
    tooltipTextStylingClasses: "",
  },
};

export default meta;

type Story = StoryObj<typeof TruncatedText>;

export const ShortText: Story = {
  args: {
    text: SHORT_TEXT,
    maxDisplayWidth: 300,
  },
};
export const ShortTextStyled: Story = {
  args: {
    text: SHORT_TEXT,
    maxDisplayWidth: 300,
    textStylingClasses: "ens-webfont colorful-text",
  },
};
export const LongText: Story = {
  args: {
    text: LONG_TEXT,
    maxDisplayWidth: 300,
  },
};
export const LongTextStyled: Story = {
  args: {
    text: LONG_TEXT,
    maxDisplayWidth: 300,
    textStylingClasses: "ens-webfont colorful-text",
  },
};
export const DefaultTooltipTextStyles: Story = {
  args: {
    text: LONG_TEXT,
    maxDisplayWidth: 300,
  },
};
export const CustomTooltipTextStyles: Story = {
  args: {
    text: LONG_TEXT,
    maxDisplayWidth: 300,
    tooltipTextStylingClasses: "ens-webfont colorful-text",
  },
};
export const SmallMaxDisplayWidth: Story = {
  args: {
    text: LONG_TEXT,
    maxDisplayWidth: 60,
  },
};
export const BigMaxDisplayWidth: Story = {
  args: {
    text: LONG_TEXT,
    maxDisplayWidth: 600,
  },
};
export const WithoutTooltip: Story = {
  args: {
    text: LONG_TEXT,
    maxDisplayWidth: 300,
    displayTooltipWhenTextOverflows: false,
  },
};
