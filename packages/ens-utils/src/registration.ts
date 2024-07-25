import { GRACE_PERIOD, TEMPORARY_PREMIUM_PERIOD } from "./ethregistrar";
import { now, Timestamp } from "./time";

export enum PrimaryRegistrationStatus {
  Active = "Active",
  Expired = "Expired",
  NeverRegistered = "NeverRegistered",
}

export enum SecondaryRegistrationStatus {
  ExpiringSoon = "ExpiringSoon",
  FullyReleased = "FullyReleased",
  GracePeriod = "GracePeriod",
  RecentlyReleased = "RecentlyReleased",
}

export type Registration = {
  // Below timestamps are counted in seconds
  registrationTimestamp: Timestamp | null;
  expirationTimestamp: Timestamp | null;
  expiryTimestamp: Timestamp | null;

  primaryStatus: PrimaryRegistrationStatus;
  secondaryStatus: SecondaryRegistrationStatus | null;
};

export const getDomainRegistration = (
  expiryTimestamp: Timestamp,
): Registration => {
  const primaryStatus = getPrimaryRegistrationStatus(expiryTimestamp);
  const secondaryStatus = getSecondaryRegistrationStatus(expiryTimestamp);
  return {
    expiryTimestamp,
    primaryStatus,
    secondaryStatus,
    registrationTimestamp: null,
    expirationTimestamp: expiryTimestamp,
  };
};

export const getRegistrationForActiveDomain = (): Registration => {
  return {
    primaryStatus: PrimaryRegistrationStatus.NeverRegistered,
    secondaryStatus: null,
    registrationTimestamp: null,
    expirationTimestamp: null,
    expiryTimestamp: null,
  };
};

/* REGISTRATION STATUS ⬇️ */

const getPrimaryRegistrationStatus = (
  expiryTimestamp: Timestamp,
): PrimaryRegistrationStatus => {
  const nowTime = now();
  return nowTime.time < expiryTimestamp.time
    ? PrimaryRegistrationStatus.Active
    : PrimaryRegistrationStatus.Expired;
};

const getSecondaryRegistrationStatus = (
  expiryTimestamp: Timestamp,
): SecondaryRegistrationStatus | null => {
  const nowTime = now();
  if (nowTime.time < expiryTimestamp.time) {
    return nowTime.time > expiryTimestamp.time - GRACE_PERIOD.seconds
      ? SecondaryRegistrationStatus.ExpiringSoon
      : null;
  } else {
    if (
      expiryTimestamp.time +
        GRACE_PERIOD.seconds +
        TEMPORARY_PREMIUM_PERIOD.seconds <
      nowTime.time
    )
      return SecondaryRegistrationStatus.FullyReleased;
    else if (expiryTimestamp.time + GRACE_PERIOD.seconds > nowTime.time)
      return SecondaryRegistrationStatus.GracePeriod;
    else return SecondaryRegistrationStatus.RecentlyReleased;
  }
};
