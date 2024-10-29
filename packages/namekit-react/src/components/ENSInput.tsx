import React from "react";
import cc from "classcat";

import { Input, InputProps } from "./Input";

export const ENSInput: React.FC<InputProps> = (props) => {
  return <Input {...props} className={cc([props.className, "ens-webfont"])} />;
};
