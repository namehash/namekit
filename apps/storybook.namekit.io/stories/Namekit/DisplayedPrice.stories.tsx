import { Currency, PriceSymbology } from "@namehash/ens-utils";
import {
  DisplayedPrice,
  PriceDisplaySize,
  CurrencySymbolPosition,
} from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DisplayedPrice> = {
  component: DisplayedPrice,
  title: "Namekit/DisplayedPrice",
  argTypes: {
    price: {
      control: "object",
    },
    displaySize: {
      options: Object.keys(PriceDisplaySize),
      control: { type: "select" },
    },
    symbolPosition: {
      options: Object.keys(CurrencySymbolPosition),
      control: { type: "select" },
    },
    currencySymbology: {
      options: Object.keys(PriceSymbology),
      control: { type: "select" },
    },
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

type Story = StoryObj<typeof DisplayedPrice>;

export const EthPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
  },
};
export const EthPriceWithoutCurrencyTooltip: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    describeCurrencyInTooltip: false,
  },
};
export const UsdPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
  },
};
export const LargePriceDisplaySize: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Large,
  },
};
export const MediumPriceDisplaySize: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Medium,
  },
};
export const SmallPriceDisplaySize: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Small,
  },
};
export const MicroPriceDisplaySize: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Micro,
  },
};
export const DisplaySymbologyAtLeft: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbolPosition: CurrencySymbolPosition.Left,
    displaySize: PriceDisplaySize.Micro,
  },
};
export const DisplaySymbologyAtRight: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbolPosition: CurrencySymbolPosition.Right,
    displaySize: PriceDisplaySize.Micro,
  },
};
export const DisplaySymbolSymbologyForETH: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    currencySymbology: PriceSymbology.Symbol,
  },
};
export const DisplayAcronymSymbologyForETH: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    currencySymbology: PriceSymbology.Acronym,
  },
};
export const DisplaySymbolSymbologyForUSD: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    currencySymbology: PriceSymbology.Symbol,
  },
};
export const DisplayAcronymSymbologyForUSD: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    currencySymbology: PriceSymbology.Acronym,
  },
};
export const WithOnClickHandler: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    onTextClick: () => alert("Price clicked"),
  },
};
export const EthMinDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 100000000000000n,
    },
  },
};
export const EthMaxDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 10000000000000000000000000n,
    },
  },
};
export const UsdMinDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 1n,
    },
  },
};
export const UsdMaxDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 1000000000000000000n,
    },
  },
};
