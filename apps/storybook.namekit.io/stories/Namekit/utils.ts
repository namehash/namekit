import {
  Registration,
  getDomainRegistration,
  getRegistrationForActiveDomain,
  addSeconds,
  buildDuration,
  buildENSName,
  now,
  ENSName,
  Timestamp,
  buildAddress,
} from "@namehash/ens-utils";

export const REGISTRATION_OF_EXPIRING_SOON_DOMAIN: Readonly<Timestamp> =
  addSeconds(now(), buildDuration(4000n));

export const REGISTRATION_OF_EXPIRED_DOMAIN: Readonly<Timestamp> = now();

export enum DomainStatus {
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
    case DomainStatus.Active:
      return getRegistrationForActiveDomain();
    case DomainStatus.ExpiringSoon:
      return getDomainRegistration(REGISTRATION_OF_EXPIRING_SOON_DOMAIN);
    case DomainStatus.Expired:
      return getDomainRegistration(REGISTRATION_OF_EXPIRED_DOMAIN);
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
export const MOCKED_0xString_2 = MOCKED_0xString_1.replace(
  "5",
  "6",
) as `0x${string}`;
export const MOCKED_0xString_3 = MOCKED_0xString_2.replace(
  "6",
  "4",
) as `0x${string}`;
export const MOCKED_ADDRESS_1 = buildAddress(MOCKED_0xString_1);
export const MOCKED_ADDRESS_2 = buildAddress(MOCKED_0xString_2);
export const MOCKED_ADDRESS_3 = buildAddress(MOCKED_0xString_3);

export type DomainCardOwnerProps = {
  ownerAddress: `0x${string}` | null;
  managerAddress: `0x${string}` | null;
  /** Former owner address is only set when the domain is in Grace Period */
  formerOwnerAddress: `0x${string}` | null;
  /** Former manager address is only set when the domain is in Grace Period */
  formerManagerAddress: `0x${string}` | null;
};
