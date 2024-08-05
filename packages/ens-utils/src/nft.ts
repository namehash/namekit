import { labelhash, namehash } from "viem";
import { buildAddress } from "./address";
import { buildChainId, ChainId, MAINNET } from "./chain";
import { ContractRef, buildContractRef } from "./contract";
import { charCount, ENSName, ETH_TLD, MIN_ETH_REGISTRABLE_LABEL_LENGTH } from "./ensname";

export interface TokenId {
    /**
     * Token ID of an NFT.
     * Always a non-negative integer.
     */
    tokenId: bigint;
};

const MAX_UINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

/**
 * Builds a TokenId object.
 * @param maybeTokenId the token ID of an NFT.
 * @returns a TokenId object.
 */
export const buildTokenId = (
    maybeTokenId: bigint | string
): TokenId => {

    let tokenId: bigint;

    if (typeof maybeTokenId === "string") {
        try {
            tokenId = BigInt(maybeTokenId);
        } catch (e) {
            throw new Error(`Invalid token ID: ${maybeTokenId}. All token ID values must be integers.`);
        }
    } else {
        tokenId = maybeTokenId;
    }

    if (tokenId < 0) {
        throw new Error(`Invalid token ID: ${maybeTokenId}. All token ID values must be non-negative.`);
    }

    if (tokenId > MAX_UINT256) {
        throw new Error(`Invalid token ID: ${maybeTokenId}. All token ID values must be representable as a uint256 value.`);
    }

    return {
        tokenId
    };
}

export interface NFTRef {
    /**
     * Contract of the NFT.
     */
    contract: ContractRef;

    /**
     * Reference to the token of the NFT within the related contract.
     */
    token: TokenId;
};

/**
 * Builds a NFTRef object.
 * @param contract the contract of the NFT.
 * @param token the token ID of the NFT within the specified contract.
 * @returns a NFTRef object.
 */
export const buildNFTRef = (
    contract: ContractRef,
    token: TokenId
): NFTRef => {

    return {
        contract,
        token
    };
}

/**
 * Convert a NFTRef to a string.
 * @param nft: NFTRef - The NFTRef to convert.
 * @returns string - The converted string.
 */
export const convertNFTRefToString = (
    nft: NFTRef
  ): string => {
    return `${nft.contract.chain.chainId}:${nft.contract.address.address}:${nft.token.tokenId}`;
};

/**
 * Parses a string formatted as "chainId:contractAddress:tokenId" to a NFTRef.
 * @param maybeNFT: string - The string to parse.
 * @returns NFTRef - The NFTRef object for the parsed string.
 */
export const buildNFTReferenceFromString = (
    maybeNFT: string
  ): NFTRef => {
    const parts = maybeNFT.split(":");

    if (parts.length !== 3) {
        throw new Error(`Cannot convert: "${maybeNFT}" to NFTRef`);
    }

    const chainId = buildChainId(parts[0]);
    const contractAddress = buildAddress(parts[1]);
    const contract = buildContractRef(chainId, contractAddress);
    const tokenId = buildTokenId(parts[2]);

    return buildNFTRef(contract, tokenId);
}

export interface NFTIssuer {
    getNftContract(): ContractRef;
    getTokenId(name: ENSName, isWrapped: boolean): TokenId;
    isClaimable(name: ENSName, isWrapped: boolean): boolean;
}

export class NameWrapper implements NFTIssuer {

    private readonly contract: ContractRef;

    public constructor(contract: ContractRef) {
        this.contract = contract;
    }

    public getNftContract(): ContractRef {
        return this.contract;
    }
  
    public getTokenId(name: ENSName, isWrapped: boolean): TokenId {
      if (!this.isClaimable(name, isWrapped)) {
        throw new Error(
          `Wrapped tokenId for name: "${name.name}" is not claimable by registrar: ${this.contract.address.address} on chainId: ${this.contract.chain.chainId}`
        );
      }
      return buildTokenId(BigInt(namehash(name.name)));
    }
  
