import {
  PrimaryRegistrationStatus,
  SecondaryRegistrationStatus,
} from "@namehash/ens-utils";
import type { Meta, StoryObj } from "@storybook/react";
import {
  RegistrationPriceInfo,
  RegistrationPriceInfoDisplayingFormat,
} from "@namehash/namekit-react";

export const DisplayIconWithTooltip: Story = {
  args: {
    displayIconWithTooltip:
      RegistrationPriceInfoDisplayingFormat.IconWithTooltip,
    registration: {
      expiryTimestamp: { time: 1709652875n },
      primaryStatus: PrimaryRegistrationStatus.Expired,
      secondaryStatus: SecondaryRegistrationStatus.RecentlyReleased,
      registrationTimestamp: { time: 1711380875n },
      expirationTimestamp: { time: 1709652875n },
    },
    parsedName: {
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
    },
  },
};
export const DisplayTextAndIcon: Story = {
  args: {
    displayIconWithTooltip: RegistrationPriceInfoDisplayingFormat.IconWithText,
    registration: {
      expiryTimestamp: { time: 1709652875n },
      primaryStatus: PrimaryRegistrationStatus.Expired,
      secondaryStatus: SecondaryRegistrationStatus.RecentlyReleased,
      registrationTimestamp: { time: 1711380875n },
      expirationTimestamp: { time: 1709652875n },
    },
    parsedName: {
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
    },
  },
};

const meta: Meta<typeof RegistrationPriceInfo> = {
  component: RegistrationPriceInfo,
  title: "Namekit/RegistrationPriceInfo",
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

type Story = StoryObj<typeof RegistrationPriceInfo>;
