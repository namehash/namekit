import React, { ReactNode } from "react";
import cc from "classcat";
import { Rating } from "@namehash/nameguard";
import { ratingBorderColor, ratingShadowColor } from "../../utils/colors";

type RatedBoxProps = {
  rating?: Rating;
  children: ReactNode;
};

export const RatedBox = ({ rating, children }: RatedBoxProps) => {
  const border = ratingBorderColor(rating);
  const shadow = ratingShadowColor(rating);

  const wrapperClass = cc(["rounded-xl border shadow-xl", border, shadow]);

  return <div className={wrapperClass}>{children}</div>;
};
