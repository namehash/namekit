import {
  ENSName,
  MIN_ETH_REGISTRABLE_LABEL_LENGTH,
  ETH_TLD,
  charCount,
  buildENSName,
} from "./ensname";
import { buildContractRef, ContractRef } from "./contract";
import {
  Duration,
  SECONDS_PER_DAY,
  Timestamp,
  addSeconds,
  buildDuration,
  buildTimePeriod,
  formatTimestampAsDistanceToNow,
  now,
  scaleDuration,
} from "./time";
import {
  Price,
  addPrices,
  approxScalePrice,
  buildPrice,
  formattedPrice,
  subtractPrices,
} from "./price";
import { Currency } from "./currency";
import {
  PrimaryRegistrationStatus,
  RegistrarChargeType,
  RegistrarUnsupportedNameError,
  Registration,
  SecondaryRegistrationStatus,
  RegistrarCharge,
  RegistrarTemporaryFee,
  RegistrarBaseFee,
  RegistrarSpecialNameFee,
  RegistrationPriceQuote,
  RegistrarAction,
  RenewalPriceQuote,
  OnchainRegistrar,
  MAINNET_ENS_REGISTRY_WITH_FALLBACK_CONTRACT,
} from "./registrar";
import { scaleAnnualPrice } from "./price";
import { MAINNET } from "./chain";
import { buildAddress } from "./address";

/**
 * The `EthRegistrar` models the policy implmentations shared by both of
 * the `OnchainRegistrar` contracts that actively issue subnames for the .eth
 * TLD (as of July 2024).
 *  
 * These registrars enable trustless decentralized subnames to be issued 
 * as NFTs on Ethereum L1.
 */
export class EthRegistrar implements OnchainRegistrar {
  public static readonly Name = buildENSName(ETH_TLD);
  
  protected readonly registrarContract: ContractRef;

  public constructor(registrarContract: ContractRef) {
    this.registrarContract = registrarContract;
  }

  public getName = (): ENSName => {
    return EthRegistrar.Name;
  }

  public getManagedSubname = (name: ENSName): ENSName | null => {
    // must have exactly 2 labels to be a direct subname of ".eth"
    if (name.labels.length !== 2) return null;

    // last label must be "eth"
    if (name.labels[1] !== ETH_TLD) return null;

    // NOTE: now we know we have a direct subname of ".eth"

    // first label must be of sufficient length
    const subnameLength = charCount(name.labels[0]);
    if (subnameLength < MIN_ETH_REGISTRABLE_LABEL_LENGTH) return null;

    // TODO: also add a check for a maximum length limit as enforced by max block size, etc?

    return buildENSName(name.labels[0]);
  };

  public getValidatedSubname = (name: ENSName): ENSName => {
    const subname = this.getManagedSubname(name);
    if (subname === null)
      throw new RegistrarUnsupportedNameError(
        "Name is not directly managed by the .ETH registrar",
        name,
      );

    return subname;
  };

  public getContractRef(): ContractRef {
    return this.registrarContract;
  }

  public getOnchainRegistry(): ContractRef {
    return MAINNET_ENS_REGISTRY_WITH_FALLBACK_CONTRACT;
  }

  public canRegister(
    name: ENSName,
    atTimestamp: Timestamp,
    duration: Duration,
    existingRegistration?: Registration,
  ): boolean {
    if (!this.getManagedSubname(name)) {
      // name is not directly managed by this registrar
      return false;
    }

    if (existingRegistration) {
      const releaseTimestamp = getDomainReleaseTimestamp(existingRegistration);

      if (releaseTimestamp && releaseTimestamp.time > atTimestamp.time) {
        // if the name is not yet released, we can't register it
        // TODO: check for possible off-by-1 errors in the logic above
        return false;
      }
    }

    if (!isValidRegistrationDuration(duration))
      return false;

    return true;
  }

