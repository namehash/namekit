import { ens_beautify, ens_normalize } from "@adraffy/ens-normalize";
import { PublicClient } from "viem";
import { ImpersonationStatus, computeImpersonationStatus } from "./impersonation";
import { lookupPrimaryName } from "./lookup";

export enum PrimaryNameStatus {
    NORMALIZED,
    UNNORMALIZED,
    NO_PRIMARY_NAME,
}

export interface SecurePrimaryNameResult {
    primaryName: string | null;
    impersonationStatus: ImpersonationStatus | null;
    displayName: string;
    primaryNameStatus: PrimaryNameStatus;
}

export async function securePrimaryName(address: string, client: PublicClient): Promise<SecurePrimaryNameResult> {
    const primaryName = await lookupPrimaryName(address, client)
    const unnamedName = `Unnamed ${address.slice(2, 6).toLowerCase()}`
    if (primaryName === null) {
        return {
            primaryName: null,
            impersonationStatus: null,
            displayName: unnamedName,
            primaryNameStatus: PrimaryNameStatus.NO_PRIMARY_NAME,
        };
    }
    if (ens_normalize(primaryName) !== primaryName) {
        return {
            primaryName: null,
            impersonationStatus: null,
            displayName: unnamedName,
            primaryNameStatus: PrimaryNameStatus.UNNORMALIZED,
        };
    }
    const beautifulName = ens_beautify(primaryName);
    return {
        primaryName: primaryName,
        impersonationStatus: computeImpersonationStatus(primaryName),
        displayName: beautifulName,
        primaryNameStatus: PrimaryNameStatus.NORMALIZED,
    };
}