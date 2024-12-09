import React, { type ReactNode } from "react";
import cc from "classcat";

interface Props {
  additionalStyle: string;
  children: ReactNode;
}

export const IconWrapper = ({ additionalStyle, children }: Props) => {
  return (
    <div
      className={cc(["z-50 rounded-full p-5 flex w-[80px]", additionalStyle])}
    >
      {children}
    </div>
  );
};
