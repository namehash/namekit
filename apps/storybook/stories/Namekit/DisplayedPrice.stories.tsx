import { Currency } from "@namehash/ens-utils";
import {
  AltPriceDisplayFormat,
  DisplayedPrice,
  PriceDisplayPosition,
  PriceDisplaySize,
  PriceSymbolPosition,
  PriceSymbology,
} from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DisplayedPrice> = {
  component: DisplayedPrice,
  title: "Namekit/DisplayedPrice",
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
    showCurrencyTooltipDescription: false,
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
    priceTextDisplaySize: PriceDisplaySize.Large,
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
    symbolPosition: PriceSymbolPosition.Left,
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
    symbolPosition: PriceSymbolPosition.Right,
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
export const LargeAltPriceDisplaySize: Story = {
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
    altPriceDisplaySize: PriceDisplaySize.Large,
  },
};
export const MediumAltPriceDisplaySize: Story = {
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
    altPriceDisplaySize: PriceDisplaySize.Medium,
  },
};
export const SmallAltPriceDisplaySize: Story = {
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
    altPriceDisplaySize: PriceDisplaySize.Small,
  },
};
export const MicroAltPriceDisplaySize: Story = {
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
