import type { Meta, StoryObj } from "@storybook/react";
import {
  RegistrationPriceInfo,
  RegistrationPriceInfoDisplayingFormat,
} from "@namehash/namekit-react";
import { DomainStatus, getMockedDomainCard } from "./mock-utils";

export const DisplayIconWithTooltip: Story = {
  args: {
    displayIconWithTooltip:
      RegistrationPriceInfoDisplayingFormat.IconWithTooltip,
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.RecentlyReleased,
    }),
  },
};
export const DisplayTextAndIcon: Story = {
  args: {
    displayIconWithTooltip: RegistrationPriceInfoDisplayingFormat.IconWithText,
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.RecentlyReleased,
    }),
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
