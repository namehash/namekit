import {
  ENSName,
  MIN_ETH_REGISTRABLE_LABEL_LENGTH,
  ETH_TLD,
  charCount,
} from "./ensname";
import { TokenId, buildTokenId } from "./nft";
import { namehash, labelhash } from "viem/ens";
import { buildAddress } from "./address";
import { MAINNET } from "./chain";
import { ContractRef, buildContractRef } from "./contract";
import {
  Duration,
  SECONDS_PER_DAY,
  Timestamp,
  addSeconds,
  buildDuration,
  formatTimestampAsDistanceToNow,
  now,
} from "./time";
import {
  Price,
  addPrices,
  approxScalePrice,
  buildPrice,
  formattedPrice,
  isEqualPrice,
  multiplyPriceByNumber,
  subtractPrices,
} from "./price";
import { Currency } from "./currency";
import { KNOWN_REGISTRARS, Registrar } from "./registrar";

// known registrars
export const WRAPPED_MAINNET_ETH_REGISTRAR_CONTRACT = buildContractRef(
  MAINNET,
  buildAddress("0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401"),
);
export const UNWRAPPED_MAINNET_ETH_REGISTRAR_CONTRACT = buildContractRef(
  MAINNET,
  buildAddress("0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"),
);

export class NameWrapper implements Registrar {
  constructor(public contract: ContractRef) {
    this.contract = contract;
  }

  getTokenId(name: ENSName, isWrapped: boolean): TokenId {
    if (!this.isClaimable(name, isWrapped)) {
      throw new Error(
        `Wrapped tokenId for name: "${name.name}" is not claimable by registrar: ${this.contract.address} on chainId: ${this.contract.chain.chainId}`,
      );
    }
    return buildTokenId(BigInt(namehash(name.name)));
  }

  isClaimable(name: ENSName, isWrapped: boolean): boolean {
    if (!isWrapped) return false;

    if (name.labels.length >= 2) {
      if (name.labels[1] === ETH_TLD) {
        // first label must be of sufficient length
        if (charCount(name.labels[0]) < MIN_ETH_REGISTRABLE_LABEL_LENGTH)
          return false;
      }
    }

    // TODO: refine this. For example, there's a maximum length limit, etc.
    return true;
  }
}

export class ClassicETHRegistrarController implements Registrar {
  constructor(public contract: ContractRef) {
    this.contract = contract;
  }

  getTokenId(name: ENSName, isWrapped: boolean): TokenId {
    if (!this.isClaimable(name, isWrapped)) {
      throw new Error(
        `Unwrapped tokenId for name: "${name.name}" is not claimable by registrar: ${this.contract.address} on chainId: ${this.contract.chain.chainId}`,
      );
    }
    return buildTokenId(BigInt(labelhash(name.labels[0])));
  }

  isClaimable(name: ENSName, isWrapped: boolean): boolean {
    // name must be unwrapped
    if (isWrapped) return false;

    // must have exactly 2 labels to be a direct subname of ".eth"
    if (name.labels.length !== 2) return false;

    // last label must be "eth"
    if (name.labels[1] !== ETH_TLD) return false;

    // first label must be of sufficient length
    return charCount(name.labels[0]) >= MIN_ETH_REGISTRABLE_LABEL_LENGTH;
  }
}

export const WRAPPED_MAINNET_ETH_REGISTRAR = new NameWrapper(
  WRAPPED_MAINNET_ETH_REGISTRAR_CONTRACT,
);
export const UNWRAPPED_MAINNET_ETH_REGISTRAR =
  new ClassicETHRegistrarController(UNWRAPPED_MAINNET_ETH_REGISTRAR_CONTRACT);

KNOWN_REGISTRARS.push(WRAPPED_MAINNET_ETH_REGISTRAR);
KNOWN_REGISTRARS.push(UNWRAPPED_MAINNET_ETH_REGISTRAR);

export const GRACE_PERIOD: Readonly<Duration> = buildDuration(
  90n * SECONDS_PER_DAY.seconds,
);
export const TEMPORARY_PREMIUM_DAYS = 21n;

export const TEMPORARY_PREMIUM_PERIOD: Readonly<Duration> = buildDuration(
  TEMPORARY_PREMIUM_DAYS * SECONDS_PER_DAY.seconds,
);

// PRICE TEXT DESCRIPTION ⬇️

/*
  This interface defines data that is used to display the price of a domain
  in the Ui. The reason we are separating this text in different fields is because:

  1. We want to be able to display different texts depending on wether the price of
  the domain is a premium price or not. In each one of these cases, the text displayed
  is different.
  2. Since the design for this data displaying is differently defined for the price field
  and the descriptive text, we separate it so we can render these two fields separately in the
  HTML that will be created inside the component. e.g. the price field is bold and the descriptive
  text is not. Please refer to this Figma artboard for more details: https:/*www.figma.com/file/lZ8HZaBcfx1xfrgx7WOsB0/Namehash?type=design&node-id=12959-119258&mode=design&t=laEDaXW0rg9nIVn7-0
*/
export interface PriceDescription {
  /* descriptiveTextBeginning references the text that is displayed before the price */
  descriptiveTextBeginning: string;
  /* pricePerYear is a string that represents: Price + "/ year" (e.g. "$5.99 / year") */
  pricePerYearDescription: string;
  /* descriptiveTextBeginning references the text that is displayed after the price */
  descriptiveTextEnd: string;
}

