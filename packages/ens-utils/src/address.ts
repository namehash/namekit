import { checksumAddress, isAddress } from "viem";
import { ChainId, MAINNET } from "./chain";

export interface Address {
  address: `0x${string}`;
}

export const buildAddress = (
  maybeAddress: string,
  strict: boolean = false,
  chain: ChainId = MAINNET,
): Address => {
  if (!isAddress(maybeAddress, { strict: false }))
    throw new Error(`Invalid address: ${maybeAddress}`);

  const address = checksumAddress(maybeAddress, chain.chainId);

  if (strict && address !== maybeAddress)
    throw new Error(
      `Invalid address checksum: ${maybeAddress} expected ${address} on chainId ${chain.chainId}`,
    );

  return {
    address: address,
  };
};

export const truncateAddress = (address: Address): string => {
  return address.address.slice(0, 6) + "..." + address.address.slice(-4);
};

export const isAddressEqual = (a: Address, b: Address): boolean => {
  return a.address.toLowerCase() === b.address.toLowerCase();
};
