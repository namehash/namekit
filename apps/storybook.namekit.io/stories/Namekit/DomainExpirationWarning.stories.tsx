import { DomainExpirationWarning } from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DomainStatus,
  getMockedDomainCard,
  getMockedDomainOwner,
} from "./mock-utils";

const meta: Meta<typeof DomainExpirationWarning> = {
  component: DomainExpirationWarning,
  title: "Namekit/DomainExpirationWarning",
  parameters: {
    layout: "centered",
  },
  args: {
    currentUserAddress: getMockedDomainOwner({ isOwner: false }),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.NeverRegistered,
    }),
    onlyIcon: false,
  },
};

export default meta;

type Story = StoryObj<typeof DomainExpirationWarning>;

export const DomainFarFromExpiring: Story = {
  name: "Hidden (domain far from expiring)",
};

export const OnlyIconForADomainExpiringSoon: Story = {
  args: {
    onlyIcon: true,
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.ExpiringSoon,
    }),
  },
};

export const IconAndTextForADomainExpiringSoon: Story = {
  args: {
    onlyIcon: false,
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.ExpiringSoon,
    }),
  },
};

export const OnlyIconForADomainExpired: Story = {
  args: {
    onlyIcon: true,
    currentUserAddress: getMockedDomainOwner({ isOwner: false }),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
      isOwner: true,
    }),
  },
};

export const IconAndTextForADomainExpired: Story = {
  args: {
    onlyIcon: false,
    currentUserAddress: getMockedDomainOwner({ isOwner: false }),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
      isOwner: true,
    }),
  },
};

export const OnlyIconForADomainExpiredWhenDisplayingForDomainOwner: Story = {
  args: {
    onlyIcon: true,
    currentUserAddress: getMockedDomainOwner({ isOwner: false }),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
    }),
  },
};

export const IconAndTextForADomainExpiredWhenDisplayingForDomainOwner: Story = {
  args: {
    onlyIcon: false,
    currentUserAddress: getMockedDomainOwner({ isOwner: false }),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
    }),
  },
};

export const OnIconClickHandler: Story = {
  args: {
    onIconClickHandler: () => alert("Icon was clicked!"),
    currentUserAddress: getMockedDomainOwner({ isOwner: true }),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
      isOwner: true,
    }),
    onlyIcon: true,
  },
};

export const OnIconClickHandlerEvenInTextMode: Story = {
  args: {
    onlyIcon: false,
    onIconClickHandler: () => alert("Icon was clicked!"),
    currentUserAddress: getMockedDomainOwner({ isOwner: true }),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
      isOwner: true,
    }),
  },
};
