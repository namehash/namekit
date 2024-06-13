import { Currency } from "@namehash/ens-utils";
import { PriceDisplaySize, PriceSymbol } from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";

export const ETH: Story = {
  args: {
    currency: Currency.Eth,
    size: PriceDisplaySize.Large,
  },
};
export const USD: Story = {
  args: {
    currency: Currency.Usd,
    size: PriceDisplaySize.Large,
  },
};
export const USDC: Story = {
  args: {
    currency: Currency.Usdc,
    size: PriceDisplaySize.Large,
  },
};
export const WETH: Story = {
  args: {
    currency: Currency.Weth,
    size: PriceDisplaySize.Large,
  },
};
export const DAI: Story = {
  args: {
    currency: Currency.Dai,
    size: PriceDisplaySize.Large,
  },
};
export const MicroSize: Story = {
  args: {
    size: PriceDisplaySize.Micro,
    currency: Currency.Eth,
  },
};
export const SmallSize: Story = {
  args: {
    size: PriceDisplaySize.Small,
    currency: Currency.Eth,
  },
};
export const MediumSize: Story = {
  args: {
    size: PriceDisplaySize.Medium,
    currency: Currency.Eth,
  },
};
export const LargeSize: Story = {
  args: {
    size: PriceDisplaySize.Large,
    currency: Currency.Eth,
  },
};
export const WithCustomSymbolColor: Story = {
  args: {
    symbolFillColor: "#007bff",
    size: PriceDisplaySize.Large,
    currency: Currency.Eth,
  },
};
export const ShowingTooltipDescription: Story = {
  args: {
    showTooltipDescription: true,
    size: PriceDisplaySize.Large,
    currency: Currency.Eth,
  },
};
export const NotShowingTooltipDescription: Story = {
  args: {
    showTooltipDescription: false,
    size: PriceDisplaySize.Large,
    currency: Currency.Eth,
  },
};

const meta: Meta<typeof PriceSymbol> = {
  component: PriceSymbol,
  title: "Namekit/PriceSymbol",
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

type Story = StoryObj<typeof PriceSymbol>;