    public isClaimable(name: ENSName, isWrapped: boolean): boolean {
  
      // TODO: build a more sophisticated implementation of this function
      // for now, we just assume that all wrapped names are claimable by the NameWrapper
      return isWrapped;
    }
  }

  export class ETHBaseRegistrarImplementation implements NFTIssuer {
  
    private readonly contract: ContractRef;

    public constructor(contract: ContractRef) {
        this.contract = contract;
    }

    public getNftContract(): ContractRef {
        return this.contract;
    }
  
    public getTokenId(name: ENSName, isWrapped: boolean): TokenId {
      if (!this.isClaimable(name, isWrapped)) {
        throw new Error(
          `Unwrapped tokenId for name: "${name.name}" is not claimable by registrar: ${this.contract.address.address} on chainId: ${this.contract.chain.chainId}`
        );
      }
      return buildTokenId(BigInt(labelhash(name.labels[0])));
    }
  
    public isClaimable(name: ENSName, isWrapped: boolean): boolean {
      // name must be unwrapped
      if (isWrapped) return false;

      // must have exactly 2 labels to be a direct subname of ".eth"
      if (name.labels.length !== 2) return false;

      // last label must be "eth"
      if (name.labels[1] !== ETH_TLD) return false;

      // NOTE: now we know we have a direct subname of ".eth"

      // first label must be of sufficient length
      const subnameLength = charCount(name.labels[0]);
      if (subnameLength < MIN_ETH_REGISTRABLE_LABEL_LENGTH) return false;

      // TODO: also add a check for a maximum length limit as enforced by max block size, etc?

      return true;
    }
  }

// known `NFTIssuer` contracts

export const MAINNET_NAMEWRAPPER_CONTRACT = buildContractRef(
  MAINNET,
  buildAddress("0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401")
);

export const MAINNET_ETH_BASE_REGISTRAR_IMPLEMENTATION_CONTRACT = buildContractRef(
  MAINNET,
  buildAddress("0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85")
);

export const MAINNET_NAMEWRAPPER = new NameWrapper(
    MAINNET_NAMEWRAPPER_CONTRACT
);

export const MAINNET_ETH_BASE_REGISTRAR_IMPLEMENTATION = new ETHBaseRegistrarImplementation(MAINNET_ETH_BASE_REGISTRAR_IMPLEMENTATION_CONTRACT);

// NOTE: Need to add `NFTIssuer` objects to `KNOWN_NFT_ISSUERS` as they are
// defined in order to use
export const KNOWN_NFT_ISSUERS: NFTIssuer[] = [];

KNOWN_NFT_ISSUERS.push(MAINNET_NAMEWRAPPER);
KNOWN_NFT_ISSUERS.push(MAINNET_ETH_BASE_REGISTRAR_IMPLEMENTATION);

export function buildNFTRefFromENSName(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean
): NFTRef {
  const issuer = getKnownNFTIssuer(name, chain, isWrapped);
  const token = issuer.getTokenId(name, isWrapped);

  return buildNFTRef(issuer.getNftContract(), token);
}

export function getKnownPotentialNFTRefs(
  name: ENSName,
  chain: ChainId
): NFTRef[] {
  const wrappedNFT = buildNFTRefFromENSName(name, chain, true);
  const unwrappedNFT = buildNFTRefFromENSName(name, chain, false);
  return [wrappedNFT, unwrappedNFT].filter((nft) => nft !== null);
}

export function getPotentialKnownIssuers(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean
): NFTIssuer[] {
  return KNOWN_NFT_ISSUERS.filter(
    (issuer) => issuer.getNftContract().chain.chainId === chain.chainId &&
      issuer.isClaimable(name, isWrapped)
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
  isWrapped: boolean
): NFTIssuer {
  const issuers = getPotentialKnownIssuers(name, chain, isWrapped);
  if (issuers.length > 1) {
    throw new Error(
      `Multiple potential NFT issuers found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`
    );
  } else if (issuers.length === 0) {
    throw new Error(
      `No known NFT issuers found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`
    );
  } else {
    return issuers[0];
  }
}