  public getRegistrationPriceQuote(
    name: ENSName,
    atTimestamp: Timestamp,
    duration: Duration,
    existingRegistration?: Registration,
  ): RegistrationPriceQuote {
    if (!this.canRegister(name, atTimestamp, duration, existingRegistration)) {
      // TODO: refine the way we handle these exception cases.
      throw new Error(
        `Cannot build registration price quote for name: "${name.name}".`,
      );
    }

    const rentalPeriod = buildTimePeriod(
      atTimestamp,
      addSeconds(atTimestamp, duration),
    );

    let charges = this.getDurationCharges(name, duration);

    let temporaryPremium: RegistrarTemporaryFee | null = null;

    if (existingRegistration) {
      temporaryPremium = this.getTemporaryPremiumCharge(
        name,
        existingRegistration,
        atTimestamp,
      );
      if (temporaryPremium) {
        charges = [...charges, temporaryPremium];
      }
    }

    const totalPrice = addPrices(charges.map((charge) => charge.price));

    return {
      action: RegistrarAction.Register,
      rentalPeriod,
      charges,
      totalPrice,
    };
  }

  public canRenew(
    name: ENSName,
    atTimestamp: Timestamp,
    duration: Duration,
    existingRegistration: Registration,
  ): boolean {
    if (!this.getManagedSubname(name)) {
      // name is not directly managed by this registrar
      return false;
    }

    if (existingRegistration) {
      if (
        existingRegistration.registrationTimestamp &&
        atTimestamp.time < existingRegistration.registrationTimestamp.time
      ) {
        // if the renewal is requested before the registration, we can't renew it
        // TODO: check for possible off-by-1 errors in the logic above
        return false;
      }

      const releaseTimestamp = getDomainReleaseTimestamp(existingRegistration);

      if (releaseTimestamp && releaseTimestamp.time > atTimestamp.time) {
        // if the name is released, we can't renew it anymore
        // TODO: check for possible off-by-1 errors in the logic above
        return false;
      }
    }

    if (duration.seconds < MIN_RENEWAL_DURATION.seconds)
      return false;

    return true;
  }

  public getRenewalPriceQuote(
    name: ENSName,
    atTimestamp: Timestamp,
    duration: Duration,
    existingRegistration: Registration,
  ): RenewalPriceQuote {
    if (!this.canRenew(name, atTimestamp, duration, existingRegistration)) {
      throw new Error(
        `Cannot build renewal price quote for name: "${name.name}".`,
      );
    }

    if (!existingRegistration.expirationTimestamp) {
      throw new Error(`Invariant violation`); // TODO: refine message... just making the type system happy.
    }

    // TODO: review for possible off-by-1 errors
    const newExpiration = addSeconds(
      existingRegistration.expirationTimestamp,
      duration,
    );
    const rentalPeriod = buildTimePeriod(
      existingRegistration.expirationTimestamp,
      newExpiration,
    );

    const charges = this.getDurationCharges(name, duration);
    const totalPrice = addPrices(charges.map((charge) => charge.price));

    return {
      action: RegistrarAction.Renew,
      rentalPeriod,
      charges,
      totalPrice,
    };
  }

  protected getAnnualCharges(name: ENSName): RegistrarCharge[] {
    let baseRate: Price;
    let hasSpecialNameFee: boolean;

    const subname = this.getValidatedSubname(name);
    const subnameLength = charCount(subname.name);

    if (subnameLength === 3) {
      baseRate = THREE_CHAR_BASE_PRICE;
      hasSpecialNameFee = true;
    } else if (subnameLength === 4) {
      baseRate = FOUR_CHAR_BASE_PRICE;
      hasSpecialNameFee = true;
    } else {
      baseRate = DEFAULT_BASE_PRICE;
      hasSpecialNameFee = false;
    }

    if (!hasSpecialNameFee) {
      const baseFee: RegistrarBaseFee = {
        type: RegistrarChargeType.BaseFee,
        price: baseRate,
      };

      return [baseFee];
    }

    const priceStr = formattedPrice({
      price: baseRate,
      withPrefix: true,
    });

    // TODO NOTE FOR FRANCO: The approach here means we don't put special
    // formatting on the price at a UI-level anymore for now. It's not worth the
    // added complexity right now.
    const specialNameFee: RegistrarSpecialNameFee = {
      type: RegistrarChargeType.SpecialNameFee,
      price: baseRate,
      reason: `${subnameLength}-character names are ${priceStr} / year to register.`,
    };

    return [specialNameFee];
  }