/**
 * Returns a PriceDescription object that contains the price of a domain and a descriptive text.
 * @param registration Domain registration data
 * @param ensName Domain name, labelhash, namehash, normalization, etc. data
 * @returns PriceDescription | null
 */
export const getPriceDescription = (
  registration: Registration,
  ensName: ENSName,
): PriceDescription | null => {
  const isExpired =
    registration.primaryStatus === PrimaryRegistrationStatus.Expired;
  const wasRecentlyReleased =
    registration.secondaryStatus ===
    SecondaryRegistrationStatus.RecentlyReleased;
  const isRegistered =
    registration.primaryStatus === PrimaryRegistrationStatus.Active;

  if (!(isExpired && wasRecentlyReleased) && isRegistered) return null;
  const domainBasePrice = AvailableNameTimelessPriceUSD(ensName);

  if (!domainBasePrice) return null;
  else {
    const domainPrice = formattedPrice({
      price: domainBasePrice,
      withPrefix: true,
    });
    const pricePerYearDescription = `${domainPrice} / year`;

    const premiumEndsIn = premiumPeriodEndsIn(registration)?.relativeTimestamp;

    if (premiumEndsIn) {
      const premiumEndMessage = premiumEndsIn
        ? ` Temporary premium ends ${premiumEndsIn}.`
        : null;

      return {
        pricePerYearDescription,
        descriptiveTextBeginning:
          "Recently released." +
          premiumEndMessage +
          " Discounts continuously until dropping to ",
        descriptiveTextEnd: ".",
      };
    } else {
      const basePrice = getEth2LDBasePrice(ensName);
      if (basePrice === null)
        return null;

      if (isEqualPrice(basePrice, DEFAULT_BASE_PRICE)) {
        // domain has standard pricing so no need to provide a special price description
        return null;
      }

      const labelLength = charCount(ensName.labels[0]);

      return {
        pricePerYearDescription,
        descriptiveTextBeginning: `${labelLength}-character names are `,
        descriptiveTextEnd: " to register.",
      };
    }
  }
};

// PREMIUM PERIOD TEXT REPORT ⬇️

/* Interface for premium period end details */
export interface PremiumPeriodEndsIn {
  relativeTimestamp: string;
  timestamp: Timestamp;
}

/**
 * Determines if a domain is in its premium period and returns the end timestamp and a human-readable distance to it.
 * @param domainCard: DomainCard
 * @returns PremiumPeriodEndsIn | null. Null if the domain is not in its premium period
 *                                      (to be, it should be expired and recently released).
 */
export const premiumPeriodEndsIn = (
  registration: Registration,
): PremiumPeriodEndsIn | null => {
  const isExpired =
    registration.primaryStatus === PrimaryRegistrationStatus.Expired;
  const wasRecentlyReleased =
    registration.secondaryStatus ===
    SecondaryRegistrationStatus.RecentlyReleased;

  /*
    A domain will only have a premium price if it has Expired and it was Recently Released
  */
  if (!isExpired || !wasRecentlyReleased) return null;

  /*
    This conditional should always be true because expiryTimestamp will only be null when
    the domain was never registered before. Considering that the domain is Expired,
    it means that it was registered before. It is just a type safety check.
  */
  if (!registration.expiryTimestamp) return null;

  const releasedEpoch = addSeconds(registration.expiryTimestamp, GRACE_PERIOD);
  const temporaryPremiumEndTimestamp = addSeconds(
    releasedEpoch,
    TEMPORARY_PREMIUM_PERIOD,
  );

  return {
    relativeTimestamp: formatTimestampAsDistanceToNow(
      temporaryPremiumEndTimestamp,
    ),
    timestamp: temporaryPremiumEndTimestamp,
  };
};

// REGISTRATION PRICE ⬇️

/**
 * At the moment a .eth name expires, this recently released temporary premium is added to its price.
 * NOTE: The actual recently released temporary premium added subtracts `PREMIUM_OFFSET`.
 */
