import { Currency } from "@namehash/ens-utils";
import {
  CurrencySymbol,
  CurrencySymbology,
} from "@namehash/namekit-react/client";
import { CurrencySymbolSize } from "@namehash/namekit-react/client";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CurrencySymbol> = {
  component: CurrencySymbol,
  title: "Namekit/CurrencySymbol",
  argTypes: {
    currency: {
      options: [
        Currency.Eth,
        Currency.Usd,
        Currency.Usdc,
        Currency.Weth,
        Currency.Dai,
      ],
      control: { type: "select" },
    },
    iconSize: {
      options: [CurrencySymbolSize.Large, CurrencySymbolSize.Small],
      control: {
        type: "select",
        labels: {
          [CurrencySymbolSize.Large]:
            "Large (20px) (only applicable for Icon symbology)",
          [CurrencySymbolSize.Small]:
            "Small (16px) (only applicable for Icon symbology)",
        },
      },
    },
    describeCurrencyInTooltip: { control: { type: "boolean" } },
    symbology: {
      options: Object.keys(CurrencySymbology),
      control: { type: "select" },
    },
  },
  args: {
    currency: Currency.Eth,
    iconSize: CurrencySymbolSize.Small,
    describeCurrencyInTooltip: true,
    symbology: CurrencySymbology.Symbol,
  },
};

export default meta;

type Story = StoryObj<typeof CurrencySymbol>;

export const AsAnAcronym: Story = {
  args: {
    iconSize: CurrencySymbolSize.Small,
    currency: Currency.Eth,
    symbology: CurrencySymbology.Acronym,
  },
};
export const AsASymbol: Story = {
  args: {
    currency: Currency.Eth,
    symbology: CurrencySymbology.Symbol,
  },
};
export const AsAnIcon: Story = {
  args: {
    currency: Currency.Eth,
    iconSize: CurrencySymbolSize.Large,
    symbology: CurrencySymbology.Icon,
  },
};
export const SmallSize: Story = {
  args: {
    currency: Currency.Eth,
    iconSize: CurrencySymbolSize.Small,
    symbology: CurrencySymbology.Icon,
  },
};
export const WithCustomIconColor: Story = {
  argTypes: {
    fill: { control: { type: "color" } },
  },
  args: {
    currency: Currency.Eth,
    iconSize: CurrencySymbolSize.Large,
    symbology: CurrencySymbology.Icon,
    fill: "#007bff",
  },
};
export const WithCustomFontSize: Story = {
  argTypes: {
    className: { control: { type: "text" } },
  },
  args: {
    className: "nk-text-3xl",
  },
};
export const NotShowingTooltipDescription: Story = {
  args: {
    currency: Currency.Eth,
    iconSize: CurrencySymbolSize.Large,
    describeCurrencyInTooltip: false,
  },
};
