import {
  Currency,
  CurrencySymbology,
  getCurrencySymbology,
  PriceCurrencyFormat,
} from "@namehash/ens-utils";
import { CurrencySymbol, DomainCardPrice } from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof DomainCardPrice> = {
  component: DomainCardPrice,
  title: "Namekit/DomainCardPrice",
  argTypes: {
    altPrice: {
      control: "object",
    },
    altPriceSymbology: {
      options: Object.keys(CurrencySymbology),
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

type Story = StoryObj<typeof DomainCardPrice>;

export const EthPriceWithCurrencySymbolAndAnUsdAltPriceWithSymbolSymbology: Story =
  {
    args: {
      price: { currency: Currency.Eth, value: 1000000000000000000n },
      symbol: (
        <CurrencySymbol
          currency={Currency.Eth}
          describeCurrencyInTooltip={false}
        />
      ),
      altPrice: { currency: Currency.Usd, value: 198900n },
      altPriceSymbology: CurrencySymbology.Symbol,
    },
  };
export const EthPriceWithCurrencySymbolAndAnUsdAltPriceWithAcronymSymbology: Story =
  {
    args: {
      price: { currency: Currency.Eth, value: 1000000000000000000n },
      symbol: (
        <CurrencySymbol
          currency={Currency.Eth}
          describeCurrencyInTooltip={false}
        />
      ),
      altPrice: { currency: Currency.Usd, value: 198900n },
      altPriceSymbology: CurrencySymbology.Acronym,
    },
  };
export const EthPriceWithAcronymAndAnUsdAltPriceWithAcronymSymbology: Story = {
  args: {
    price: { currency: Currency.Eth, value: 1000000000000000000n },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
    altPrice: { currency: Currency.Usd, value: 198900n },
    altPriceSymbology: CurrencySymbology.Acronym,
  },
};
export const EthPriceWithAcronymAndAnUsdAltPriceWithSymbolSymbology: Story = {
  args: {
    price: { currency: Currency.Eth, value: 1000000000000000000n },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
    altPrice: { currency: Currency.Usd, value: 198900n },
    altPriceSymbology: CurrencySymbology.Symbol,
  },
};
