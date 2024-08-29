import {
  CurrencySymbol,
  DisplayedPrice,
  PriceDisplaySize,
  CurrencySymbology,
  CurrencySymbolPosition,
} from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";
import { Currency, numberAsPrice, type Price } from "@namehash/ens-utils";
import React from "react";

const meta: Meta<typeof DisplayedPrice> = {
  component: DisplayedPrice,
  title: "Namekit/DisplayedPrice",
  argTypes: {
    price: {
      options: ["OneETH", "OneUSD", "OneUSDC", "OneWETH", "OneDAI"],
      mapping: {
        OneETH: numberAsPrice(1, Currency.Eth),
        OneUSD: numberAsPrice(1, Currency.Usd),
        OneUSDC: numberAsPrice(1, Currency.Usdc),
        OneWETH: numberAsPrice(1, Currency.Weth),
        OneDAI: numberAsPrice(1, Currency.Dai),
      },
    },
    symbol: {
      options: [
        "ParagraphElm",
        "EmptyDivElm",
        "undefined",
        "null",
        "CustomEthIconSymbol",
        "CustomEthAcronymSymbol",
      ],
      mapping: {
        ParagraphElm: <p>Whatever you want</p>,
        EmptyDivElm: <div></div>,
        CustomEthIconSymbol: (
          <CurrencySymbol
            currency={Currency.Eth}
            symbology={CurrencySymbology.Icon}
          />
        ),
        CustomEthAcronymSymbol: (
          <CurrencySymbol
            currency={Currency.Eth}
            symbology={CurrencySymbology.Acronym}
          />
        ),
        undefined: undefined,
        null: null,
      },
    },
    displaySize: {
      control: { type: "select" },
      options: ["Large", "Medium", "Small", "Micro"],
      mapping: {
        Large: PriceDisplaySize.Large,
        Medium: PriceDisplaySize.Medium,
        Small: PriceDisplaySize.Small,
        Micro: PriceDisplaySize.Micro,
      },
    },
    symbolPosition: {
      control: { type: "select" },
      options: ["Left", "Right"],
      mapping: {
        Left: CurrencySymbolPosition.Left,
        Right: CurrencySymbolPosition.Right,
      },
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

export const LargeDisplaySize: Story = {
  args: {
    price: numberAsPrice(2000, Currency.Usd),
    displaySize: PriceDisplaySize.Large,
  },
};
export const MediumDisplaySize: Story = {
  args: {
    price: numberAsPrice(2000, Currency.Usd),
    displaySize: PriceDisplaySize.Medium,
  },
};
export const SmallDisplaySize: Story = {
  args: {
    price: numberAsPrice(2000, Currency.Usd),
    displaySize: PriceDisplaySize.Small,
  },
};
export const MicroDisplaySize: Story = {
  args: {
    price: numberAsPrice(2000, Currency.Usd),
    displaySize: PriceDisplaySize.Micro,
  },
};
export const DefaultSymbol: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    symbolPosition: CurrencySymbolPosition.Left,
  },
};
export const CustomSymbolUsingOurCurrencySymbol: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const CustomSymbolUsingCustomAcronymSymbology: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        symbology={CurrencySymbology.Acronym}
      />
    ),
  },
};
export const CustomSymbolDoingWhateverYouWant: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    symbol: <p>Whatever you want</p>,
  },
};
export const CurrencyWithSymbolAtTheRight: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    symbolPosition: CurrencySymbolPosition.Right,
  },
};
export const EthPriceWithCurrencySymbol: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
  },
};
export const WethPriceWithCurrencySymbol: Story = {
  args: {
    price: numberAsPrice(1, Currency.Weth),
  },
};
export const DaiPriceWithCurrencySymbol: Story = {
  args: {
    price: numberAsPrice(1, Currency.Dai),
  },
};
export const UsdcPriceWithCurrencySymbol: Story = {
  args: {
    price: numberAsPrice(1, Currency.Usdc),
  },
};
export const UsdPriceWithCurrencySymbol: Story = {
  args: {
    price: numberAsPrice(1, Currency.Usd),
  },
};
export const EthMinDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(0.001, Currency.Eth),
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const EthMaxDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(1000000, Currency.Eth),
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const UsdMinDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(0.01, Currency.Usd),
    symbol: (
      <CurrencySymbol
        currency={Currency.Usd}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const UsdMaxDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(100000000, Currency.Usd),
    symbol: (
      <CurrencySymbol
        currency={Currency.Usd}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const UsdcMinDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(0.01, Currency.Usdc),
    symbol: (
      <CurrencySymbol
        currency={Currency.Usdc}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const UsdcMaxDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(100000000, Currency.Usdc),
    symbol: (
      <CurrencySymbol
        currency={Currency.Usdc}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const DaiMinDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(0.01, Currency.Dai),
    symbol: (
      <CurrencySymbol
        currency={Currency.Dai}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const DaiMaxDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(100000000, Currency.Dai),
    symbol: (
      <CurrencySymbol
        currency={Currency.Dai}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const WethMinDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(0.001, Currency.Weth),
    symbol: (
      <CurrencySymbol
        currency={Currency.Weth}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const WethMaxDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(1000000, Currency.Weth),
    symbol: (
      <CurrencySymbol
        currency={Currency.Weth}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
