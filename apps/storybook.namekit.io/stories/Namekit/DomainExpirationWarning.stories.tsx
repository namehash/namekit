import type { Meta, StoryObj } from "@storybook/react";
import { DomainExpirationWarning } from "@namehash/namekit-react";
import {
  DomainStatus,
  ENSNameVariant,
  getENSNameForVariant,
  getMockedRegistration,
  MOCKED_ADDRESS_1,
  MOCKED_ADDRESS_2,
  MOCKED_ADDRESS_3,
} from "./utils";

const meta: Meta<typeof DomainExpirationWarning> = {
  component: DomainExpirationWarning,
  title: "Namekit/DomainExpirationWarning",
  parameters: {
    layout: "centered",
  },
  args: {
    formerDomainOwnerAddress: MOCKED_ADDRESS_1,
    addressToCompareOwnership: MOCKED_ADDRESS_2,
    currentDomainOwnerAddress: MOCKED_ADDRESS_3,
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.Active,
    }),
    domainName: getENSNameForVariant({
      variant: ENSNameVariant.NormalizedWithAvatar,
    }),
    onIconClickHandler: () => {},
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
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.ExpiringSoon,
    }),
  },
};

export const IconAndTextForADomainExpiringSoon: Story = {
  args: {
    onlyIcon: false,
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.ExpiringSoon,
    }),
  },
};

export const OnlyIconForADomainExpired: Story = {
  args: {
    onlyIcon: true,
    addressToCompareOwnership: MOCKED_ADDRESS_1,
    formerDomainOwnerAddress: MOCKED_ADDRESS_2,
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.Expired,
    }),
  },
};

export const IconAndTextForADomainExpired: Story = {
  args: {
    onlyIcon: false,
    addressToCompareOwnership: MOCKED_ADDRESS_1,
    formerDomainOwnerAddress: MOCKED_ADDRESS_2,
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.Expired,
    }),
  },
};

export const OnlyIconForADomainExpiredWhenDisplayingForDomainOwner: Story = {
  args: {
    onlyIcon: true,
    addressToCompareOwnership: MOCKED_ADDRESS_1,
    formerDomainOwnerAddress: MOCKED_ADDRESS_1,
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.Expired,
    }),
  },
};

export const IconAndTextForADomainExpiredWhenDisplayingForDomainOwner: Story = {
  args: {
    onlyIcon: false,
    addressToCompareOwnership: MOCKED_ADDRESS_1,
    formerDomainOwnerAddress: MOCKED_ADDRESS_1,
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.Expired,
    }),
  },
};

export const OnIconClickHandler: Story = {
  args: {
    onIconClickHandler: () => alert("Icon was clicked!"),
    addressToCompareOwnership: MOCKED_ADDRESS_1,
    formerDomainOwnerAddress: MOCKED_ADDRESS_2,
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.Expired,
    }),
    onlyIcon: true,
  },
};

export const OnIconClickHandlerEvenInTextMode: Story = {
  args: {
    onlyIcon: false,
    onIconClickHandler: () => alert("Icon was clicked!"),
    addressToCompareOwnership: MOCKED_ADDRESS_1,
    formerDomainOwnerAddress: MOCKED_ADDRESS_2,
    domainRegistration: getMockedRegistration({
      domainStatus: DomainStatus.Expired,
    }),
  },
};
