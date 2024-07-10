import { DomainCard } from "@namehash/namekit-react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  PrimaryRegistrationStatus,
  buildAddress,
  buildENSName,
} from "@namehash/ens-utils";
import { DomainStatus, getMockedDomainCard } from "./utils";
import { Normalization } from "@namehash/nameguard";

const meta: Meta<typeof DomainCard> = {
  component: DomainCard,
  title: "Namekit/DomainCard",
  args: {
    visitorAddress: buildAddress("0x1a199654959140E5c1A2F4135fAA7Ba2748939C6"),
    domainCard: {
      name: buildENSName("lightwalker.eth"),
      nft: {
        contract: {
          chain: {
            chainId: 1,
          },
          address: {
            address: "0x57f1887a8bf19b14fc0df6fd9b2acc9af6e5f6c2",
          },
        },
        token: {
          tokenId: 1n,
        },
      },
      parsedName: {
        namehash:
          "0x5c1f4e4189d173a562af8d27771e2a1394ccbfa466f0e72b429dd317afce4c06",
        slug: "lightwalker.eth",
        displayName: "lightwalker.eth",
        normalizedName: "lightwalker.eth",
        labelName: "lightwalker",
        labelHash:
          "c965e9bd2f3c07c8da17699e3e0a6abe39294dc6749ea2b239761d8ebcd7009b",
        unwrappedTokenId: 1n,
        wrappedTokenId: 1n,
      },
      registration: {
        registrationTimestamp: null,
        expirationTimestamp: null,
        expiryTimestamp: null,
        primaryStatus: PrimaryRegistrationStatus.Active,
        secondaryStatus: null,
      },
      nameGeneratorMetadata: null,
      onWatchlist: false,
      ownerAddress: "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
      managerAddress: "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
      formerOwnerAddress: null,
      formerManagerAddress: null,
    },
  },
};

export default meta;

type Story = StoryObj<typeof DomainCard>;

export const DomainOwnedByTheViewer: Story = {
  args: {
    domainCard: getMockedDomainCard({
      domainStatus: DomainStatus.Normal,
      isOwner: true,
    }),
  },
};

export const ExpiredDomainOwnedByTheViewer: Story = {
  args: {
    domainCard: getMockedDomainCard({ domainStatus: DomainStatus.Expired }),
  },
};

export const ExpiringSoonDomain: Story = {
  args: {
    domainCard: getMockedDomainCard({
      domainStatus: DomainStatus.ExpiringSoon,
      isOwner: false,
    }),
  },
};

export const WhenNoDomainInformedWeDisplayALoadingState: Story = {
  args: {
    withDomainMenu: false,
    domainCard: null,
  },
};

export const UnnormalizedDomain: Story = {
  args: {
    domainCard: getMockedDomainCard({
      domainStatus: DomainStatus.Normal,
      isOwner: false,
      normalization: Normalization.unnormalized,
    }),
  },
};

export const UnnormalizedDomainExpiringSoon: Story = {
  args: {
    domainCard: getMockedDomainCard({
      domainStatus: DomainStatus.ExpiringSoon,
      isOwner: false,
      normalization: Normalization.unnormalized,
    }),
  },
};

export const UnnormalizedDomainExpired: Story = {
  args: {
    domainCard: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
      isOwner: false,
      normalization: Normalization.unnormalized,
    }),
  },
};

export const UnnormalizedDomainExpiredAndOwnedByViewer: Story = {
  args: {
    domainCard: getMockedDomainCard({
      domainStatus: DomainStatus.Expired,
      isOwner: true,
      normalization: Normalization.unnormalized,
    }),
  },
};

export const UnknownDomain: Story = {
  args: {
    domainCard: getMockedDomainCard({
      domainStatus: DomainStatus.Normal,
      isOwner: false,
      normalization: Normalization.unknown,
    }),
  },
};

export const WithHoverEffect: Story = {};

export const WithoutHoverEffect: Story = {
  args: {
    withHoverEffect: false,
  },
};

export const WithActionOnClick: Story = {
  args: {
    withHoverEffect: false,
    nameCardClickHandler: () => alert("Hello! I was clicked!"),
  },
};

export const WithActionOnClickAndHoverEffect: Story = {
  args: {
    nameCardClickHandler: () => alert("Hello! I was clicked!"),
  },
};

export const WithoutActionOnClick: Story = {
  args: {
    withHoverEffect: false,
    nameCardClickHandler: undefined,
  },
};

export const WithoutDomainMenu: Story = {
  args: {
    withDomainMenu: false,
  },
};
