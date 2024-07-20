import type { Meta, StoryObj } from "@storybook/react";
import { DomainOwnershipBadge } from "@namehash/namekit-react";
import { buildAddress } from "@namehash/ens-utils";
import {
  DomainStatus,
  getMockedDomainCard,
  MOCKED_DOMAIN_CARD_IS_OWNER_ADDRESS,
  MOCKED_DOMAIN_CARD_NON_OWNER_ADDRESS,
} from "./utils";

const meta: Meta<typeof DomainOwnershipBadge> = {
  component: DomainOwnershipBadge,
  title: "Namekit/DomainOwnershipBadge",
  parameters: {
    layout: "centered",
  },
  args: {
    onClickHandler: undefined,
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Normal,
      isOwner: true,
    }),
  },
};

export default meta;

type Story = StoryObj<typeof DomainOwnershipBadge>;

export const DomainHasNoOwner: Story = {
  name: "Hidden (domain has no owner)",
};

export const UserIsNotOwnerOfDomain: Story = {
  name: "Hidden (domain has an owner but is not owned by user / visitor account)",
};

export const UserIsActiveOwnerOfDomain: Story = {
  args: {
    addressToCompareOwnership: buildAddress(
      MOCKED_DOMAIN_CARD_IS_OWNER_ADDRESS,
    ),
  },
};

export const UserIsFormerOwnerOfDomain: Story = {
  args: {
    addressToCompareOwnership: buildAddress(
      MOCKED_DOMAIN_CARD_NON_OWNER_ADDRESS,
    ),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
      isOwner: false,
    }),
  },
};

export const BadgeWithOnClickHandler: Story = {
  args: {
    onClickHandler: () => alert("Active owner badge was clicked!"),
    addressToCompareOwnership: buildAddress(
      MOCKED_DOMAIN_CARD_IS_OWNER_ADDRESS,
    ),
  },
};

export const AnotherBadgeWithOnClickHandler: Story = {
  args: {
    onClickHandler: () => alert("Former owner badge was clicked!"),
    addressToCompareOwnership: buildAddress(
      MOCKED_DOMAIN_CARD_NON_OWNER_ADDRESS,
    ),
    domain: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
      isOwner: false,
    }),
  },
};
