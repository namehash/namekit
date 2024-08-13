import { buildAddress } from "./address";
import { buildChainId, ChainId } from "./chain";
import { ContractRef, buildContractRef } from "./contract";
import { ENSName } from "./ensname";

export interface TokenId {
  /**
   * Token ID of an NFT.
   * Always a non-negative integer.
   */
  tokenId: bigint;
}

const MAX_UINT256 =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;

/**
 * Builds a TokenId object.
 * @param maybeTokenId the token ID of an NFT.
 * @returns a TokenId object.
 */
export const buildTokenId = (maybeTokenId: bigint | string): TokenId => {
  let tokenId: bigint;

  if (typeof maybeTokenId === "string") {
    try {
      tokenId = BigInt(maybeTokenId);
    } catch (e) {
      throw new Error(
        `Invalid token ID: ${maybeTokenId}. All token ID values must be integers.`,
      );
    }
  } else {
    tokenId = maybeTokenId;
  }

  if (tokenId < 0) {
    throw new Error(
      `Invalid token ID: ${maybeTokenId}. All token ID values must be non-negative.`,
    );
  }

  if (tokenId > MAX_UINT256) {
    throw new Error(
      `Invalid token ID: ${maybeTokenId}. All token ID values must be representable as a uint256 value.`,
    );
  }

  return {
    tokenId,
  };
};

export interface NFTRef {
  /**
   * Contract of the NFT.
   */
  contract: ContractRef;

  /**
   * Reference to the token of the NFT within the related contract.
   */
  token: TokenId;
}

/**
 * Builds a NFTRef object.
 * @param contract the contract of the NFT.
 * @param token the token ID of the NFT within the specified contract.
 * @returns a NFTRef object.
 */
export const buildNFTRef = (contract: ContractRef, token: TokenId): NFTRef => {
  return {
    contract,
    token,
  };
};

/**
 * Convert a NFTRef to a string.
 * @param nft: NFTRef - The NFTRef to convert.
 * @returns string - The converted string.
 */
export const convertNFTRefToString = (nft: NFTRef): string => {
  return `${nft.contract.chain.chainId}:${nft.contract.address.address}:${nft.token.tokenId}`;
};

/**
 * Parses a string formatted as "chainId:contractAddress:tokenId" to a NFTRef.
 * @param maybeNFT: string - The string to parse.
 * @returns NFTRef - The NFTRef object for the parsed string.
 */
export const buildNFTReferenceFromString = (maybeNFT: string): NFTRef => {
  const parts = maybeNFT.split(":");

  if (parts.length !== 3) {
    throw new Error(`Cannot convert: "${maybeNFT}" to NFTRef`);
  }

  const chainId = buildChainId(parts[0]);
  const contractAddress = buildAddress(parts[1]);
  const contract = buildContractRef(chainId, contractAddress);
  const tokenId = buildTokenId(parts[2]);

  return buildNFTRef(contract, tokenId);
};

export interface NFTIssuer {
  getContractRef(): ContractRef;
  getTokenId(name: ENSName, isWrapped: boolean): TokenId;
  isClaimable(name: ENSName, isWrapped: boolean): boolean;
}

/**
 * NOTE: Need to add `NFTIssuer` objects to `KNOWN_NFT_ISSUERS` as they are
 * defined in order to use
 */
export const KNOWN_NFT_ISSUERS: NFTIssuer[] = [];

export function buildNFTRefFromENSName(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean,
): NFTRef {
  const issuer = getKnownNFTIssuer(name, chain, isWrapped);
  const token = issuer.getTokenId(name, isWrapped);

  return buildNFTRef(issuer.getContractRef(), token);
}

export function getKnownPotentialNFTRefs(
  name: ENSName,
  chain: ChainId,
): NFTRef[] {
  const wrappedNFT = buildNFTRefFromENSName(name, chain, true);
  const unwrappedNFT = buildNFTRefFromENSName(name, chain, false);
  return [wrappedNFT, unwrappedNFT].filter((nft) => nft !== null);
}

export function getPotentialKnownIssuers(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean,
): NFTIssuer[] {
  return KNOWN_NFT_ISSUERS.filter(
    (issuer) =>
      issuer.getContractRef().chain.chainId === chain.chainId &&
      issuer.isClaimable(name, isWrapped),
  );
}

/**
 * Identifies the `NFTIssuer` for the provided name, if known.
 *
 * @param name the name to evaluate.
 * @param chainId the id of the chain the name is managed on.
 * @param isWrapped if the name is wrapped or not.
 * @returns the requested `NFTIssuer`
 */
export function getKnownNFTIssuer(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean,
): NFTIssuer {
  const issuers = getPotentialKnownIssuers(name, chain, isWrapped);
  if (issuers.length > 1) {
    throw new Error(
      `Multiple potential NFT issuers found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`,
    );
  } else if (issuers.length === 0) {
    throw new Error(
      `No known NFT issuers found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`,
    );
  } else {
    return issuers[0];
  }
}
