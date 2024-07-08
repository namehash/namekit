import {
  PrimaryRegistrationStatus,
  SecondaryRegistrationStatus,
  buildTimestamp,
  now,
} from "@namehash/ens-utils";
import type { Meta, StoryObj } from "@storybook/react";
import {
  RegistrationPriceInfo,
  RegistrationPriceInfoDisplayingFormat,
} from "@namehash/namekit-react";

const ELEVEN_DAYS_FROM_NOW_TIMESTAMP = buildTimestamp(
  BigInt(new Date().getTime()) / 1005n,
);

export const DisplayIconWithTooltip: Story = {
  args: {
    displayIconWithTooltip:
      RegistrationPriceInfoDisplayingFormat.IconWithTooltip,
    registration: {
      expiryTimestamp: ELEVEN_DAYS_FROM_NOW_TIMESTAMP,
      primaryStatus: PrimaryRegistrationStatus.Expired,
      secondaryStatus: SecondaryRegistrationStatus.RecentlyReleased,
      registrationTimestamp: now(),
      expirationTimestamp: now(),
    },
    parsedName: {
      namehash:
        "0x54f4b08bc10ab9368020f2afdd830ab742058481586c4ae87ba6e37c8912a6ec",
      slug: "expiredDomain.eth",
      displayName: "expiredDomain.eth",
      normalizedName: "expiredDomain.eth",
      labelName: "expiredDomain",
      labelHash:
        "0x9458d05651ff8443f025747bf1a859bb26f2815f70d68e8cc9286027013961cd",
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
      expiryTimestamp: ELEVEN_DAYS_FROM_NOW_TIMESTAMP,
      primaryStatus: PrimaryRegistrationStatus.Expired,
      secondaryStatus: SecondaryRegistrationStatus.RecentlyReleased,
      registrationTimestamp: now(),
      expirationTimestamp: now(),
    },
    parsedName: {
      namehash:
        "0x54f4b08bc10ab9368020f2afdd830ab742058481586c4ae87ba6e37c8912a6ec",
      slug: "expiredDomain.eth",
      displayName: "expiredDomain.eth",
      normalizedName: "expiredDomain.eth",
      labelName: "expiredDomain",
      labelHash:
        "0x9458d05651ff8443f025747bf1a859bb26f2815f70d68e8cc9286027013961cd",
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
  parameters: {
    layout: "centered",
  },
  argTypes: {
    displayIconWithTooltip: {
      options: RegistrationPriceInfoDisplayingFormat,
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

type Story = StoryObj<typeof RegistrationPriceInfo>;
