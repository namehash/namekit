import { Currency } from "@namehash/ens-utils";
import {
  CurrencySymbol,
  CurrencySymbology,
  CurrencySymbolSize,
} from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";

export const AsAnAcronym: Story = {
  args: {
    currency: Currency.Eth,
    symbology: CurrencySymbology.Acronym,
    size: CurrencySymbolSize.Large,
  },
};
export const AsASymbol: Story = {
  args: {
    currency: Currency.Eth,
    symbology: CurrencySymbology.Symbol,
    size: CurrencySymbolSize.Large,
  },
};
export const AsAnIcon: Story = {
  args: {
    currency: Currency.Eth,
    symbology: CurrencySymbology.Icon,
    size: CurrencySymbolSize.Large,
  },
};
export const SmallSize: Story = {
  args: {
    size: CurrencySymbolSize.Small,
    symbology: CurrencySymbology.Icon,
    currency: Currency.Eth,
  },
};
export const WithCustomSymbolColor: Story = {
  args: {
    fill: "#007bff",
    size: CurrencySymbolSize.Large,
    symbology: CurrencySymbology.Icon,
    currency: Currency.Eth,
  },
};
export const NotShowingTooltipDescription: Story = {
  args: {
    describeCurrencyInTooltip: false,
    size: CurrencySymbolSize.Large,
    currency: Currency.Eth,
  },
};

const meta: Meta<typeof CurrencySymbol> = {
  component: CurrencySymbol,
  title: "Namekit/CurrencySymbol",
  argTypes: {
    fill: { control: "color" },
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
    size: {
      options: Object.keys(CurrencySymbolSize),
      mapping: CurrencySymbolSize,
      control: { type: "select" },
    },
    describeCurrencyInTooltip: { control: { type: "boolean" } },
  },
  args: {
    describeCurrencyInTooltip: true,
  },
};

export default meta;

type Story = StoryObj<typeof CurrencySymbol>;
