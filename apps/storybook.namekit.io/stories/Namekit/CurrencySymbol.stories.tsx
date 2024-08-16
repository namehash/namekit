import { Currency } from "@namehash/ens-utils";
import { CurrencySymbol, CurrencySymbolSize } from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";

export const ETH: Story = {
  args: {
    currency: Currency.Eth,
    size: CurrencySymbolSize.Large,
  },
};
export const USD: Story = {
  args: {
    currency: Currency.Usd,
    size: CurrencySymbolSize.Large,
  },
};
export const USDC: Story = {
  args: {
    currency: Currency.Usdc,
    size: CurrencySymbolSize.Large,
  },
};
export const WETH: Story = {
  args: {
    currency: Currency.Weth,
    size: CurrencySymbolSize.Large,
  },
};
export const DAI: Story = {
  args: {
    currency: Currency.Dai,
    size: CurrencySymbolSize.Large,
  },
};
export const SmallSize: Story = {
  args: {
    size: CurrencySymbolSize.Small,
    currency: Currency.Eth,
  },
};
export const LargeSize: Story = {
  args: {
    size: CurrencySymbolSize.Large,
    currency: Currency.Eth,
  },
};
export const WithCustomSymbolColor: Story = {
  args: {
    symbolFillColor: "#007bff",
    size: CurrencySymbolSize.Large,
    currency: Currency.Eth,
  },
};
export const ShowingTooltipDescription: Story = {
  args: {
    describeCurrencyInTooltip: true,
    size: CurrencySymbolSize.Large,
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
    symbolFillColor: { control: "color" },
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
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return `${this.toString()}n`;
};

export default meta;

type Story = StoryObj<typeof CurrencySymbol>;
