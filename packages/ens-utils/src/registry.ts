import { buildAddress } from "./address";
import { MAINNET } from "./chain";
import { buildContractRef, ContractRef } from "./contract";

/**
 * A `Registry` in NameKit aims to provide a standardized "common denominator"
 * interface for interacting with an ENS name registry.
 *
 * A `Registry` may live on Ethereum L1, on an L2, or offchain.
 */
export interface Registry {
  /**
   * Gets the `ContractRef` for where the registry being modeled by this
   * `Registry` is recording subdomain registrations onchain.
   *
   * If a `Registry` records subdomain registrations offchain then this
   * returns `null`.
   *
   * @returns the requested `ContractRef` or `null` if the `Registry` records
   *          subname registrations offchain.
   */
  getContractRef(): ContractRef | null;
}

/**
 * This is the current official ENS registry.
 *
 * Given the lookup of a node for a name in this registry, this contract
 * first attempts to find the data for that node in its own internal registry.
 * If that internal lookup fails, this contract then attempts to lookup the
 * same request in `MAINNET_OLD_ENS_REGISTRY` as a fallback in the case that
 * the requested node hasn't been migrated to this (new) registry yet.
 */
export const MAINNET_ENS_REGISTRY_WITH_FALLBACK_CONTRACT = buildContractRef(
  MAINNET,
  buildAddress("0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e"),
);

/**
 * This is the old ENS registry. No new subnames should be issued here.
 */
export const MAINNET_OLD_ENS_REGISTRY = buildContractRef(
  MAINNET,
  buildAddress("0x314159265dD8dbb310642f98f50C066173C1259b"),
);

/**
 * This is the current official ENS registry.
 *
 * Given the lookup of a node for a name in this registry, this contract
 * first attempts to find the data for that node in its own internal registry.
 * If that internal lookup fails, this contract then attempts to lookup the
 * same request in `MAINNET_OLD_ENS_REGISTRY` as a fallback in the case that
 * the requested node hasn't been migrated to this (new) registry yet.
 */
export class MainnetENSRegistry implements Registry {
  public getContractRef(): ContractRef | null {
    return MAINNET_ENS_REGISTRY_WITH_FALLBACK_CONTRACT;
  }
}

export const MAINNET_ENS_REGISTRY = new MainnetENSRegistry();

/**
 * Models a `Registry` that records subdomain registrations offchain
 * through the use of ENSIP-10 (also known as "Wildcard Resolution").
 *
 * Subdomains issued into an offchain registry as generally refered to as
 * "offchain subnames".
 *
 * See https://docs.ens.domains/ensip/10 for more info.
 *
 * Generally an `OffchainRegistry` also makes use of the Cross Chain
 * Interoperability Protocol (also known as EIP-3668 or CCIP-Read for short) to
 * provide offchain management of resolver records for the offchain subnames it
 * manages.
 */
export class OffchainRegistry implements Registry {
  public getContractRef(): ContractRef | null {
    return null;
  }
}
