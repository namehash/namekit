import { Currency, PriceSymbology } from "@namehash/ens-utils";
import {
  AltPriceDisplayFormat,
  DisplayedPriceWithAltPrice,
  PriceDisplayPosition,
  PriceDisplaySize,
  CurrencySymbolPosition,
} from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DisplayedPriceWithAltPrice> = {
  component: DisplayedPriceWithAltPrice,
  title: "Namekit/DisplayedPriceWithAltPrice",
  argTypes: {
    price: {
      control: "object",
    },
    priceTextDisplaySize: {
      options: Object.keys(PriceDisplaySize),
      control: { type: "select" },
    },
    altPriceDisplayFormat: {
      options: Object.keys(AltPriceDisplayFormat),
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
    altPriceDisplaySize: {
      options: Object.keys(PriceDisplaySize),
      control: { type: "select" },
    },
    altPriceDisplayPosition: {
      options: Object.keys(PriceDisplayPosition),
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

type Story = StoryObj<typeof DisplayedPriceWithAltPrice>;

export const EthPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPrice: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Tooltip,
  },
};
export const EthPriceWithoutCurrencyTooltip: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPrice: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Tooltip,
    describeCurrencyInTooltip: false,
  },
};
export const UsdPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Tooltip,
  },
};
export const AlternativePriceDisplayedAsTextNextToPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    priceTextDisplaySize: PriceDisplaySize.Medium,
    altPriceDisplaySize: PriceDisplaySize.Small,
    altPriceDisplayPosition: PriceDisplayPosition.Right,
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
  },
};
export const AlternativePriceDisplayedAsTextInBottom: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    priceTextDisplaySize: PriceDisplaySize.Medium,
    altPriceDisplaySize: PriceDisplaySize.Small,
    altPriceDisplayPosition: PriceDisplayPosition.Bottom,
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
  },
};

export const LargePriceDisplaySize: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    priceTextDisplaySize: PriceDisplaySize.Large,
  },
};
export const MediumPriceDisplaySize: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    priceTextDisplaySize: PriceDisplaySize.Medium,
  },
};
export const SmallPriceDisplaySize: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    priceTextDisplaySize: PriceDisplaySize.Small,
  },
};
export const MicroPriceDisplaySize: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    priceTextDisplaySize: PriceDisplaySize.Micro,
  },
};
export const DisplaySymbologyAtLeft: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbolPosition: CurrencySymbolPosition.Left,
    priceTextDisplaySize: PriceDisplaySize.Micro,
  },
};
export const DisplaySymbologyAtRight: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbolPosition: CurrencySymbolPosition.Right,
    priceTextDisplaySize: PriceDisplaySize.Micro,
  },
};
export const DisplaySymbolSymbologyForETH: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPrice: {
      currency: Currency.Usd,
      value: 198900n,
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
    altPrice: {
      currency: Currency.Usd,
      value: 198900n,
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
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
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
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    currencySymbology: PriceSymbology.Acronym,
  },
};
export const LargeLargeDisplaySizes: Story = {
  name: "[Prices sizes combinations] Large & Large",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Large,
    altPriceDisplaySize: PriceDisplaySize.Large,
  },
};
export const LargeMediumDisplaySizes: Story = {
  name: "[Prices sizes combinations] Large & Medium",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Large,
    altPriceDisplaySize: PriceDisplaySize.Medium,
  },
};
export const LargeSmallDisplaySizes: Story = {
  name: "[Prices sizes combinations] Large & Small",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Large,
    altPriceDisplaySize: PriceDisplaySize.Small,
  },
};
export const LargeMicroDisplaySizes: Story = {
  name: "[Prices sizes combinations] Large & Micro",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Large,
    altPriceDisplaySize: PriceDisplaySize.Micro,
  },
};
export const MediumMediumDisplaySizes: Story = {
  name: "[Prices sizes combinations] Medium & Medium",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Medium,
    altPriceDisplaySize: PriceDisplaySize.Medium,
  },
};
export const MediumSmallDisplaySizes: Story = {
  name: "[Prices sizes combinations] Medium & Small",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Medium,
    altPriceDisplaySize: PriceDisplaySize.Small,
  },
};
export const MediumMicroDisplaySizes: Story = {
  name: "[Prices sizes combinations] Medium & Micro",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Medium,
    altPriceDisplaySize: PriceDisplaySize.Micro,
  },
};
export const SmallSmallDisplaySizes: Story = {
  name: "[Prices sizes combinations] Small & Small",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Small,
    altPriceDisplaySize: PriceDisplaySize.Small,
  },
};
export const SmallMicroDisplaySizes: Story = {
  name: "[Prices sizes combinations] Small & Micro",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Small,
    altPriceDisplaySize: PriceDisplaySize.Micro,
  },
};
export const MicroMicroDisplaySizes: Story = {
  name: "[Prices sizes combinations] Micro & Micro",
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    altPriceDisplayFormat: AltPriceDisplayFormat.Text,
    priceTextDisplaySize: PriceDisplaySize.Micro,
    altPriceDisplaySize: PriceDisplaySize.Micro,
  },
};
export const WithOnClickHandler: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    onTextClick: () => alert("Price clicked"),
  },
};
export const WithAltPriceOnClickHandler: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    onAltPriceTextClick: () => alert("Alt price clicked"),
  },
};
export const WithMultipleOnClickHandlers: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    onTextClick: () => alert("Price clicked"),
    onAltPriceTextClick: () => alert("Alt price clicked"),
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
