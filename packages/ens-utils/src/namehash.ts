import { namehash as viem_namehash } from "viem";

/**
 * The "node" that uniquely identifies an `ENSName` as calculated by the `namehash` function.
 */
export interface ENSNameNode {
    /**
     * The node of `name` as calculated by the `namehash` function.
     * Guaranteed to always pass `isKeccak256Hash`.
     */
    node: `0x${string}`;
};

// TODO: Use type system to enforce that the input is normalized.
/**
 * Gets the `ENSNameNode` for an ENS name.
 * 
 * This function should only be used with normalized ENS names.
 * 
 * @param name The ENS name you want to get the `ENSNameNode` for.
 * @returns The `ENSNameNode` for the provided ENS name.
 */
export const namehash = (name: string): ENSNameNode => {
    return {
        node: viem_namehash(name),
    };
};

/**
 * The root node for all of ENS.
 */
export const ENS_ROOT_NODE: ENSNameNode = {
    node: "0x0000000000000000000000000000000000000000000000000000000000000000"
};