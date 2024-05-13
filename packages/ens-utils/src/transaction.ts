export interface TxnHash {
    hash: `0x${string}`;
}

const regex = /^0x[0-9a-fA-F]{64}$/;

const isTxnHash = (maybeTxnHash: string): boolean => {
    return regex.test(maybeTxnHash);
}

export const buildTxnHash = (maybeTxnHash: string): TxnHash => {

    if (!isTxnHash(maybeTxnHash))
        throw new Error(`Invalid transaction hash: ${maybeTxnHash}`);

    const normalizedHash = maybeTxnHash.toLowerCase() as `0x${string}`;

    return {
        hash: normalizedHash
    };
}