  protected getDurationCharges = (
    name: ENSName,
    duration: Duration,
  ): RegistrarCharge[] => {
    const rentalCharges = this.getAnnualCharges(name);
    const scaledCharges = rentalCharges.map((charge) => {
      return {
        ...charge,
        price: scaleAnnualPrice(charge.price, duration),
      };
    });

    return scaledCharges;
  };

  protected getTemporaryPremiumCharge = (
    name: ENSName,
    existingRegistration: Registration,
    atTimestamp: Timestamp,
  ): RegistrarTemporaryFee | null => {
    if (!existingRegistration.expirationTimestamp) return null;

    const temporaryPremiumPrice = getTemporaryPremiumPriceAtTimestamp(
      existingRegistration,
      atTimestamp,
    );
    if (!temporaryPremiumPrice) return null;

    const begin = addSeconds(
      existingRegistration.expirationTimestamp,
      GRACE_PERIOD,
    );
    const end = addSeconds(begin, TEMPORARY_PREMIUM_PERIOD);
    const premiumPeriod = buildTimePeriod(begin, end);

    const standardAnnualCharges = this.getAnnualCharges(name);
    const standardAnnualPrice = addPrices(
      standardAnnualCharges.map((charge) => charge.price),
    );

    const priceStr = formattedPrice({
      price: standardAnnualPrice,
      withPrefix: true,
    });

    const premiumEndsIn = formatTimestampAsDistanceToNow(premiumPeriod.end);

    // TODO NOTE FOR FRANCO: The approach here means we don't put special
    // formatting on the price at a UI-level anymore for now. It's not worth the
    // added complexity right now.
    const temporaryPremiumReason = `Recently released. Temporary premium ends ${premiumEndsIn}. Discounts continuously until dropping to ${priceStr} / year.`;

    const temporaryFee: RegistrarTemporaryFee = {
      type: RegistrarChargeType.TemporaryFee,
      price: temporaryPremiumPrice,
      reason: temporaryPremiumReason,
      validity: premiumPeriod, // NOTE: This provides the exact `Timestamp` when the temporary premium is scheduled to begin and end.
    };

    return temporaryFee;
  };
}

/**
 * The minimum days a .eth name can be registered for.
 * 
 * This value is enforced by EthRegistrarController contracts.
 */
export const MIN_REGISTRATION_PERIOD_DAYS = 28n;

/**
 * The minimum Duration a .eth name can be registered for.
 * 
 * This value is enforced by EthRegistrarController contracts.
 * 
 * 28 days or 2,419,200 seconds.
 */
export const MIN_REGISTRATION_PERIOD: Readonly<Duration> = scaleDuration(SECONDS_PER_DAY, MIN_REGISTRATION_PERIOD_DAYS);

/**
 * The minimum Duration a .eth name can be renewed for.
 * 
 * 1 second.
 * 
 * This value is enforced by EthRegistrarController contracts.
 */
export const MIN_RENEWAL_DURATION: Readonly<Duration> = buildDuration(1n);

/**
 * The maximum days before the registration of a .eth name expires when we
 * consider it helpful to provide a more visible notice that the name expires
 * soon and should be renewed as soon as possible to avoid loss.
 * 
 * This is an arbitrary value we selected for UX purposes. It is not an ENS
 * standard and is not enforced by any EthRegistrarController contracts.
 */
export const MAX_EXPIRING_SOON_PERIOD_DAYS = 90n;

