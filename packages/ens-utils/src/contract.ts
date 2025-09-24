import { ChainId } from "./chain";
import { Address } from "./address";

export interface ContractRef {
  /**
   * Chain Id of the contract.
   */
  chain: ChainId;

  /**
   * Contract address
   */
  address: Address;
}

/**
 * Builds a ContractRef object.
 * @param chain the chain where the contract lives.
 * @param address the address of the contract on the specified chain.
 * @returns a ContractRef object.
 */
export const buildContractRef = (
  chain: ChainId,
  address: Address,
): ContractRef => {
  return {
    chain,
    address,
  };
};
