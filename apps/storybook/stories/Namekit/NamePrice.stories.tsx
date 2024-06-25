import {
  Currency,
  PrimaryRegistrationStatus,
  SecondaryRegistrationStatus,
} from "@namehash/ens-utils";
import {
  NamePrice,
  PriceDisplayPosition,
  PriceDisplaySize,
  CurrencySymbolPosition,
  CurrencySymbology,
} from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof NamePrice> = {
  component: NamePrice,
  title: "Namekit/NamePrice",
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

type Story = StoryObj<typeof NamePrice>;

const defaultRegistration = {
  expiryTimestamp: { time: 1709652875n },
  primaryStatus: PrimaryRegistrationStatus.Expired,
  secondaryStatus: SecondaryRegistrationStatus.RecentlyReleased,
  registrationTimestamp: { time: 1711380875n },
  expirationTimestamp: { time: 1709652875n },
};

const defaultParsedName = {
  namehash:
    "0xc4feb2ef28ae93ad2847cc7aaa8d614509f29feea35c86555550f071e26cec83",
  slug: "xtest$1709652875$$$false.eth",
  displayName: "xtest$1709652875$$$false.eth",
  normalizedName: "xtest$1709652875$$$false.eth",
  labelName: "xtest$1709652875$$$false",
  labelHash:
    "0xf9e2a96524775e288c37920e5191e62ebad982b8c357713106bd430646f00146",
  unwrappedTokenId:
    113026375855800814118284943830039256141780833603018686252863399931967234376006n,
  wrappedTokenId:
    89103332435335212332047307598497361224309437240941958630163555473262172236931n,
};

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
    altPriceDisplayFormat: false,
    registration: defaultRegistration,
    parsedName: defaultParsedName,
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
    altPriceDisplayFormat: false,
    registration: defaultRegistration,
    parsedName: defaultParsedName,
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
    registration: defaultRegistration,
    parsedName: defaultParsedName,
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
    registration: defaultRegistration,
    parsedName: defaultParsedName,
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
    registration: defaultRegistration,
    parsedName: defaultParsedName,
  },
};
export const DisplaySymbologyAtLeft: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 19890000n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbolPosition: CurrencySymbolPosition.Left,
    registration: defaultRegistration,
    parsedName: defaultParsedName,
  },
};
export const DisplaySymbologyAtRight: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 19890000n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    symbolPosition: CurrencySymbolPosition.Right,
    registration: defaultRegistration,
    parsedName: defaultParsedName,
  },
};
export const DisplaySymbolSymbology: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 19890000n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    currencySymbology: CurrencySymbology.Symbol,
    registration: defaultRegistration,
    parsedName: defaultParsedName,
  },
};
export const DisplayAcronymSymbology: Story = {
  args: {
    price: {
      currency: Currency.Usdc,
      value: 19890000n,
    },
    altPrice: {
      currency: Currency.Eth,
      value: 1000000000000000000n,
    },
    currencySymbology: CurrencySymbology.Acronym,
    registration: defaultRegistration,
    parsedName: defaultParsedName,
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
    registration: defaultRegistration,
    parsedName: defaultParsedName,
  },
};