/**
 * The Duration before the registration of a .eth name expires when we
 * consider it helpful to provide a more visible notice that the name expires
 * soon and should be renewed as soon as possible to avoid loss.
 * 
 * This is an arbitrary value we selected for UX purposes. It is not an ENS
 * standard and is not enforced by any EthRegistrarController contracts.
 * 
 * 90 days or 7,776,000 seconds.
 */
export const MAX_EXPIRING_SOON_PERIOD: Readonly<Duration> = scaleDuration(SECONDS_PER_DAY, MAX_EXPIRING_SOON_PERIOD_DAYS);

/**
 * The number of days an expired registration of a .eth name is in a grace
 * period prior to being released to the public.
 * 
 * This value is enforced by EthRegistrarController contracts.
 */
export const GRACE_PERIOD_DAYS = 90n;

/**
 * The Duration an expired registration of a .eth name is in a grace period
 * prior to being released to the public.
 * 
 * This value is enforced by EthRegistrarController contracts.
 * 
 * 90 days or 7,776,000 seconds.
 */
export const GRACE_PERIOD: Readonly<Duration> = scaleDuration(SECONDS_PER_DAY, GRACE_PERIOD_DAYS);

/**
 * The number of days a recently released .eth name has a temporary premium
 * price applied.
 * 
 * This value is enforced by EthRegistrarController contracts.
 */
export const TEMPORARY_PREMIUM_PERIOD_DAYS = 21n;

/**
 * The Duration a recently released .eth name has a temporary premium price applied.
 * 
 * This value is enforced by EthRegistrarController contracts.
 * 
 * 21 days or 1,814,400 seconds.
 */
export const TEMPORARY_PREMIUM_PERIOD: Readonly<Duration> = scaleDuration(SECONDS_PER_DAY, TEMPORARY_PREMIUM_PERIOD_DAYS);

/**
 * Identifies if the provided `duration` of registration would be accepted by
 * EthRegistrarController contracts.
 * 
 * @param duration The registration duration to evaluate.
 * @returns true if the provided `duration` is valid, false otherwise.
 */
const isValidRegistrationDuration = (duration: Duration): boolean => {
  return duration.seconds >= MIN_REGISTRATION_PERIOD.seconds;
}

/**
 * Validates that the provided `duration` of registration would be accepted by
 * EthRegistrarController contracts.
 * 
 * @param duration The registration duration to evaluate.
 * @throws Error if the provided `duration` is not valid.
 */
const validateRegistrationDuration = (duration: Duration): void => {
  if (!isValidRegistrationDuration(duration))
    throw new Error(`Invalid registration duration: ${duration.seconds} seconds. Minimum registration period is ${MIN_REGISTRATION_PERIOD_DAYS} days or ${MIN_REGISTRATION_PERIOD.seconds} seconds.`);
}

// REGISTRATION PRICE ⬇️

/**
 * At the moment a .eth name expires, this recently released temporary premium is added to its price.
 * NOTE: The actual recently released temporary premium added subtracts `PREMIUM_OFFSET`.
 */
const PREMIUM_START_PRICE: Price = {
  value: 10000000000n /* $100,000,000.00 (100 million USD) */,
  currency: Currency.Usd,
};

/**
 * The recently released temporary premium drops exponentially by 50% each day.
 */
const PREMIUM_DECAY = 0.5;

/**
 * Goal:
 *  The temporary premium should drop to $0.00 after exactly `PREMIUM_DAYS` days have passed.
 *
 * Challenge:
 *  If we decay `PREMIUM_START` by a rate of `PREMIUM_DECAY` each day over the course of
 *  `PREMIUM_DAYS` days we don't get $0.00 USD. Instead, we get this `PREMIUM_OFFSET` value
 *  ($47.68 USD).
 *
 * Solution:
 *  Subtract this value from the decayed temporary premium to get the actual temporary premium.
 */
