import { ENSName } from "@namehash/ens-utils";

// using our own regex for this instead of viem's implementation of `isAddress`
// as we want "0X..." in uppercase to also be considered an address
const ethereumAddressRegex = /^0x[0-9a-f]{40}$/i;
const tokenIdRegex = /^((?:\d+)|(?:0x[0-9a-f]+))$/i;

export function isEthereumAddress(address: string) {
  return ethereumAddressRegex.test(address);
}

// TODO: Write tests
export function isTokenId(token_id: string) {
  return tokenIdRegex.test(token_id);
}

const keccak256Regex = /^(?:0x)?[0-9a-f]{64}$/i;

/**
 * The Keccak-256 hash of a name/label.
 *
 * A labelhash is a Keccak-256 hash of a label.
 * An ENSIP-1 namehash is a recursive Keccak-256 hash of the labelhashes of all the labels in a name.
 *
 * A "normalized Keccak-256 hash" is a Keccak-256 hash that is always prefixed with "0x" and all in lowercase.
 * */
export function isKeccak256Hash(hash: string) {
  return keccak256Regex.test(hash);
}

export function getNameGuardURLForENSname(ensName: ENSName): string {
  return `https://nameguard.io/inspect/${encodeURIComponent(ensName.name)}`;
}
