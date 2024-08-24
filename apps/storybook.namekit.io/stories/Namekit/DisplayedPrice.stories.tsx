import {
  CurrencySymbol,
  CurrencySymbolPosition,
  DisplayedPrice,
  PriceDisplaySize,
} from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Currency,
  CurrencySymbology,
  getCurrencySymbology,
} from "@namehash/ens-utils";
import React from "react";

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

export const EthPriceWithoutSymbol: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
  },
};
export const UsdPriceWithoutSymbol: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
  },
};
export const LargeUsdPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Large,
  },
};
export const LargeEthPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Large,
  },
};
export const MediumUsdPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Medium,
  },
};
export const MediumEthPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Medium,
  },
};
export const SmallUsdPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Small,
  },
};
export const SmallEthPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Small,
  },
};
export const MicroUsdPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Micro,
  },
};
export const MicroEthPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Micro,
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
export const UsdcMinDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 1n,
    },
  },
};
export const UsdcMaxDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 1000000000000000000n,
    },
  },
};
export const DaiMinDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Dai,
      value: 1n,
    },
  },
};
export const DaiMaxDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Dai,
      value: 10000000000000000000000000n,
    },
  },
};
export const WethMinDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 1n,
    },
  },
};
export const WethMaxDisplayPrice: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 1000000000000000000000000n,
    },
  },
};
export const UsdPriceAndSymbolExample: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbol: (
      <p>
        You can define your custom symbology by informing a React.ReactNode to
        the "symbol" prop!
      </p>
    ),
  },
};
export const UsdPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Usd}
      />
    ),
    symbolPosition: CurrencySymbolPosition.Left,
  },
};
export const UsdPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Usd, CurrencySymbology.Acronym)}
      </span>
    ),
    symbolPosition: CurrencySymbolPosition.Left,
  },
};
export const UsdPriceWithSymbolOnRight: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Usd}
      />
    ),
    symbolPosition: CurrencySymbolPosition.Right,
  },
};
export const UsdPriceWithAcronymOnRight: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Usd, CurrencySymbology.Acronym)}
      </span>
    ),
    symbolPosition: CurrencySymbolPosition.Right,
  },
};
export const EthPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Eth}
      />
    ),
    symbolPosition: CurrencySymbolPosition.Left,
  },
};
export const EthPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
    symbolPosition: CurrencySymbolPosition.Left,
  },
};
export const EthPriceWithSymbolOnRight: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Eth}
      />
    ),
    symbolPosition: CurrencySymbolPosition.Right,
  },
};
export const EthPriceWithAcronymOnRight: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
    symbolPosition: CurrencySymbolPosition.Right,
  },
};
export const EthPriceWithCurrencySymbol: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Eth}
      />
    ),
  },
};
export const WethPriceWithCurrencySymbol: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 1000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Weth}
      />
    ),
  },
};
export const DaiPriceWithCurrencySymbol: Story = {
  args: {
    price: {
      currency: Currency.Dai,
      value: 1000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Dai}
      />
    ),
  },
};
export const UsdcPriceWithCurrencySymbol: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 198900000n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Usdc}
      />
    ),
  },
};
export const UsdPriceWithCurrencySymbol: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={true}
        currency={Currency.Usd}
      />
    ),
  },
};
export const UsdPriceWithCurrencySymbolWithoutTooltipDescription: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    symbol: (
      <CurrencySymbol
        describeCurrencyInTooltip={false}
        currency={Currency.Usd}
      />
    ),
  },
};
export const EthMinDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 100000000000000n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const EthMaxDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 10000000000000000000000000n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const UsdMinDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 1n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const UsdMaxDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 1000000000000000000n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const UsdcMinDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 1n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const UsdcMaxDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 1000000000000000000n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const DaiMinDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Dai,
      value: 1n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const DaiMaxDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Dai,
      value: 10000000000000000000000000n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const WethMinDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 1n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const WethMaxDisplayPriceWithAcronym: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 1000000000000000000000000n,
    },
    symbol: (
      <span>
        {getCurrencySymbology(Currency.Eth, CurrencySymbology.Acronym)}
      </span>
    ),
  },
};
export const EthMinDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 100000000000000n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const EthMaxDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 10000000000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Eth}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const UsdMinDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 1n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Usd}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const UsdMaxDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 1000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Usd}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const UsdcMinDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 1n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Usdc}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const UsdcMaxDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 1000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Usdc}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const DaiMinDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Dai,
      value: 1n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Dai}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const DaiMaxDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Dai,
      value: 10000000000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Dai}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const WethMinDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 1n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Weth}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
export const WethMaxDisplayPriceWithSymbol: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 1000000000000000000000000n,
    },
    symbol: (
      <CurrencySymbol
        currency={Currency.Weth}
        describeCurrencyInTooltip={true}
      />
    ),
  },
};
