import { Currency, numberAsPrice } from "@namehash/ens-utils";
import {
  CurrencySymbol,
  CurrencySymbology,
  CurrencySymbolPosition,
  DisplayedPriceConversion,
  PriceDisplaySize,
} from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof DisplayedPriceConversion> = {
  component: DisplayedPriceConversion,
  title: "Namekit/DisplayedPriceConversion",
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
    convertedPrice: {
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
      control: { type: "select" },
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
    convertedPriceSymbology: {
      options: Object.keys(CurrencySymbology),
      control: { type: "select" },
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
  args: {
    displaySize: PriceDisplaySize.Medium,
    symbolPosition: CurrencySymbolPosition.Left,
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

type Story = StoryObj<typeof DisplayedPriceConversion>;

export const ConvertedPriceWithSymbolSymbology: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    convertedPrice: numberAsPrice(1, Currency.Weth),
    convertedPriceSymbology: CurrencySymbology.Symbol,
  },
};
export const ConvertedPriceWithAcronymSymbology: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    convertedPrice: numberAsPrice(1, Currency.Weth),
    convertedPriceSymbology: CurrencySymbology.Acronym,
  },
};
export const ConvertedPriceWithIconSymbology: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        symbology={CurrencySymbology.Acronym}
      />
    ),
    convertedPrice: numberAsPrice(1, Currency.Weth),
    convertedPriceSymbology: CurrencySymbology.Icon,
  },
};
