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
    maxDisplayWidth: {
      control: { type: "number" },
    },
    textStylingClasses: {
      control: { type: "text" },
    },
    maxTooltipWidth: {
      control: { type: "number" },
    },
    tooltipTextStylingClasses: {
      control: { type: "text" },
    },
  },
  args: {
    text: "",
    maxDisplayWidth: 300,
    textStylingClasses: "",
    displayTooltipWhenTextOverflows: true,
    maxTooltipWidth: 400,
    tooltipTextStylingClasses: "",
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
    text: getExampleTruncatedText(TruncatedTextExample.SHORT_TEXT),
    textStylingClasses: "ens-webfont custom-class-name huge-font-size",
  },
};
export const LongText: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
export const LongTextStyled: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
    textStylingClasses: "ens-webfont custom-class-name huge-font-size",
  },
};
export const DefaultTooltipTextStyles: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
  },
};
export const CustomTooltipTextStyles: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
    tooltipTextStylingClasses: "ens-webfont colorful-text",
  },
};
export const SmallMaxDisplayWidth: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
    maxDisplayWidth: 60,
    maxTooltipWidth: 500,
  },
};
export const BigMaxDisplayWidth: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
    maxDisplayWidth: 600,
  },
};
export const WithoutTooltip: Story = {
  args: {
    text: getExampleTruncatedText(TruncatedTextExample.LONG_TEXT),
    maxDisplayWidth: 200,
    displayTooltipWhenTextOverflows: false,
  },
};
