import { Currency, numberAsPrice } from "@namehash/ens-utils";
import {
  CurrencySymbol,
  CurrencySymbology,
  CurrencySymbolPosition,
  CurrencyIconSize,
  DisplayedPriceConversion,
  PriceDisplaySize,
} from "@namehash/namekit-react/client";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

const meta: Meta<typeof DisplayedPriceConversion> = {
  component: DisplayedPriceConversion,
  title: "Namekit/DisplayedPriceConversion",
  argTypes: {
    /**
     * In this story the default price is OneETH
     *
     * This was done so we can ensure that price conversions
     * are nicely set. Please refer to the `convertedPrice`
     * prop to see the converted price options.
     */
    price: {
      options: ["OneETH"],
      mapping: {
        OneETH: numberAsPrice(1, Currency.Eth),
      },
    },
    /**
     * Below values give visitors the ability to
     * convert OneETH to any of the currencies below:
     */
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
    /**
     * The possible `displaySize` values for `DisplayedPrice` component.
     */
    displaySize: {
      options: Object.keys(PriceDisplaySize),
      mapping: PriceDisplaySize,
      control: {
        type: "select",
        labels: {
          [PriceDisplaySize.Large]: "Large (24px)",
          [PriceDisplaySize.Medium]: "Medium (20px)",
          [PriceDisplaySize.Small]: "Small (14px)",
          [PriceDisplaySize.Micro]: "Micro (12px for mobile, 14px for desktop)",
        },
      },
    },
    /**
     * The possible `symbolPosition` values for `DisplayedPrice` component.
     */
    symbolPosition: {
      options: Object.keys(CurrencySymbolPosition),
      mapping: CurrencySymbolPosition,
      control: {
        type: "select",
      },
    },
  },
  args: {
    price: numberAsPrice(1, Currency.Eth),
    convertedPrice: numberAsPrice(2000, Currency.Usd),
    symbol: undefined,
    convertedPriceSymbology: CurrencySymbology.TextSymbol,
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
    convertedPrice: numberAsPrice(2000, Currency.Usd),
    convertedPriceSymbology: CurrencySymbology.TextSymbol,
    displaySize: PriceDisplaySize.Medium,
    symbolPosition: CurrencySymbolPosition.Left,
  },
};
export const ConvertedPriceWithAcronymSymbology: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    convertedPrice: numberAsPrice(2000, Currency.Usd),
    convertedPriceSymbology: CurrencySymbology.Acronym,
    displaySize: PriceDisplaySize.Medium,
    symbolPosition: CurrencySymbolPosition.Left,
  },
};
export const PriceWithIconSymbology: Story = {
  args: {
    price: numberAsPrice(1, Currency.Eth),
    convertedPrice: numberAsPrice(2000, Currency.Usd),
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        symbology={CurrencySymbology.Icon}
        iconSize={CurrencyIconSize.Large}
      />
    ),
    convertedPriceSymbology: CurrencySymbology.Icon,
    displaySize: PriceDisplaySize.Medium,
    symbolPosition: CurrencySymbolPosition.Left,
  },
};
