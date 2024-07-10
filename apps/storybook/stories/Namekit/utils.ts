import {
  DomainCard,
  PrimaryRegistrationStatus,
  Registration,
  SecondaryRegistrationStatus,
  addSeconds,
  buildDuration,
  buildENSName,
  now,
  subtractSeconds,
} from "@namehash/ens-utils";
import { Normalization } from "@namehash/nameguard";

export const REGISTRATION_OF_EXPIRING_SOON_DOMAIN = {
  registrationTimestamp: subtractSeconds(now(), buildDuration(1000n)),
  expirationTimestamp: addSeconds(now(), buildDuration(4000n)),
  expiryTimestamp: null,
  primaryStatus: PrimaryRegistrationStatus.Active,
  secondaryStatus: SecondaryRegistrationStatus.ExpiringSoon,
};

export const REGISTRATION_OF_EXPIRED_DOMAIN = {
  registrationTimestamp: subtractSeconds(now(), buildDuration(1000n)),
  expirationTimestamp: addSeconds(now(), buildDuration(4000n)),
  expiryTimestamp: null,
  primaryStatus: PrimaryRegistrationStatus.Expired,
  secondaryStatus: SecondaryRegistrationStatus.GracePeriod,
};

export const REGISTRATION_OF_NORMAL_EXPIRATION_STATUS = {
  registrationTimestamp: null,
  expirationTimestamp: null,
  expiryTimestamp: null,
  primaryStatus: PrimaryRegistrationStatus.Active,
  secondaryStatus: null,
};

export enum DomainStatus {
  ExpiringSoon,
  Expired,
  Normal,
}

export type DomainCardOwnerProps = {
  ownerAddress: `0x${string}` | null;
  managerAddress: `0x${string}` | null;
  /** Former owner address is only set when the domain is in Grace Period */
  formerOwnerAddress: `0x${string}` | null;
  /** Former manager address is only set when the domain is in Grace Period */
  formerManagerAddress: `0x${string}` | null;
};

export enum ENSNameVariant {
  NormalizedWithAvatar = "NormalizedWithAvatar",
  NormalizedWithoutAvatar = "NormalizedWithoutAvatar",
  Unnormalized = "Unnormalized",
  Unknown = "Unknown",
}

export const getENSnameFor = (variant: ENSNameVariant) => {
  switch (variant) {
    case ENSNameVariant.NormalizedWithAvatar:
      return buildENSName("lightwalker.eth");
    case ENSNameVariant.NormalizedWithoutAvatar:
      return buildENSName("aksjdnaaksdjnsakjdnasd.eth");
    case ENSNameVariant.Unnormalized:
      return buildENSName("‍420.eth");
    case ENSNameVariant.Unknown:
      return buildENSName(
        "[c8712e1bff32e40db0e8e57e1b0d0d2b9733a30a9b63d3dfb06fa292a8a17348].eth",
      );
  }
};

export const getMockedDomainCard = ({
  domainStatus,
  isOwner = true,
  normalization = Normalization.normalized,
}: {
  isOwner?: boolean;
  domainStatus: DomainStatus;
  normalization?: Normalization;
}): DomainCard => {
  const address = isOwner
    ? "0x1a199654959140E5c1A2F4135fAA7Ba2748939C6"
    : "0x1a199654959140E5c1A2F4135fAA7Ba2748939C5";

  let registrationObj: Registration = REGISTRATION_OF_NORMAL_EXPIRATION_STATUS;
  let ownerProps: DomainCardOwnerProps = {
    ownerAddress: address,
    managerAddress: address,
    formerOwnerAddress: null,
    formerManagerAddress: null,
  };

  switch (domainStatus) {
    case DomainStatus.ExpiringSoon:
      registrationObj = REGISTRATION_OF_EXPIRING_SOON_DOMAIN;
      break;
    case DomainStatus.Expired:
      registrationObj = REGISTRATION_OF_EXPIRED_DOMAIN;
      ownerProps = {
        ownerAddress: null,
        managerAddress: null,
        formerOwnerAddress: address,
        formerManagerAddress: address,
      };
      break;
  }

  let name = getENSnameFor(ENSNameVariant.NormalizedWithAvatar);
  switch (normalization) {
    case Normalization.unnormalized:
      name = getENSnameFor(ENSNameVariant.Unnormalized);
      break;
    case Normalization.unknown:
      name = getENSnameFor(ENSNameVariant.Unknown);
      break;
  }

  return {
    name,
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
    // TODO: updated parsedName object based on the normalization wanted once API is once again available
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
    registration: registrationObj,
    nameGeneratorMetadata: null,
    onWatchlist: false,
    ...ownerProps,
  };
};
