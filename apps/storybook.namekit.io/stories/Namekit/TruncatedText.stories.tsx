import { TruncatedText } from "@namehash/namekit-react/client";
import type { Meta, StoryObj } from "@storybook/react";

enum TruncatedTextExample {
  SHORT_TEXT = "SHORT_TEXT",
  LONG_TEXT = "LONG_TEXT",
}

const getExampleTruncatedText = (example: TruncatedTextExample): string => {
  switch (example) {
    case TruncatedTextExample.SHORT_TEXT:
      return "heyiamsmall";
    case TruncatedTextExample.LONG_TEXT:
      return "heyiamaverylongtextthatkeepsgrowingunstopablyomgiamstillgoingonokdone";
  }
};

const meta: Meta<typeof TruncatedText> = {
  component: TruncatedText,
  title: "Namekit/TruncatedText",
  argTypes: {
    textStylingClasses: {
      control: { type: "text" },
    },
    tooltipTextStylingClasses: {
      control: { type: "text" },
    },
    maxDisplayWidth: {
      control: { type: "number" },
    },
    maxTooltipWidth: {
      control: { type: "number" },
    },
  },
  args: {
    textStylingClasses: "",
    tooltipTextStylingClasses: "",
    maxDisplayWidth: 300,
    maxTooltipWidth: 400,
    text: "",
    displayTooltipWhenTextOverflows: true,
  },
};

export default meta;

type Story = StoryObj<typeof TruncatedText>;

export const ShortText: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.SHORT_TEXT),
  },
};
export const ShortTextStyled: Story = {
  args: {
    textStylingClasses: "ens-webfont custom-class-name huge-font-size",
    text: getExampleTruncatedText(TruncatedTextExample.SHORT_TEXT),
  },
};
export const LongText: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
export const LongTextStyled: Story = {
  args: {
    textStylingClasses: "ens-webfont custom-class-name huge-font-size",
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
export const DefaultTooltipTextStyles: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
export const CustomTooltipTextStyles: Story = {
  args: {
    tooltipTextStylingClasses: "ens-webfont colorful-text",
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
export const SmallMaxDisplayWidth: Story = {
  args: {
    maxDisplayWidth: 60,
    maxTooltipWidth: 500,
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
export const BigMaxDisplayWidth: Story = {
  args: {
    maxDisplayWidth: 600,
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
export const WithoutTooltip: Story = {
  args: {
    maxDisplayWidth: 200,
    displayTooltipWhenTextOverflows: false,
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
