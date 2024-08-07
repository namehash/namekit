import { ContractRef } from "./contract";
import { ENSName } from "./ensname";
import { NFTIssuer } from "./nft";
import { approxScalePrice, Price } from "./price";
import { Duration, SECONDS_PER_YEAR, TimePeriod, Timestamp } from "./time";

// REGISTRATION STATUSES ⬇️

// TODO: make more generic to support non .eth 2nd level domains
export enum PrimaryRegistrationStatus {
  Active = "Active",
  Expired = "Expired",
  NeverRegistered = "NeverRegistered",
}

// TODO: make more generic to support non .eth 2nd level domains
export enum SecondaryRegistrationStatus {
  ExpiringSoon = "ExpiringSoon",
  FullyReleased = "FullyReleased",
  GracePeriod = "GracePeriod",
  RecentlyReleased = "RecentlyReleased",
}

// TODO: make more generic to support non .eth 2nd level domains
export type Registration = {
  // Below timestamps are counted in seconds
  registrationTimestamp: Timestamp | null;
  expirationTimestamp: Timestamp | null;
  expiryTimestamp: Timestamp | null; // TODO: Franco, could you please remove this for us?

  primaryStatus: PrimaryRegistrationStatus;
  secondaryStatus: SecondaryRegistrationStatus | null;
};

/**
 * An action that may be taken on a name through a `Registrar`.
 */
export const RegistrarAction = {
  /** Create a new registration. */
  Register: "register",

  /** Extend an existing registration. */
  Renew: "renew",
} as const;

export type RegistrarAction =
  (typeof RegistrarAction)[keyof typeof RegistrarAction];

/**
 * The type of registrar charge that is being applied to the domain.
 */
export const RegistrarChargeType = {
  /** The base fee for the name. */
  BaseFee: "base-fee",

  /** A fee charged for names with special attributes. */
  SpecialNameFee: "special-name-fee",

  /** A temporary fee charged after a name has been recently released. */
  TemporaryFee: "recently-released-fee",

  /** A service fee. */
  ServiceFee: "service-fee",
} as const;

export type RegistrarChargeType =
  (typeof RegistrarChargeType)[keyof typeof RegistrarChargeType];

/**
 * A single distinct charge that must be paid to a `Registrar` to register or
 * renew a domain.
 */
export interface AbstractRegistrarCharge {
  /**
   * The type of `RegistrarCharge` that is being applied by the `Registrar` to
   * rent the domain.
   */
  type: RegistrarChargeType;

  /**
   * The price of the `RegistrarCharge` that must be paid to the `Registrar` to
   * rent the domain.
   */
  price: Price;

  /**
   * The reason why the `RegistrarCharge` is being applied by the `Registrar`
   * to rent the domain.
   */
  reason?: string;

  /**
   * The period of time that the `RegistrarCharge` is valid for.
   *
   * If `null`, the `RegistrarCharge` is not guaranteed to be time-limited.
   */
  validity?: TimePeriod;
}

export interface RegistrarBaseFee extends AbstractRegistrarCharge {
  type: typeof RegistrarChargeType.BaseFee;
  price: Price;
  reason?: undefined;
  validity?: undefined;
}

export interface RegistrarSpecialNameFee extends AbstractRegistrarCharge {
  type: typeof RegistrarChargeType.SpecialNameFee;
  price: Price;
  reason: string;
  validity?: undefined;
}

export interface RegistrarTemporaryFee extends AbstractRegistrarCharge {
  type: typeof RegistrarChargeType.TemporaryFee;
  price: Price;
  reason: string;
  validity: TimePeriod;
}

export interface RegistrarServiceFee extends AbstractRegistrarCharge {
  type: typeof RegistrarChargeType.ServiceFee;
  price: Price;
  reason?: string;
  validity?: undefined;
}

export type RegistrarCharge =
  | RegistrarBaseFee
  | RegistrarSpecialNameFee
  | RegistrarTemporaryFee
  | RegistrarServiceFee;

