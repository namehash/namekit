import { CheckResultCode, Rating } from "@namehash/nameguard";

export function checkResultCodeTextColor(
  check: CheckResultCode,
  isInteractive = false,
): string {
  switch (check) {
    case CheckResultCode.alert: {
      return isInteractive
        ? "text-red-600 hover:text-red-700"
        : "text-red-600";
    }
    case CheckResultCode.pass: {
      return isInteractive
        ? "text-emerald-600 hover:text-emerald-800"
        : "text-emerald-600";
    }
    case CheckResultCode.warn: {
      return isInteractive
        ? "text-yellow-600 hover:text-yellow-700"
        : "text-yellow-600";
    }
    case CheckResultCode.info:
    case CheckResultCode.skip: {
      return isInteractive
        ? "text-gray-400 hover:text-gray-500"
        : "text-gray-400";
    }
  }
}

export function ratingTextColor(rating: Rating, isInteractive = false): string {
  switch (rating) {
    case Rating.alert: {
      return isInteractive
        ? "text-red-600 hover:text-red-700"
        : "text-red-600";
    }
    case Rating.pass: {
      return isInteractive
        ? "text-emerald-600 hover:text-emerald-800"
        : "text-emerald-600";
    }
    case Rating.warn: {
      return isInteractive
        ? "text-yellow-600 hover:text-yellow-700"
        : "text-yellow-600";
    }
  }
}

export function ratingBorderColor(rating: Rating): string {
  switch (rating) {
    case Rating.alert: {
      return "border-red-200";
    }
    case Rating.pass: {
      return "border-green-200";
    }
    case Rating.warn: {
      return "border-yellow-200";
    }
  }
}

export function ratingShadowColor(rating: Rating): string {
  switch (rating) {
    case Rating.alert: {
      return "shadow-red-50";
    }
    case Rating.pass: {
      return "shadow-green-50";
    }
    case Rating.warn: {
      return "shadow-yellow-50";
    }
  }
}
