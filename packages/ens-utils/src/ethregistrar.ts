import { ENSName, MIN_ETH_REGISTRABLE_LABEL_LENGTH, ETH_TLD, charCount } from "./ensname";
import { NFTRef, TokenId, buildNFTRef, buildTokenId } from "./nft";
import { namehash, labelhash } from 'viem/ens'
import { buildAddress } from "./address";
import { ChainId, MAINNET } from "./chain";
import { ContractRef, buildContractRef } from "./contract";

export interface Registrar {
  contract: ContractRef;

  getTokenId(name: ENSName, isWrapped: boolean): TokenId;
  isClaimable(name: ENSName, isWrapped: boolean): boolean;
}

// known registrars
export const WRAPPED_MAINNET_ETH_REGISTRAR_CONTRACT =
  buildContractRef(MAINNET, buildAddress("0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401"));
export const UNWRAPPED_MAINNET_ETH_REGISTRAR_CONTRACT =
  buildContractRef(MAINNET, buildAddress("0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"));


export class NameWrapper implements Registrar {

  constructor(public contract: ContractRef) {
    this.contract = contract;
  }

  getTokenId(name: ENSName, isWrapped: boolean): TokenId {
    if (!this.isClaimable(name, isWrapped)) {
      throw new Error(`Wrapped tokenId for name: "${name.name}" is not claimable by registrar: ${this.contract.address} on chainId: ${this.contract.chain.chainId}`);
    }
    return buildTokenId(BigInt(namehash(name.name)));
  }

  isClaimable(name: ENSName, isWrapped: boolean): boolean {
    if (!isWrapped) return false;

    if (name.labels.length >= 2) {
      if (name.labels[1] === ETH_TLD) {
        // first label must be of sufficient length
        if (charCount(name.labels[0]) < MIN_ETH_REGISTRABLE_LABEL_LENGTH) return false;
      }
    }

    // TODO: refine this. For example, there's a maximum length limit, etc.
    return true;
  }
};

export class ClassicETHRegistrarController implements Registrar {

  constructor(public contract: ContractRef) {
    this.contract = contract;
  }

  getTokenId(name: ENSName, isWrapped: boolean): TokenId {
    if (!this.isClaimable(name, isWrapped)) {
      throw new Error(`Unwrapped tokenId for name: "${name.name}" is not claimable by registrar: ${this.contract.address} on chainId: ${this.contract.chain.chainId}`);
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
};

export const WRAPPED_MAINNET_ETH_REGISTRAR = new NameWrapper(WRAPPED_MAINNET_ETH_REGISTRAR_CONTRACT);
export const UNWRAPPED_MAINNET_ETH_REGISTRAR = new ClassicETHRegistrarController(UNWRAPPED_MAINNET_ETH_REGISTRAR_CONTRACT);

export const KNOWN_REGISTRARS = [WRAPPED_MAINNET_ETH_REGISTRAR, UNWRAPPED_MAINNET_ETH_REGISTRAR];

export function getPotentialKnownRegistrars(name: ENSName, chain: ChainId, isWrapped: boolean): Registrar[] {
    return KNOWN_REGISTRARS.filter(registrar => registrar.contract.chain.chainId === chain.chainId &&
                                                registrar.isClaimable(name, isWrapped));
}

/**
 * Identifies the registrar for the provided name, if known.
 * 
 * @param name the name to evaluate.
 * @param chainId the id of the chain the name is managed on.
 * @param isWrapped if the name is wrapped or not.
 * @returns the requested registrar
 */
export function getKnownRegistrar(name: ENSName, chain: ChainId, isWrapped: boolean): Registrar {
    const registrars = getPotentialKnownRegistrars(name, chain, isWrapped);
    if (registrars.length > 1) {
        throw new Error(`Multiple potential registrars found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`);
    } else if (registrars.length === 0) {
        throw new Error(`No known registrars found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`);
    } else {
        return registrars[0];
    }
}

export function getKnownPotentialNFTRefs (name: ENSName, chain: ChainId): NFTRef[] {
  const wrappedNFT = buildNFTRefFromENSName(name, chain, true);
  const unwrappedNFT = buildNFTRefFromENSName(name, chain, false);
  return [wrappedNFT, unwrappedNFT].filter(nft => nft !== null);
};

export function buildNFTRefFromENSName(name: ENSName, chain: ChainId, isWrapped: boolean): NFTRef {
    const registrar = getKnownRegistrar(name, chain, isWrapped);
    const token = registrar.getTokenId(name, isWrapped);

    return buildNFTRef(registrar.contract, token);
}