/**
 * A price quote from a `Registrar` to register or renew a domain for a given
 * period of time.
 */
export interface AbstractRegistrarPriceQuote {
  /**
   * The action associated with this `RegistrarPriceQuote`.
   */
  action: RegistrarAction;

  /**
   * The `TimePeriod` that this `RegistrarPriceQuote` is for.
   */
  rentalPeriod: TimePeriod;

  /**
   * The set of distinct `RegistrarCharge` values that must be paid to the
   * `Registrar` to rent the domain for the period of `rentalPeriod`.
   *
   * May be empty if the domain is free to rent for `rentalPeriod`.
   */
  charges: RegistrarCharge[];

  /**
   * The total price to rent the domain for the period of `rentalPeriod`.
   *
   * This is the sum of `charges` in the unit of currency that should be paid
   * to the registrar.
   */
  totalPrice: Price;
}

export interface RegistrationPriceQuote extends AbstractRegistrarPriceQuote {
  action: typeof RegistrarAction.Register;
}

export interface RenewalPriceQuote extends AbstractRegistrarPriceQuote {
  action: typeof RegistrarAction.Renew;
}

/*
  Top-Level Domains (TLDs), like .eth and .test, are owned by smart contracts 
  called registrars, which specify rules governing the allocation of their names. 
  Enabling seamless interoperability with the DNS (Domain Name System).

  The source of truth for a name and its subdomains does not always have to be on-chain 
  or on Ethereum L1 at all. By leveraging EIP-3668, the Cross Chain Interoperability 
  Protocol (or CCIP Read for short), we can load information by hitting a so called 
  "Gateway". Within the context of ENS, this enables us, to read names, addresses, 
  records, and more from other chains, or even off-chain. This is where the 
  concept of "on-chain registrars" and "off-chain registrars" comes into play. 
*/
export interface Registrar {
  getManagedSubname(name: ENSName): ENSName | null;

  // NOTE: Throws RegistrarUnsupportedNameError if name is not supported by this registrar
  getValidatedSubname(name: ENSName): ENSName;

  getOnchainRegistrar(): ContractRef | null;

  canRegister(
    name: ENSName,
    atTimestamp: Timestamp,
    duration: Duration,
    existingRegistration?: Registration,
  ): boolean;
  getRegistrationPriceQuote(
    name: ENSName,
    atTimestamp: Timestamp,
    duration: Duration,
    existingRegistration?: Registration,
  ): RegistrationPriceQuote;

  canRenew(
    name: ENSName,
    atTimestamp: Timestamp,
    duration: Duration,
    existingRegistration: Registration,
  ): boolean;
  getRenewalPriceQuote(
    name: ENSName,
    atTimestamp: Timestamp,
    duration: Duration,
    existingRegistration: Registration,
  ): RenewalPriceQuote;
}

export interface OnchainRegistrar extends Registrar {
  getOnchainRegistrar(): ContractRef;
}

export interface OffchainRegistrar extends Registrar {
  getOnchainRegistrar(): null;
}

/**
 * Identifies that a name was passed to a `Registrar` function that is not managed by that `Registrar`.
 *
 * @param message a reason why `name` is NOT managed by `Registrar`.
 * @param label the `ENSName` value that is NOT managed by `Registrar`.
 */
export class RegistrarUnsupportedNameError extends Error {
  public constructor(message: string, name: ENSName) {
    super(`RegistrarUnsupportedNameError for name "${name.name}": ${message}`);
    this.name = "RegistrarUnsupportedNameError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export const scaleAnnualPrice = (annualPrice: Price, duration: Duration) => {
  // Small performance optimization if no scaling is needed
  if (duration.seconds === SECONDS_PER_YEAR.seconds) return annualPrice;

  // TODO: verify we're doing this division of bigints correctly
  const scaledRate =
    Number(duration.seconds) / Number(SECONDS_PER_YEAR.seconds);

  return approxScalePrice(annualPrice, scaledRate);
};
