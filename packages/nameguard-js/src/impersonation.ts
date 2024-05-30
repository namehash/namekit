import { ens_normalize } from "@adraffy/ens-normalize";
import { splitGraphemes } from "text-segmentation";
import { graphemeConfusableAnalysis } from "./confusables";

export enum ImpersonationStatus {
    UNLIKELY,
    POTENTIAL,
}

const LABELHASH_REGEX = /^\[[0-9a-f]{64}\]$/;

function isLabelhash(label: string): boolean {
    return LABELHASH_REGEX.test(label);
}

function getCanonicalLabel(label: string): string | null {
    const canonicals: string[] = [];
    for (const grapheme of splitGraphemes(label)) {
        const conf = graphemeConfusableAnalysis(grapheme);
        if (!conf.isConfusable) {
            canonicals.push(grapheme);
        } else if (conf.canonical === null) {
            return null;
        } else {
            canonicals.push(conf.canonical);
        }
    }
    return canonicals.join("");
}

function getNormalizedCanonicalLabel(label: string): string | null {
    const canonicalLabel = getCanonicalLabel(label);
    if (canonicalLabel === null) {
        return null;
    }
    try {
        return ens_normalize(canonicalLabel);
    } catch (e) {
        return null;
    }
}

export function computeImpersonationStatus(name: string): ImpersonationStatus {
    const labels = name.length === 0 ? [] : name.split(".");
    if (labels.some(isLabelhash)) {
        return ImpersonationStatus.POTENTIAL;
    }
    const canonicals = labels.map(getNormalizedCanonicalLabel);
    if (canonicals.includes(null)) {
        return ImpersonationStatus.POTENTIAL;
    }
    const canonical = canonicals.join(".");
    const passed = canonical === name;
    return passed ? ImpersonationStatus.UNLIKELY : ImpersonationStatus.POTENTIAL;
}
