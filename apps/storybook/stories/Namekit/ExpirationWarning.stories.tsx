import type { Meta, StoryObj } from "@storybook/react";
import { ExpirationWarning } from "@namehash/namekit-react";
import { DomainStatus, getMockedDomainCard } from "./utils";
import { buildAddress } from "@namehash/ens-utils";

const meta: Meta<typeof ExpirationWarning> = {
  component: ExpirationWarning,
  title: "Namekit/ExpirationWarning",
  parameters: {
    layout: "centered",
  },
  args: {
    viewerAddress: null,
    domain: getMockedDomainCard(DomainStatus.ExpiringSoon),
  },
};

export default meta;

type Story = StoryObj<typeof ExpirationWarning>;

export const DomainFarFromExpiring: Story = {
  args: {
    domain: getMockedDomainCard(DomainStatus.Normal),
  },
};

export const OnlyIconForADomainExpiringSoon: Story = {
  args: {
    domain: getMockedDomainCard(DomainStatus.ExpiringSoon),
  },
};

export const IconAndTextForADomainExpiringSoon: Story = {
  args: {
    onlyIcon: false,
    domain: getMockedDomainCard(DomainStatus.ExpiringSoon),
  },
};

export const OnlyIconForADomainExpired: Story = {
  args: {
    viewerAddress: buildAddress("0x1a199654959140E5c1A2F4135fAA7Ba2748939C5"),
    domain: getMockedDomainCard(DomainStatus.Expired, false),
  },
};

export const IconAndTextForADomainExpired: Story = {
  args: {
    onlyIcon: false,
    viewerAddress: buildAddress("0x1a199654959140E5c1A2F4135fAA7Ba2748939C5"),
    domain: getMockedDomainCard(DomainStatus.Expired, false),
  },
};

export const OnlyIconForADomainExpiredWhenDisplayingForDomainOwner: Story = {
  args: {
    viewerAddress: buildAddress("0x1a199654959140E5c1A2F4135fAA7Ba2748939C5"),
    domain: getMockedDomainCard(DomainStatus.Expired),
  },
};

export const IconAndTextForADomainExpiredWhenDisplayingForDomainOwner: Story = {
  args: {
    onlyIcon: false,
    viewerAddress: buildAddress("0x1a199654959140E5c1A2F4135fAA7Ba2748939C5"),
    domain: getMockedDomainCard(DomainStatus.Expired),
  },
};

export const OnIconClickHandler: Story = {
  args: {
    onIconClickHandler: () => alert("Icon was clicked!"),
  },
};

export const OnIconClickHandlerEvenInTextMode: Story = {
  args: {
    onlyIcon: false,
    onIconClickHandler: () => alert("Icon was clicked!"),
  },
};
