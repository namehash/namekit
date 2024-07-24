import {
  ENSName,
  ETH_TLD,
  charCount,
  MIN_ETH_REGISTRABLE_LABEL_LENGTH,
  getNormalizationStatus,
} from "./ensname";
import { NFTRef, TokenId, buildNFTRef, buildTokenId } from "./nft";
import { namehash, labelhash } from "viem/ens";
import { buildAddress } from "./address";
import { ChainId, MAINNET } from "./chain";
import { ContractRef, buildContractRef } from "./contract";
import {
  Registration,
  PrimaryRegistrationStatus,
  SecondaryRegistrationStatus,
} from "./registration";
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
  formattedPrice,
  multiplyPriceByNumber,
  subtractPrices,
} from "./price";
import { Currency } from "./currency";

export interface Registrar {
  contract: ContractRef;

  getTokenId(name: ENSName, isWrapped: boolean): TokenId;
  isClaimable(name: ENSName, isWrapped: boolean): boolean;
}

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

export const KNOWN_REGISTRARS = [
  WRAPPED_MAINNET_ETH_REGISTRAR,
  UNWRAPPED_MAINNET_ETH_REGISTRAR,
];

export function getPotentialKnownRegistrars(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean,
): Registrar[] {
  return KNOWN_REGISTRARS.filter(
    (registrar) =>
      registrar.contract.chain.chainId === chain.chainId &&
      registrar.isClaimable(name, isWrapped),
  );
}

/**
 * Identifies the registrar for the provided name, if known.
 *
 * @param name the name to evaluate.
 * @param chainId the id of the chain the name is managed on.
 * @param isWrapped if the name is wrapped or not.
 * @returns the requested registrar
 */
export function getKnownRegistrar(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean,
): Registrar {
  const registrars = getPotentialKnownRegistrars(name, chain, isWrapped);
  if (registrars.length > 1) {
    throw new Error(
      `Multiple potential registrars found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`,
    );
  } else if (registrars.length === 0) {
    throw new Error(
      `No known registrars found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`,
    );
  } else {
    return registrars[0];
  }
}

export function getKnownPotentialNFTRefs(
  name: ENSName,
  chain: ChainId,
): NFTRef[] {
  const wrappedNFT = buildNFTRefFromENSName(name, chain, true);
  const unwrappedNFT = buildNFTRefFromENSName(name, chain, false);
  return [wrappedNFT, unwrappedNFT].filter((nft) => nft !== null);
}

export function buildNFTRefFromENSName(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean,
): NFTRef {
  const registrar = getKnownRegistrar(name, chain, isWrapped);
  const token = registrar.getTokenId(name, isWrapped);

  return buildNFTRef(registrar.contract, token);
}

export const GRACE_PERIOD: Readonly<Duration> = buildDuration(
  90n * SECONDS_PER_DAY.seconds,
);
export const TEMPORARY_PREMIUM_DAYS = 21n;

export const TEMPORARY_PREMIUM_PERIOD: Readonly<Duration> = buildDuration(
  TEMPORARY_PREMIUM_DAYS * SECONDS_PER_DAY.seconds,
);

export const DOMAIN_HAS_SPECIAL_PRICE_IF_LENGTH_EQUAL_OR_LESS_THAN = 5;

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

export const getPriceDescription = (
  domainRegistration: Registration,
  domainName: ENSName,
): PriceDescription | null => {
  const isExpired =
    domainRegistration.primaryStatus === PrimaryRegistrationStatus.Expired;
  const wasRecentlyReleased =
    domainRegistration.secondaryStatus ===
    SecondaryRegistrationStatus.RecentlyReleased;
  const isRegistered =
    domainRegistration.primaryStatus === PrimaryRegistrationStatus.Active;

  if (!(isExpired && wasRecentlyReleased) && isRegistered) return null;
  const domainBasePrice = AvailableNameTimelessPriceUSD(domainName);

  if (!domainBasePrice) return null;
  else {
    const domainPrice = formattedPrice({
      price: domainBasePrice,
      withPrefix: true,
    });
    const pricePerYearDescription = `${domainPrice} / year`;

    const premiumEndsIn =
      premiumPeriodEndsIn(domainRegistration)?.relativeTimestamp;

    if (premiumEndsIn) {
      const premiumEndMessage = premiumEndsIn
        ? ` Temporary premium ends ${premiumEndsIn}.`
        : null;
      const basePriceMessage = domainBasePrice
        ? " Discounts continuously until dropping to "
        : null;

      return {
        pricePerYearDescription,
        descriptiveTextBeginning:
          "Recently released." + premiumEndMessage + basePriceMessage,
        descriptiveTextEnd: ".",
      };
    } else {
      const domainLabelLength = domainName.name.length;

      return domainLabelLength <
        DOMAIN_HAS_SPECIAL_PRICE_IF_LENGTH_EQUAL_OR_LESS_THAN
        ? {
            pricePerYearDescription,
            descriptiveTextBeginning: `${domainLabelLength}-character names are `,
            descriptiveTextEnd: " to register.",
          }
        : null;
    }
  }
};

