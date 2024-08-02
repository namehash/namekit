import { ChainId } from "./chain";
import { ContractRef } from "./contract";
import { ENSName } from "./ensname";
import { buildNFTRef, NFTRef, TokenId } from "./nft";


export interface Registrar {
  contract: ContractRef;

  getTokenId(name: ENSName, isWrapped: boolean): TokenId;
  isClaimable(name: ENSName, isWrapped: boolean): boolean;
}

// NOTE: Need to add `Registrar` objects to `KNOWN_REGISTRARS` as they are
// defined in order to use
export const KNOWN_REGISTRARS: Registrar[] = [];

export function buildNFTRefFromENSName(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean
): NFTRef {
  const registrar = getKnownRegistrar(name, chain, isWrapped);
  const token = registrar.getTokenId(name, isWrapped);

  return buildNFTRef(registrar.contract, token);
}

export function getKnownPotentialNFTRefs(
  name: ENSName,
  chain: ChainId
): NFTRef[] {
  const wrappedNFT = buildNFTRefFromENSName(name, chain, true);
  const unwrappedNFT = buildNFTRefFromENSName(name, chain, false);
  return [wrappedNFT, unwrappedNFT].filter((nft) => nft !== null);
}

export function getPotentialKnownRegistrars(
  name: ENSName,
  chain: ChainId,
  isWrapped: boolean
): Registrar[] {
  return KNOWN_REGISTRARS.filter(
    (registrar) => registrar.contract.chain.chainId === chain.chainId &&
      registrar.isClaimable(name, isWrapped)
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
  isWrapped: boolean
): Registrar {
  const registrars = getPotentialKnownRegistrars(name, chain, isWrapped);
  if (registrars.length > 1) {
    throw new Error(
      `Multiple potential registrars found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`
    );
  } else if (registrars.length === 0) {
    throw new Error(
      `No known registrars found for name: "${name.name}" on chainId: ${chain.chainId} when isWrapped: ${isWrapped}`
    );
  } else {
    return registrars[0];
  }
}