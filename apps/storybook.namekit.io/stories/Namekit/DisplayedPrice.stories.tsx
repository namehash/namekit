import { DisplayedPrice, PriceDisplaySize } from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";
import { Currency } from "@namehash/ens-utils";
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
    tooltipTriggerToDisplayPriceInTooltip: {
      control: "text",
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

export const EthPrice: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
  },
};
export const EthPriceInATooltip: Story = {
  args: {
    price: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    tooltipTriggerToDisplayPriceInTooltip: (
      <p className="nk-underline">My custom trigger</p>
    ),
  },
};
export const UsdPrice: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
  },
};
export const LargePriceDisplaySizeForUSD: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Large,
  },
};
export const LargePriceDisplaySizeForWETH: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Large,
  },
};
export const MediumPriceDisplaySizeForUSD: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Medium,
  },
};
export const MediumPriceDisplaySizeForWETH: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Medium,
  },
};
export const SmallPriceDisplaySizeForUSD: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Small,
  },
};
export const SmallPriceDisplaySizeForWETH: Story = {
  args: {
    price: {
      currency: Currency.Weth,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Small,
  },
};
export const MicroPriceDisplaySizeForUSD: Story = {
  args: {
    price: {
      currency: Currency.Usd,
      value: 198900n,
    },
    displaySize: PriceDisplaySize.Micro,
  },
};
export const MicroPriceDisplaySizeForWETH: Story = {
  args: {
    price: {
      currency: Currency.Weth,
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
