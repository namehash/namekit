import React, { ReactNode } from "react";
import cc from "classcat";
import { Rating } from "@namehash/nameguard";

function borderColor(rating: Rating) {
  switch (rating) {
    case Rating.alert: {
      return "ng-border-red-200";
    }
    case Rating.pass: {
      return "ng-border-green-200";
    }
    case Rating.warn: {
      return "ng-border-yellow-200";
    }
  }
}

function shadowColor(rating: Rating) {
  switch (rating) {
    case Rating.alert: {
      return "ng-shadow-red-50";
    }
    case Rating.pass: {
      return "ng-shadow-green-50";
    }
    case Rating.warn: {
      return "ng-shadow-yellow-50";
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

  const wrapperClass = cc([
    "ng-rounded-xl ng-border ng-shadow-xl",
    border,
    shadow,
  ]);

  return <div className={wrapperClass}>{children}</div>;
};