export const nameCurrentTemporaryPremium = (
  domainRegistration: Registration,
): Price | null => {
  if (domainRegistration.expirationTimestamp) {
    return temporaryPremiumPriceAtTimestamp(
      now(),
      domainRegistration.expirationTimestamp,
    );
  } else {
    return null;
  }
};

/* Interface for premium period end details */
export interface PremiumPeriodEndsIn {
  relativeTimestamp: string;
  timestamp: Timestamp;
}

/**
 * Determines if a domain is in its premium period and returns the end timestamp and a human-readable distance to it.
 * @param domainRegistration: the domain registration object
 * @returns PremiumPeriodEndsIn | null
 */
export const premiumPeriodEndsIn = (
  domainRegistration: Registration,
): PremiumPeriodEndsIn | null => {
  const isExpired =
    domainRegistration.primaryStatus === PrimaryRegistrationStatus.Expired;
  const wasRecentlyReleased =
    domainRegistration.secondaryStatus ===
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
  if (!domainRegistration.expiryTimestamp) return null;

  const releasedEpoch = addSeconds(
    domainRegistration.expiryTimestamp,
    GRACE_PERIOD,
  );
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

/*
  This is an "internal" helper function only. It can't be directly used anywhere else because
  it is too easy to accidently not include the registration object when it should be passed.
  Three different functions are created right below this one, which are the ones that are
  safe to be used across the platform, and are then, the ones being exported.
*/
const AvailableNamePriceUSD = (
  domainName: ENSName,
  registerForYears = DEFAULT_REGISTRATION_YEARS,
  domainRegistration: Registration | null = null,
  additionalFee: Price | null = null,
): Price | null => {
  console.log(domainName.normalization, domainName.labels);
  if (domainName.normalization !== getNormalizationStatus(domainName.labels)) {
    return null;
  }

  const defaultPrice: Readonly<Price> = {
    value: 500n,
    currency: Currency.Usd,
  };
  const shortNamePremium: Record<number, Readonly<Price>> = {
    [MIN_ETH_REGISTRABLE_LABEL_LENGTH]: {
      value: 64000n,
      currency: Currency.Usd,
    },
    4: {
      value: 16000n,
      currency: Currency.Usd,
    },
  };
  const basePrice = shortNamePremium[domainName.name.length]
    ? shortNamePremium[domainName.name.length]
    : defaultPrice;

  const namePriceForYears = multiplyPriceByNumber(
    basePrice,
    Number(registerForYears),
  );

  const namehashPrice = additionalFee
    ? addPrices([additionalFee, namePriceForYears])
    : namePriceForYears;

  if (domainRegistration) {
    const premiumPrice = nameCurrentTemporaryPremium(domainRegistration);

    return premiumPrice
      ? addPrices([premiumPrice, namehashPrice])
      : namehashPrice;
  }

  return namehashPrice;
};

const DEFAULT_REGISTRATION_YEARS = 1;

/*
  Below function returns the "timeless" price for a name, that takes no consideration
  of the current status of the name. This is useful for various cases, including in
  generating messages that communicate how much a name costs to renew, how much
  a name will cost at the end of a premium period, etc..
*/
export const AvailableNameTimelessPriceUSD = (
  domainName: ENSName,
  registerForYears = DEFAULT_REGISTRATION_YEARS,
) => {
  return AvailableNamePriceUSD(domainName, registerForYears);
};
