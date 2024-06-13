import { ENSName } from "./ensname";
import { NFTRef } from "./nft";
import { Registration } from "./registration";

/**
 * Object containing properties necessary for domain name processing.
 * It is computed out of the user input, URL query parameter or database row data.
 */
export type DomainName = {
  /** Unique identifier of a domain */
  namehash: string;
  /** Domain slug to be used for URLs. It has a format of [labelhash].eth when the domain name is unknown or unnormalized */
  slug: string;
  /** Beautified domain name string, to be rendered in user interface */
  displayName: string;
  /** Normalized version of the name. Similar to `slug`, but it is null when the domain name is unknown or unnormalized */
  normalizedName: string | null;
  /** The label of the name. It can either be string like `vitalik` or `[0x123]` */
  labelName: string;
  /** keccak256 hash of the label */
  labelHash: string;
  unwrappedTokenId: bigint;
  wrappedTokenId: bigint;
};

export type DomainCard = {
  name: ENSName;

  /**
   * A reference to the NFT associated with `name`.
   *
   * null if and only if one or more of the following are true:
   * 1. name is not normalized
   * 2. name is not currently minted (name is on primary market, not secondary market) and the name is not currently expired in grace period
   * 3. we don't know a strategy to generate a NFTRef for the name on the specified chain (ex: name is associated with an unknown registrar)
   */
  nft: NFTRef | null;

  parsedName: DomainName;
  registration: Registration;
  /** Stringified JSON object with debug information about the name generator */
  nameGeneratorMetadata: string | null;
  /** Whether the domain is on watchlist */
  onWatchlist: boolean;
  ownerAddress: `0x${string}` | null;
  managerAddress: `0x${string}` | null;
  /** Former owner address is only set when the domain is in Grace Period */
  formerOwnerAddress: `0x${string}` | null;
  /** Former manager address is only set when the domain is in Grace Period */
  formerManagerAddress: `0x${string}` | null;
};
