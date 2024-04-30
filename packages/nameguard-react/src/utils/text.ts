import { CheckResultCode, Rating } from "@namehash/nameguard";

export function checkResultCodeTextColor(
  check: CheckResultCode,
  isHover = false
): string {
  let color = "";

  switch (check) {
    case CheckResultCode.alert: {
      color = isHover ? "text-red-600 hover:text-red-700" : "text-red-600";
      return color;
    }
    case CheckResultCode.pass: {
      color = isHover
        ? "text-emerald-600 hover:text-emerald-800"
        : "text-emerald-600";
      return color;
    }
    case CheckResultCode.warn: {
      color = isHover
        ? "text-yellow-500 hover:text-yellow-600"
        : "text-yellow-500";
      return color;
    }
    case (CheckResultCode.info, CheckResultCode.skip): {
      color = isHover ? "text-gray-400 hover:text-gray-500" : "text-gray-400";
      return color;
    }
  }
}

export function ratingTextColor(rating: Rating, isHover = false): string {
  let color = "";

  switch (rating) {
    case Rating.alert: {
      color = isHover ? "text-red-600 hover:text-red-700" : "text-red-600";
      return color;
    }
    case Rating.pass: {
      color = isHover
        ? "text-emerald-600 hover:text-emerald-800"
        : "text-emerald-600";
      return color;
    }
    case Rating.warn: {
      color = isHover
        ? "text-yellow-500 hover:text-yellow-600"
        : "text-yellow-500";
      return color;
    }
  }
}