const PREMIUM_OFFSET = approxScalePrice(
  PREMIUM_START_PRICE,
  PREMIUM_DECAY ** Number(TEMPORARY_PREMIUM_PERIOD_DAYS),
);

/**
 * @param registration The registration to calculate the temporary premium price for.
 * @param atTimestamp Timestamp. The moment to calculate the temporary premium price.
 * @returns Price. The temporary premium price at the moment of `atTimestamp` or `null` if there is no
 *          known temporary premium `atTimestamp`.
 */
const getTemporaryPremiumPriceAtTimestamp = (
  registration: Registration,
  atTimestamp: Timestamp,
): Price | null => {
  if (!registration.expirationTimestamp) return null;

  const releasedTimestamp = addSeconds(
    registration.expirationTimestamp,
    GRACE_PERIOD,
  );
  const secondsSinceRelease = atTimestamp.time - releasedTimestamp.time;
  if (secondsSinceRelease < 0) {
    /* if as of the moment of `atTimestamp` a name hasn't expired yet then there is no temporaryPremium */
    return null;
  }

  const fractionalDaysSinceRelease =
    Number(secondsSinceRelease) / Number(SECONDS_PER_DAY.seconds);

  const decayFactor = PREMIUM_DECAY ** fractionalDaysSinceRelease;

  const decayedPrice = approxScalePrice(PREMIUM_START_PRICE, decayFactor);
  const offsetDecayedPrice = subtractPrices(decayedPrice, PREMIUM_OFFSET);

  if (offsetDecayedPrice.value < 0n) {
    /* the temporary premium can never be less than $0.00 */
    return null;
  }

  return offsetDecayedPrice;
};

/**
 * $5.00 USD
 */
const DEFAULT_BASE_PRICE: Readonly<Price> = buildPrice(500n, Currency.Usd);

/**
 * $640.00 USD
 */
const THREE_CHAR_BASE_PRICE: Readonly<Price> = buildPrice(64000n, Currency.Usd);

/**
 * $160.00 USD
 */
const FOUR_CHAR_BASE_PRICE: Readonly<Price> = buildPrice(16000n, Currency.Usd);

export const getDomainRegistration = (
  /*
    When null, a domain is considered to be not registered.
  */
  expiryTimestamp: Timestamp | null,
): Registration => {
  if (!expiryTimestamp) {
    return {
      primaryStatus: PrimaryRegistrationStatus.NeverRegistered,
      secondaryStatus: null,
      registrationTimestamp: null,
      expirationTimestamp: null,
      expiryTimestamp: null,
    };
  }

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

// RELEASE STATUS ⬇️

/**
 * Returns the release timestamp of a domain, which is 90 days after expiration when the Grace Period ends
 * @param domainRegistration Registration object from domain
 * @returns Timestamp | null
 */
export function getDomainReleaseTimestamp(
  domainRegistration: Registration,
): Timestamp | null {
  if (!domainRegistration.expirationTimestamp) return null;

  return addSeconds(domainRegistration.expirationTimestamp, GRACE_PERIOD);
}

export const MAINNET_WRAPPING_ETH_REGISTRAR_CONTROLLER_CONTRACT =
  buildContractRef(
    MAINNET,
    buildAddress("0x253553366Da8546fC250F225fe3d25d0C782303b"),
  );

export const MAINNET_CLASSIC_ETH_REGISTRAR_CONTROLLER_CONTRACT =
  buildContractRef(
    MAINNET,
    buildAddress("0x283af0b28c62c092c9727f1ee09c02ca627eb7f5"),
  );

export const MAINNET_WRAPPING_ETH_REGISTRAR_CONTROLLER = new EthRegistrar(
  MAINNET_WRAPPING_ETH_REGISTRAR_CONTROLLER_CONTRACT,
);

export const MAINNET_CLASSIC_ETH_REGISTRAR_CONTROLLER = new EthRegistrar(
  MAINNET_CLASSIC_ETH_REGISTRAR_CONTROLLER_CONTRACT,
);
