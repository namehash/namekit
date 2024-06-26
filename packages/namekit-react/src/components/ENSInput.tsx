import React from "react";

import { Input, InputProps } from "./Input";

const ensInputClasses = "ens-webfont";

export const ENSInput: React.FC<InputProps> = (props) => {
  return (
    <Input
      {...props}
      className={`${props.className || ""} ${ensInputClasses}`}
    />
  );
};