export const PREMIUM_START_PRICE: Price = {
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
export const PREMIUM_OFFSET = approxScalePrice(
  PREMIUM_START_PRICE,
  PREMIUM_DECAY ** Number(TEMPORARY_PREMIUM_DAYS),
);

/**
 * @param atTimestamp Timestamp. The moment to calculate the temporary premium price.
 * @param expirationTimestamp Timestamp. The moment a name expires.
 * @returns Price. The temporary premium price at the moment of `atTimestamp`.
 */
export function temporaryPremiumPriceAtTimestamp(
  atTimestamp: Timestamp,
  expirationTimestamp: Timestamp,
): Price {
  const releasedTimestamp = addSeconds(expirationTimestamp, GRACE_PERIOD);
  const secondsSinceRelease = atTimestamp.time - releasedTimestamp.time;
  if (secondsSinceRelease < 0) {
    /* if as of the moment of `atTimestamp` a name hasn't expired yet then there is no temporaryPremium */
    return {
      value: 0n,
      currency: Currency.Usd,
    };
  }

  const fractionalDaysSinceRelease =
    Number(secondsSinceRelease) / Number(SECONDS_PER_DAY.seconds);

  const decayFactor = PREMIUM_DECAY ** fractionalDaysSinceRelease;

  const decayedPrice = approxScalePrice(PREMIUM_START_PRICE, decayFactor);
  const offsetDecayedPrice = subtractPrices(decayedPrice, PREMIUM_OFFSET);

  /* the temporary premium can never be less than $0.00 */
  if (offsetDecayedPrice.value < 0n) {
    return {
      value: 0n,
      currency: Currency.Usd,
    };
  }

  return offsetDecayedPrice;
}

export const registrationCurrentTemporaryPremium = (
  registration: Registration,
): Price | null => {
  if (registration.expirationTimestamp) {
    return temporaryPremiumPriceAtTimestamp(
      now(),
      registration.expirationTimestamp,
    );
  } else {
    return null;
  }
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

const getEth2LDBasePrice = (ensName: ENSName): Price | null => {
  const label = getEth2LDSubname(ensName);

  if (label === null)
    return null;

  const labelLength = charCount(label);

  switch (labelLength) {
    case 3:
      return THREE_CHAR_BASE_PRICE;
    case 4:
      return FOUR_CHAR_BASE_PRICE;
    default:
      return DEFAULT_BASE_PRICE;
  }
}

/*
  This is an "internal" helper function only. It can't be directly used anywhere else because
  it is too easy to accidently not include the registration object when it should be passed.
  Three different functions are created right below this one, which are the ones that are
  safe to be used across the platform, and are then, the ones being exported.
*/
const AvailableNamePriceUSD = (
  ensName: ENSName,
  registerForYears = DEFAULT_REGISTRATION_YEARS,
  registration: Registration | null = null,
  additionalFee: Price | null = null,
): Price | null => {
  const basePrice = getEth2LDBasePrice(ensName);
  if (basePrice === null) return null;

  const namePriceForYears = multiplyPriceByNumber(
    basePrice,
    Number(registerForYears),
  );

  const resultPrice = additionalFee
    ? addPrices([additionalFee, namePriceForYears])
    : namePriceForYears;

  if (registration) {
    const premiumPrice = registrationCurrentTemporaryPremium(registration);

    return premiumPrice ? addPrices([premiumPrice, resultPrice]) : resultPrice;
  }

  return resultPrice;
};

const DEFAULT_REGISTRATION_YEARS = 1;

/*
  Below function returns the "timeless" price for a name, that takes no consideration
  of the current status of the name. This is useful for various cases, including in
  generating messages that communicate how much a name costs to renew, how much
  a name will cost at the end of a premium period, etc..
*/
export const AvailableNameTimelessPriceUSD = (
  ensName: ENSName,
  registerForYears = DEFAULT_REGISTRATION_YEARS,
) => {
  return AvailableNamePriceUSD(ensName, registerForYears);
};

// REGISTRATION STATUSES ⬇️

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

// EXPIRATION STATUS ⬇️

/**
 * Returns the expiration timestamp of a domain
 * @param domainRegistration Registration object from domain
 * @returns Timestamp | null
 */
export function domainExpirationTimestamp(
  domainRegistration: Registration,
): Timestamp | null {
  if (domainRegistration.expirationTimestamp) {
    return domainRegistration.expirationTimestamp;
  }
  return null;
}

// RELEASE STATUS ⬇️

/**
 * Returns the release timestamp of a domain, which is 90 days after expiration when the Grace Period ends
 * @param domainRegistration Registration object from domain
 * @returns Timestamp | null
 */
export function domainReleaseTimestamp(
  domainRegistration: Registration,
): Timestamp | null {
  const expirationTimestamp = domainExpirationTimestamp(domainRegistration);
  if (expirationTimestamp === null) return null;

  const releaseTimestamp = addSeconds(expirationTimestamp, GRACE_PERIOD);
  return releaseTimestamp;
}

const getEth2LDSubname = (ensName: ENSName): string | null => {
  if (ensName.labels.length !== 2) return null;

  if (ensName.labels[1] !== ETH_TLD) return null;

  // NOTE: now we know we have a direct subname of ".eth"
  const subnameLength = charCount(ensName.labels[0]);

  // ensure this subname is even possible to register
  if (subnameLength < MIN_ETH_REGISTRABLE_LABEL_LENGTH) return null;

  return ensName.labels[0];
};
