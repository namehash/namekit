import React from "react";
import cc from "classcat";

import { Textarea, TextareaProps } from "./Textarea";

export const ENSTextarea: React.FC<TextareaProps> = (props) => {
  return (
    <Textarea {...props} className={cc([props.className, "ens-webfont"])} />
  );
};
