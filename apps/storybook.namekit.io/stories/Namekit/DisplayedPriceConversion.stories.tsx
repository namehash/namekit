import { Currency, numberAsPrice } from "@namehash/ens-utils";
import {
  CurrencySymbology,
  CurrencySymbolPosition,
  DisplayedPriceConversion,
  PriceDisplaySize,
} from "@namehash/namekit-react/client";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof DisplayedPriceConversion> = {
  component: DisplayedPriceConversion,
  title: "Namekit/DisplayedPriceConversion",
  argTypes: {
    price: {
      options: ["OneETH"],
      mapping: {
        OneETH: numberAsPrice(1, Currency.Eth),
      },
    },
    convertedPrice: {
      options: ["ToUSD", "ToUSDC", "ToWETH", "ToDAI"],
      mapping: {
        ToUSD: numberAsPrice(2000, Currency.Usd),
        ToUSDC: numberAsPrice(2000, Currency.Usdc),
        ToWETH: numberAsPrice(1, Currency.Weth),
        ToDAI: numberAsPrice(2000, Currency.Dai),
      },
    },
    symbol: {
      control: {
        type: "select",
        labels: {
          WhateverJSX: "Whatever JSX you want",
          undefined: "undefined (uses default symbology)",
          null: "null",
        },
      },
      options: ["WhateverJSX", "undefined", "null"],
      mapping: {
        WhateverJSX: <p>Whatever JSX you want</p>,
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
    price: numberAsPrice(1, Currency.Eth),
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
    convertedPrice: numberAsPrice(2000, Currency.Usdc),
    convertedPriceSymbology: CurrencySymbology.Symbol,
  },
};
export const ConvertedPriceWithAcronymSymbology: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    convertedPrice: numberAsPrice(2000, Currency.Usdc),
    convertedPriceSymbology: CurrencySymbology.Acronym,
  },
};
export const ConvertedPriceWithIconSymbology: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    convertedPrice: numberAsPrice(2000, Currency.Usdc),
    convertedPriceSymbology: CurrencySymbology.Icon,
  },
};
