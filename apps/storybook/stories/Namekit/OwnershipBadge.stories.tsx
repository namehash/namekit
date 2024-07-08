import type { Meta, StoryObj } from "@storybook/react";
import { OwnershipBadge } from "@namehash/namekit-react";
import {
  GRACE_PERIOD,
  PrimaryRegistrationStatus,
  SecondaryRegistrationStatus,
  addSeconds,
  buildAddress,
  buildDuration,
  buildENSName,
  now,
  subtractSeconds,
} from "@namehash/ens-utils";

const meta: Meta<typeof OwnershipBadge> = {
  component: OwnershipBadge,
  title: "Namekit/OwnershipBadge",
  parameters: {
    layout: "centered",
  },
  args: {
    onClickHandler: undefined,
    domain: {
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

type Story = StoryObj<typeof OwnershipBadge>;

export const DomainHasNoOwner: Story = {};

export const DomainHasActiveOwner: Story = {
  args: {
    addressToCompareOwnership: buildAddress(
      "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
    ),
    domain: {
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

export const DomainIsExpiredAndHadAnOwner: Story = {
  args: {
    addressToCompareOwnership: buildAddress(
      "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
    ),
    domain: {
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
        registrationTimestamp: subtractSeconds(now(), buildDuration(1000n)),
        expirationTimestamp: now(),
        expiryTimestamp: addSeconds(now(), GRACE_PERIOD),
        primaryStatus: PrimaryRegistrationStatus.Expired,
        secondaryStatus: SecondaryRegistrationStatus.GracePeriod,
      },
      nameGeneratorMetadata: null,
      onWatchlist: false,
      ownerAddress: null,
      managerAddress: null,
      formerOwnerAddress: "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
      formerManagerAddress: "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
    },
  },
};

export const BadgeWithOnClickHandler: Story = {
  args: {
    onClickHandler: () => alert("Active owner badge was clicked!"),
    addressToCompareOwnership: buildAddress(
      "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
    ),
    domain: {
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

export const AnotherBadgeWithOnClickHandler: Story = {
  args: {
    onClickHandler: () => alert("Former owner badge was clicked!"),

    addressToCompareOwnership: buildAddress(
      "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
    ),
    domain: {
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
        registrationTimestamp: subtractSeconds(now(), buildDuration(1000n)),
        expirationTimestamp: now(),
        expiryTimestamp: addSeconds(now(), GRACE_PERIOD),
        primaryStatus: PrimaryRegistrationStatus.Expired,
        secondaryStatus: SecondaryRegistrationStatus.GracePeriod,
      },
      nameGeneratorMetadata: null,
      onWatchlist: false,
      ownerAddress: null,
      managerAddress: null,
      formerOwnerAddress: "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
      formerManagerAddress: "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5",
    },
  },
};
