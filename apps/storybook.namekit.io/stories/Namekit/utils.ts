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
  getDomainName,
  buildNFTRefFromENSName,
  ENSName,
  MAINNET,
} from "@namehash/ens-utils";
import { Normalization } from "@namehash/nameguard";

export const REGISTRATION_OF_EXPIRING_SOON_DOMAIN: Readonly<Registration> = {
  registrationTimestamp: subtractSeconds(now(), buildDuration(1000n)),
  expirationTimestamp: addSeconds(now(), buildDuration(4000n)),
  expiryTimestamp: null,
  primaryStatus: PrimaryRegistrationStatus.Active,
  secondaryStatus: SecondaryRegistrationStatus.ExpiringSoon,
};

export const REGISTRATION_OF_EXPIRED_DOMAIN: Readonly<Registration> = {
  registrationTimestamp: subtractSeconds(now(), buildDuration(1000n)),
  expirationTimestamp: addSeconds(now(), buildDuration(4000n)),
  expiryTimestamp: null,
  primaryStatus: PrimaryRegistrationStatus.Expired,
  secondaryStatus: SecondaryRegistrationStatus.GracePeriod,
};

export const REGISTRATION_OF_NORMAL_EXPIRATION_STATUS: Readonly<Registration> =
  {
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

export const getENSnameFor = (variant: ENSNameVariant): ENSName => {
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

export const MOCKED_DOMAIN_CARD_IS_OWNER_ADDRESS =
  "0x1a199654959140E5c1A2F4135fAA7Ba2748939C6";

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
    ? (MOCKED_DOMAIN_CARD_IS_OWNER_ADDRESS as `0x${string}`)
    : (MOCKED_DOMAIN_CARD_IS_OWNER_ADDRESS.replace("5", "6") as `0x${string}`);

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

  let ensName = getENSnameFor(ENSNameVariant.NormalizedWithAvatar);
  switch (normalization) {
    case Normalization.unnormalized:
      ensName = getENSnameFor(ENSNameVariant.Unnormalized);
      break;
    case Normalization.unknown:
      ensName = getENSnameFor(ENSNameVariant.Unknown);
      break;
  }

  const nft = buildNFTRefFromENSName(ensName, MAINNET, false);
  const parsedName = getDomainName(ensName.name);

  return {
    name,
    nft,
    parsedName,
    registration: registrationObj,
    nameGeneratorMetadata: null,
    onWatchlist: false,
    ...ownerProps,
  };
};
