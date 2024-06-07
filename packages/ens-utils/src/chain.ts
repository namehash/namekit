export interface ChainId {

    /**
     * Chain Id. See https://chainlist.org/
     * Always a positive integer.
     */
    chainId: number;
};

export interface ChainMetadata {

    /**
     * Chain Id.
     */
    chain: ChainId;

    /**
     * Distinct chain name.
     */
    name: string;

    /**
     * Chain name for display to end users.
     */
    displayName: string;
};

/**
 * Builds a ChainId object.
 * @param maybeChainId the chain ID to reference. See https://chainid.network/
 * @returns a ChainRef object.
 */
export const buildChainId = (
    maybeChainId: number | string,
): ChainId => {

    let chainId : number;

    if (typeof maybeChainId === "string") {

        chainId = Number(maybeChainId);
    } else {
        chainId = maybeChainId;
    }

    if (Number.isNaN(chainId)) {
        throw new Error(`Invalid chain ID: ${maybeChainId}. All chain IDs must be numbers.`);
    }

    if (!Number.isFinite(chainId)) {
        throw new Error(`Invalid chain ID: ${maybeChainId}. All chain IDs must be finite numbers.`);
    }

    if (!Number.isInteger(chainId)) {
        throw new Error(`Invalid chain ID: ${maybeChainId}. All chain IDs must be integers.`);
    }

    if (!Number.isSafeInteger(chainId)) {
        throw new Error(`Invalid chain ID: ${maybeChainId}. All chain IDs must be safe integers.`);
    }

    if (chainId <= 0) {
        throw new Error(`Invalid chain ID: ${maybeChainId}. All chain IDs must be positive integers.`);
    }

    return {
        chainId,
    };
}

let knownChains: ChainMetadata[] = [];

/**
 * Add a chain to the list of known chains.
 * Throws an error if a chain with the same ID or name is already registered.
 */ 
export const addKnownChain = (
    metadata: ChainMetadata
): void => {
    knownChains.every(c => {
        if (c.chain.chainId === metadata.chain.chainId) {
            throw new Error(`Chain with ID ${metadata.chain.chainId} already registered.`);
        }
        if (c.name === metadata.name) {
            throw new Error(`Chain with name ${metadata.name} already registered.`);
        }
        return true;
    });
    knownChains.push(metadata);
}

// starting simple here
export const MAINNET = buildChainId(1);
export const SEPOLIA = buildChainId(11155111);

export const DEFAULT_CHAIN = MAINNET;

addKnownChain({chain: MAINNET, name: "mainnet", displayName: "Ethereum Mainnet" });
addKnownChain({chain: SEPOLIA, name: "sepolia", displayName: "Sepolia" });

/**
 * Get a chain by name (case-sensitive).
 * @param name name of the chain to get.
 * @returns A `ChainId` object if the chain is known, otherwise throws an error.
 */
export const getChainByName = (
    name: string
): ChainId => {
    const chain = knownChains.find(c => c.name === name);
    if (!chain) throw new Error(`Unknown chain: ${name}`);
    return chain.chain;
}

/**
 * Get the chain metadata for a given chain.
 * @param chainId chain to get metadata for.
 * @returns A `ChainMetadata` object if the chain is known, otherwise throws an error.
 */
export const getChainMetadata = (
    chainId: ChainId
): ChainMetadata => {
    const chain = knownChains.find(c => c.chain.chainId === chainId.chainId);
    if (!chain) throw new Error(`Unknown chainId: ${chainId.chainId}`);
    return chain;
}