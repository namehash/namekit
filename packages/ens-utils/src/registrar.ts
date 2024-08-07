import { buildAddress } from "./address";
import { MAINNET } from "./chain";
import { buildContractRef, ContractRef } from "./contract";
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

/**
 * A `Registrar` in NameKit aims to provide a standardized "common denominator"
 * interface for interacting with one of the smart contracts responsible for
 * issuing subdomains in ENS.
 * 
 * ENS enables a `Registrar` to be configured at any level of the ENS domain
 * hierarchy. For example, ENS has a `Registrar` for the overall ENS root.
 * Beneath the root, ENS has a `Registrar` for the `.eth` TLD. Beneath `.eth`,
 * there is the `Registrar` for `uni.eth`, and so on.
 * 
 * NOTE: ENS enables an infinite set of possible registrar implementations.
 * NameKit aims for `Registrar` to support the registrar implementations that
 * are most popular within the ENS community, however some registrar
 * implementations may include policies that fall outside the range of what a
 * `Registrar` in NameKit is capable of modeling. If this happens, please
 * contact the team at NameHash Labs to discuss how we might better support
 * your registrar of interest.
 */
export interface Registrar {

  /**
   * @returns the name that this `Registrar` issues subnames for.
   */
  getName(): ENSName;

  /**
   * Checks if the provided `name` is a subname issued by this `Registrar`.
   * 
   * @param name the name to check if it is issued by this `Registrar`.
   * @returns the subname of `name` that is issued by this `Registrar`, or
   *          `null` if `name` is not a subname issued by this `Registrar`.
   * @example
   * // in the case that `getName()` for the `Registrar` is "cb.id"
   * getManagedSubname(buildENSName("abc.cb.id")) => buildENSName("abc")
   * @example
   * // in the case that `getName()` for the `Registrar` is "eth"
   * getManagedSubname(buildENSName("abc.cb.id")) => null
   */
  getManagedSubname(name: ENSName): ENSName | null;

  /**
   * Gets the subname of `name` that is issued by this `Registrar`.
   * 
   * @param name the name to get the issued subname of that was issued by this
   *             `Registrar`.
   * @returns the subname of `name` that is issued by this `Registrar`.
   * @throws `RegistrarUnsupportedNameError` if `name` is not a subname issued
   *         by this `Registrar`.
   */
  getValidatedSubname(name: ENSName): ENSName;

  /**
   * Gets the `ContractRef` for where the registrar being modeled by this
   * `Registrar` is found onchain.
   * 
   * NOTE: The returned `ContractRef` may not be the only contract with the
   * ability to serve as a subname registrar for `getName()`.
   * 
   * @returns the requested `ContractRef`.
   */
  getContractRef(): ContractRef;

  /**
   * Gets the `ContractRef` of the registry that this `Registrar` records
   *          subdomain registrations in.
   * 
   * If a `Registrar` issues subnames onchain then generally this returns
   * `MAINNET_ENS_REGISTRY_WITH_FALLBACK_CONTRACT`.
   * 
   * If the `Registrar` issues subnames offchain then this returns `null`.
   * 
   * @returns the requested `ContractRef` or `null` if the `Registrar` issues
   *          subnames offchain.
   */
  getOnchainRegistry(): ContractRef | null;

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

/**
 * Models a `Registrar` that issues subdomains into an onchain registry.
 * 
 * An `OnchainRegistrar` may live on Ethereum L1 or elsewhere on an L2, etc.
 */
export interface OnchainRegistrar extends Registrar {
  getOnchainRegistry(): ContractRef;
}

/**
 * Models a `Registrar` that issues subdomains into an offchain registry
 * through the use of ENSIP-10 (also known as "Wildcard Resolution").
 * 
 * Subdomains issued into an offchain registry as generally refered to as
 * "offchain subnames".
 * 
 * See https://docs.ens.domains/ensip/10 for more info.
 * 
 * Generally an `OffchainRegistrar` also makes use of the Cross Chain
 * Interoperability Protocol (also known as EIP-3668 or CCIP-Read for short) to
 * provide offchain management of resolver records for the offchain subnames it
 * issues.
 */
export interface OffchainRegistrar extends Registrar {
  getOnchainRegistry(): null;
}

/**
 * Identifies that a name was passed to a `Registrar` function that is not
 * issuable by that `Registrar`.
 *
 * @param message a reason why `name` is NOT issuable by `Registrar`.
 * @param label the `ENSName` value that is NOT issuable by `Registrar`.
 */
export class RegistrarUnsupportedNameError extends Error {
  public constructor(message: string, unsupportedName: ENSName) {
    super(`RegistrarUnsupportedNameError for name "${unsupportedName.name}": ${message}`);
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

/**
 * This is the current ENS registry.
 * 
 * Given the lookup of a node for a name in this registry, this contract
 * first attempts to find the data for that node in its own internal registry.
 * If that internal lookup fails, this contract then attempts to lookup the
 * same request in `MAINNET_OLD_ENS_REGISTRY` as a fallback in the case that
 * the requested node hasn't been migrated to this (new) registry yet.
 */
export const MAINNET_ENS_REGISTRY_WITH_FALLBACK_CONTRACT =
  buildContractRef(
    MAINNET,
    buildAddress("0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e"),
  );

/**
 * This is the old ENS registry. No new subnames should be issued here.
 */
export const MAINNET_OLD_ENS_REGISTRY =
  buildContractRef(
    MAINNET,
    buildAddress("0x314159265dD8dbb310642f98f50C066173C1259b"),
  );