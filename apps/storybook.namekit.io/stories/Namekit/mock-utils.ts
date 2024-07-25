import {
  Registration,
  getDomainRegistration,
  addSeconds,
  buildDuration,
  buildENSName,
  now,
  ENSName,
  Timestamp,
  buildAddress,
} from "@namehash/ens-utils";

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

export const MOCKED_0xString_3: `0x${string}` =
  "0x1a199354959140E5c1A2F4135fAA7Ba2748939C3";

export const MOCKED_ADDRESS_1 = buildAddress(MOCKED_0xString_1);
export const MOCKED_ADDRESS_2 = buildAddress(MOCKED_0xString_2);
export const MOCKED_ADDRESS_3 = buildAddress(MOCKED_0xString_3);
