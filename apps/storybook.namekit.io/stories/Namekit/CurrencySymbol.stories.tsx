import { Currency } from "@namehash/ens-utils";
import {
  CurrencySymbol,
  CurrencySymbology,
} from "@namehash/namekit-react/client";
import { CurrencyIconSize } from "@namehash/namekit-react/client";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CurrencySymbol> = {
  component: CurrencySymbol,
  title: "Namekit/CurrencySymbol",
  argTypes: {
    currency: {
      options: Object.values(Currency),
      control: {
        labels: Object.keys(Currency),
        type: "select",
      },
    },
    iconSize: {
      options: Object.values(CurrencyIconSize),
      if: { arg: "symbology", eq: CurrencySymbology.Icon },
      control: {
        labels: {
          [CurrencyIconSize.Small]: "Small (16px)",
          [CurrencyIconSize.Large]: "Large (20px)",
        },
        type: "select",
      },
    },
    className: {
      if: { arg: "symbology", neq: CurrencySymbology.Icon },
      control: {
        type: "text",
      },
    },
    describeCurrencyInTooltip: { control: { type: "boolean" } },
    symbology: {
      options: Object.keys(CurrencySymbology),
      control: { type: "select" },
    },
  },
  args: {
    iconSize: CurrencyIconSize.Small,
    describeCurrencyInTooltip: true,
    symbology: CurrencySymbology.TextSymbol,
  },
};

export default meta;

type Story = StoryObj<typeof CurrencySymbol>;

export const AsAnAcronym: Story = {
  args: {
    currency: Currency.Eth,
    symbology: CurrencySymbology.Acronym,
  },
};
export const AsAnIcon: Story = {
  args: {
    currency: Currency.Eth,
    symbology: CurrencySymbology.Icon,
  },
};
export const WithCustomIconColor: Story = {
  argTypes: {
    fill: { control: { type: "color" } },
  },
  args: {
    currency: Currency.Eth,
    symbology: CurrencySymbology.Icon,
    fill: "#007bff",
  },
};
export const WithCustomFontStyle: Story = {
  argTypes: {
    className: { control: { type: "text" } },
  },
  args: {
    currency: Currency.Eth,
    className: "nk-text-3xl colorful-text",
  },
};
export const NotShowingTooltipDescription: Story = {
  args: {
    currency: Currency.Eth,
    describeCurrencyInTooltip: false,
  },
};
