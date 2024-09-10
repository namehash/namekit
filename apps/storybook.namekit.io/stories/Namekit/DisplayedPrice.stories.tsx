import {
  CurrencySymbol,
  DisplayedPrice,
  CurrencySymbology,
  PriceDisplaySize,
  CurrencySymbolPosition,
  CurrencySymbolSize,
} from "@namehash/namekit-react/client";
import type { Meta, StoryObj } from "@storybook/react";
import {
  convertCurrencyWithRates,
  Currency,
  numberAsPrice,
  Price,
  PriceCurrencyFormat,
} from "@namehash/ens-utils";
import React, { useEffect, useState } from "react";

const getCurrencySymbolSizeBasedOnPriceDisplaySize = (
  displaySize: PriceDisplaySize | undefined,
) => {
  switch (displaySize) {
    case PriceDisplaySize.Large:
      return CurrencySymbolSize.Large;
    case PriceDisplaySize.Medium:
      return CurrencySymbolSize.Large;
    case PriceDisplaySize.Small:
      return CurrencySymbolSize.Small;
    case PriceDisplaySize.Micro:
      return CurrencySymbolSize.Small;
    default:
      return CurrencySymbolSize.Large;
  }
};

const meta: Meta<typeof DisplayedPrice> = {
  component: DisplayedPrice,
  title: "Namekit/DisplayedPrice",
  argTypes: {
    /**
     * `price` options definition for storybook's UI visitors:
     *
     * Storybook does not provide a straigh-forward way of customizing typed objects
     * properties. Since we want to provide storie's docs visitors a way of testing
     * multiple `Price` typed objects as `price` values of `DisplayedName` config,
     *
     * A set of examples are defined as `options` and `mapping` properties. The
     * number of stories that are commonly used by applications was finger-picked to be
     * these examples. If you want to further test and customize this component, please
     * consider installing @namehash/namekit-react dependency and using it locally!
     */
    price: {
      options: [
        "Example With ETH price",
        "Example With WETH price",
        "Example With USD price",
        "Example With USDC price",
        "Example With DAI price",
      ],
      mapping: {
        ["Example With ETH price"]: numberAsPrice(1, Currency.Eth),
        ["Example With WETH price"]: numberAsPrice(1, Currency.Weth),
        ["Example With USD price"]: numberAsPrice(1, Currency.Usd),
        ["Example With USDC price"]: numberAsPrice(1, Currency.Usdc),
        ["Example With DAI price"]: numberAsPrice(1, Currency.Dai),
      },
    },
    /**
     * `symbol` options definition for storybook's UI visitors:
     *
     * Building JSX components out of the box 🧠 is not an ability all have, so,
     * we provide a set of examples for `symbol` property.
     *
     *
     * P.S.: For those that have the necessary abilities please note how you could set
     * any text, any HTML element, or even React components you want as this prop's value!
     *
     * WhateverJSX: a simple JSX with a text saying "Whatever JSX you want"
     * undefined: undefined value, which results in`@namehash/namekit-react`'s default symbology
     * null: null value, which results in no symbol
     */
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
    /**
     * The possible `displaySize` values for `DisplayedPrice` component.
     */
    displaySize: {
      options: [
        PriceDisplaySize.Large,
        PriceDisplaySize.Medium,
        PriceDisplaySize.Small,
        PriceDisplaySize.Micro,
      ],
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
      options: [CurrencySymbolPosition.Left, CurrencySymbolPosition.Right],
      control: {
        type: "select",
        labels: {
          [CurrencySymbolPosition.Left]: "Left",
          [CurrencySymbolPosition.Right]: "Right",
        },
      },
    },
  },
  args: {
    price: numberAsPrice(1, Currency.Eth),
    symbol: undefined,
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

type Story = StoryObj<typeof DisplayedPrice>;

const defaultStoriesPrice = numberAsPrice(1, Currency.Eth);

const exchangeRatesRecord = {
  [Currency.Weth]: 2277.56570676,
  [Currency.Eth]: 2277.56570676,
  [Currency.Usd]: 1,
  [Currency.Dai]: 1,
  [Currency.Usdc]: 1,
};

export const LargeDisplaySize: Story = {
  args: {
    displaySize: PriceDisplaySize.Large,
  },
  render: (args, ctx) => {
    /**
     * Gather existing pre-defined `DisplayedPrice` stories
     * configuration and gets `options` and `mapping` values
     * in order to set the first element of `options` as default `price`
     * (a `DisplayedPrice`) property value.
     *
     * This enhances storybook's storie's documentation UI (through a select dropdown,
     * the story is now able to set one of the `options` as the default `option` of `select`).
     */
    const defaultPriceArgTypesOptions = ctx.argTypes.price.options;
    const defaultPriceArgTypesMapping = ctx.argTypes.price.mapping;

    let price: Price;
    if (!!defaultPriceArgTypesOptions && defaultPriceArgTypesMapping) {
      price = defaultPriceArgTypesMapping[defaultPriceArgTypesOptions[0]];
    }

    /**
     * Below there is a conversion of the `price` value to the `args.price.currency`
     * currency. This is done by using the `convertCurrencyWithRates` function from
     * `@namehash/ens-utils` package. Why we do this? Because we want to show the
     * `price` value in a different currency than the one it was defined, with
     * the exchange rates defined in `exchangeRatesRecord`.
     *
     * Please refer to the definition of `price` argTypes to understand why
     * we contraint the `price` value to be one of the `options` defined.
     */
    const convertedPrice = convertCurrencyWithRates(
      defaultStoriesPrice,
      args.price.currency,
      exchangeRatesRecord,
    );

    return <DisplayedPrice {...args} price={convertedPrice}></DisplayedPrice>;
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
  render: (args) => {
    const [currency, setCurrency] = useState<Currency>(args.price.currency);
    const [currencySize, setCurrencySize] = useState<CurrencySymbolSize>(
      CurrencySymbolSize.Large,
    );

    useEffect(() => {
      setCurrencySize(
        getCurrencySymbolSizeBasedOnPriceDisplaySize(args.displaySize),
      );
    }, [args.displaySize]);

    useEffect(() => {
      setCurrency(args.price.currency);
    }, [args.price.currency]);

    return (
      <DisplayedPrice
        {...args}
        symbol={
          <div
            style={{
              marginBottom:
                currencySize === CurrencySymbolSize.Large ? "0.1rem" : "",
            }}
          >
            <CurrencySymbol
              size={currencySize}
              currency={currency}
              symbology={CurrencySymbology.Icon}
            />
          </div>
        }
      ></DisplayedPrice>
    );
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
export const OverflowDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(100000000, Currency.Usd),
    displaySize: PriceDisplaySize.Small,
  },
  render: (args) => {
    const [currency, setCurrency] = useState<Currency>(args.price.currency);
    const [currencySize, setCurrencySize] = useState<CurrencySymbolSize>();

    useEffect(() => {
      setCurrencySize(
        getCurrencySymbolSizeBasedOnPriceDisplaySize(args.displaySize),
      );
    }, [args.displaySize]);

    useEffect(() => {
      setCurrency(args.price.currency);
    }, [args.price.currency]);

    return (
      <DisplayedPrice
        {...args}
        price={numberAsPrice(
          Number(PriceCurrencyFormat[currency].MaxDisplayValue) + 1,
          currency,
        )}
        symbol={
          args.symbol || (
            <CurrencySymbol
              size={currencySize}
              currency={currency}
              symbology={CurrencySymbology.Icon}
            />
          )
        }
      ></DisplayedPrice>
    );
  },
};
export const UnderflowDisplayPriceWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(0.01, Currency.Usdc),
    displaySize: PriceDisplaySize.Small,
  },
  render: (args) => {
    const [currency, setCurrency] = useState<Currency>(args.price.currency);
    const [currencySize, setCurrencySize] = useState<CurrencySymbolSize>();

    useEffect(() => {
      setCurrencySize(
        getCurrencySymbolSizeBasedOnPriceDisplaySize(args.displaySize),
      );
    }, [args.displaySize]);

    useEffect(() => {
      setCurrency(args.price.currency);
    }, [args.price.currency]);

    return (
      <DisplayedPrice
        {...args}
        price={numberAsPrice(
          Number(PriceCurrencyFormat[currency].MinDisplayValue) - 1,
          currency,
        )}
        symbol={
          args.symbol || (
            <CurrencySymbol
              currency={currency}
              iconSize={currencySize}
              symbology={CurrencySymbology.Icon}
            />
          )
        }
      ></DisplayedPrice>
    );
  },
};
