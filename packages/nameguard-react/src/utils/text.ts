import { ENSName } from "@namehash/ens-utils";
import { CheckResultCode, Rating } from "@namehash/nameguard";

export function checkResultCodeTextColor(
  check: CheckResultCode,
  isInteractive = false,
): string {
  let color: string | null = null;

  switch (check) {
    case CheckResultCode.alert: {
      color = isInteractive
        ? "text-red-600 hover:text-red-700"
        : "text-red-600";
      break;
    }
    case CheckResultCode.pass: {
      color = isInteractive
        ? "text-emerald-600 hover:text-emerald-800"
        : "text-emerald-600";
      break;
    }
    case CheckResultCode.warn: {
      color = isInteractive
        ? "text-yellow-600 hover:text-yellow-700"
        : "text-yellow-600";
      break;
    }
    case CheckResultCode.info:
    case CheckResultCode.skip: {
      color = isInteractive
        ? "text-gray-400 hover:text-gray-500"
        : "text-gray-400";
      break;
    }
  }

  return color;
}

export function ratingTextColor(rating: Rating, isInteractive = false): string {
  let color: string | null = null;

  switch (rating) {
    case Rating.alert: {
      color = isInteractive
        ? "text-red-600 hover:text-red-700"
        : "text-red-600";
      break;
    }
    case Rating.pass: {
      color = isInteractive
        ? "text-emerald-600 hover:text-emerald-800"
        : "text-emerald-600";
      break;
    }
    case Rating.warn: {
      color = isInteractive
        ? "text-yellow-600 hover:text-yellow-700"
        : "text-yellow-600";
      break;
    }
  }

  return color;
}

export function getNameGuardURLForENSname(ensName: ENSName): string {
  return `https://nameguard.io/inspect/${encodeURIComponent(ensName.name)}`;
}
