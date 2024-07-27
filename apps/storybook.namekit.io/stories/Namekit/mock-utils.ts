import {
  now,
  MAINNET,
  ENSName,
  Timestamp,
  DomainCard,
  addSeconds,
  buildAddress,
  buildENSName,
  Registration,
  buildDuration,
  getDomainName,
  type Normalization,
  getDomainRegistration,
  buildNFTRefFromENSName,
} from "@namehash/ens-utils";

export type DomainCardOwnerProps = {
  ownerAddress: `0x${string}` | null;
  managerAddress: `0x${string}` | null;
  /** Former owner address is only set when the domain is in Grace Period */
  formerOwnerAddress: `0x${string}` | null;
  /** Former manager address is only set when the domain is in Grace Period */
  formerManagerAddress: `0x${string}` | null;
};

export const EXPIRATION_TIME_OF_EXPIRING_SOON_DOMAIN: Readonly<Timestamp> =
  addSeconds(now(), buildDuration(4000n));

export const EXPIRATION_TIME_OF_EXPIRED_DOMAIN: Readonly<Timestamp> = now();

export const EXPIRATION_TIME_OF_ACTIVE_DOMAIN: Readonly<Timestamp> = addSeconds(
  now(),
  buildDuration(8000n),
);

export const EXPIRATION_TIME_OF_RECENTLY_RELEASED_DOMAIN: Readonly<Timestamp> =
  addSeconds(now(), buildDuration(1000n));

export enum DomainStatus {
  RecentlyReleased,
  NeverRegistered,
  ExpiringSoon,
  Expired,
  Active,
}

export const getMockedRegistration = ({
  domainStatus,
}: {
  domainStatus: DomainStatus;
}): Registration => {
  switch (domainStatus) {
    case DomainStatus.NeverRegistered:
      return getDomainRegistration(null);
    case DomainStatus.RecentlyReleased:
      return getDomainRegistration(EXPIRATION_TIME_OF_RECENTLY_RELEASED_DOMAIN);
    case DomainStatus.Active:
      return getDomainRegistration(EXPIRATION_TIME_OF_ACTIVE_DOMAIN);
    case DomainStatus.ExpiringSoon:
      return getDomainRegistration(EXPIRATION_TIME_OF_EXPIRING_SOON_DOMAIN);
    case DomainStatus.Expired:
      return getDomainRegistration(EXPIRATION_TIME_OF_EXPIRED_DOMAIN);
  }
};

export enum ENSNameVariant {
  NormalizedWithAvatar = "NormalizedWithAvatar",
  NormalizedWithoutAvatar = "NormalizedWithoutAvatar",
  Unnormalized = "Unnormalized",
  Unknown = "Unknown",
}

export const getENSNameForVariant = ({
  variant,
}: {
  variant: ENSNameVariant;
}): ENSName => {
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

export const MOCKED_0xString_1: `0x${string}` =
  "0x1a199654959140E5c1A2F4135fAA7Ba2748939C6";
export const MOCKED_0xString_2: `0x${string}` =
  "0x1a111654151140E5c1A2F4135fAA7Ba2748139C6";

export const MOCKED_ADDRESS_1 = buildAddress(MOCKED_0xString_1);
export const MOCKED_ADDRESS_2 = buildAddress(MOCKED_0xString_2);

export const getMockedDomainOwner = ({ isOwner }: { isOwner: boolean }) => {
  return isOwner ? MOCKED_ADDRESS_1 : MOCKED_ADDRESS_2;
};

export const getMockedDomainCard = ({
  domainStatus,
  isOwner = false,
  normalization = "normalized",
}: {
  isOwner?: boolean;
  domainStatus: DomainStatus;
  normalization?: Normalization;
}): DomainCard => {
  const address = getMockedDomainOwner({ isOwner });

  let registrationObj: Registration = getMockedRegistration({ domainStatus });
  let ownerProps: DomainCardOwnerProps = {
    formerOwnerAddress: null,
    formerManagerAddress: null,
    ownerAddress: address.address,
    managerAddress: address.address,
  };

  switch (domainStatus) {
    case DomainStatus.ExpiringSoon:
      registrationObj = getMockedRegistration({ domainStatus });
      break;
    case DomainStatus.Expired:
      registrationObj = getMockedRegistration({ domainStatus });
      ownerProps = {
        ownerAddress: null,
        managerAddress: null,
        formerOwnerAddress: address.address,
        formerManagerAddress: address.address,
      };
      break;
  }

  let ensName = getENSNameForVariant({
    variant: ENSNameVariant.NormalizedWithAvatar,
  });
  switch (normalization) {
    case "unnormalized":
      ensName = getENSNameForVariant({
        variant: ENSNameVariant.Unnormalized,
      });
      break;
    case "unknown":
      ensName = getENSNameForVariant({
        variant: ENSNameVariant.Unknown,
      });
      break;
  }

  const nft = buildNFTRefFromENSName(ensName, MAINNET, false);
  const parsedName = getDomainName(ensName.name);

  return {
    nft,
    parsedName,
    name: ensName,
    ...ownerProps,
    onWatchlist: false,
    nameGeneratorMetadata: null,
    registration: registrationObj,
  };
};
