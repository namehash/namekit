import React, { ReactNode } from "react";
import cc from "classcat";
import { Rating } from "@namehash/nameguard";

function borderColor(rating: Rating) {
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
    default: {
      return "border-gray-200";
    }
  }
}

function shadowColor(rating: Rating) {
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
    default: {
      return "shadow-gray-50";
    }
  }
}

type RatedBoxProps = {
  rating?: Rating;
  children: ReactNode;
};

export const RatedBox = ({ rating, children }: RatedBoxProps) => {
  const border = borderColor(rating);
  const shadow = shadowColor(rating);

  const wrapperClass = cc(["rounded-xl border shadow-xl", border, shadow]);

  return <div className={wrapperClass}>{children}</div>;
};
