import {
  CurrencySymbol,
  DisplayedPrice,
  CurrencySymbology,
  PriceDisplaySize,
  CurrencySymbolPosition,
} from "@namehash/namekit-react/client";
import type { Meta, StoryObj } from "@storybook/react";
import {
  convertCurrencyWithRates,
  Currency,
  numberAsPrice,
  Price,
} from "@namehash/ens-utils";
import React, { useEffect } from "react";

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
     * ParagraphElm: a simple paragraph element with a text "Whatever you want"
     * EmptyDivElm: an empty div element
     * CustomEthIconSymbol: the `@namehash/namekit-react`'s `CurrencySymbol` as a Symbol
     * CustomEthAcronymSymbol: the `@namehash/namekit-react`'s `CurrencySymbol` as an Acronym
     * undefined: undefined value, which results in`@namehash/namekit-react`'s default symbology
     * null: null value, which results in no symbol
     */
    symbol: {
      options: [
        "CustomEthAcronymSymbol",
        "CustomEthIconSymbol",
        "ParagraphElm",
        "EmptyDivElm",
        "undefined",
        "null",
      ],
      mapping: {
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
        ParagraphElm: <p>Whatever you want</p>,
        EmptyDivElm: <div></div>,
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
    symbolPosition: CurrencySymbolPosition.Left,
    displaySize: PriceDisplaySize.Medium,
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
export const EthWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(1.234, Currency.Eth),
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const UsdWithCustomCurrencyIcon: Story = {
  args: {
    price: numberAsPrice(1.23, Currency.Usd),
    symbol: (
      <CurrencySymbol
        currency={Currency.Usd}
        symbology={CurrencySymbology.Icon}
      />
    ),
  },
};
export const EthUnderflowDisplayPrice: Story = {
  args: {
    price: numberAsPrice(0.001, Currency.Eth),
  },
};
export const UsdUnderflowDisplayPrice: Story = {
  args: {
    price: numberAsPrice(0.01, Currency.Usd),
  },
};
export const EthOverflowDisplayPrice: Story = {
  args: {
    price: numberAsPrice(1000000, Currency.Eth),
  },
};
export const UsdOverflowDisplayPriceWithCustomCurrencyIcon: Story = {
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
export const UsdcUnderflowDisplayPriceWithCustomCurrencyIcon: Story = {
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
export const UsdcOverflowDisplayPriceWithCustomCurrencyIcon: Story = {
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
export const DaiUnderflowDisplayPriceWithCustomCurrencyIcon: Story = {
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
export const DaiOverflowDisplayPriceWithCustomCurrencyIcon: Story = {
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
export const WethUnderflowDisplayPriceWithCustomCurrencyIcon: Story = {
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
export const WethOverflowDisplayPriceWithCustomCurrencyIcon: Story = {
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
