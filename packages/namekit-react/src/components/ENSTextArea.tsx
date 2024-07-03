import React from "react";
import cc from "classcat";

import { TextArea, TextAreaProps } from "./TextArea";

export const ENSTextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <TextArea {...props} className={cc([props.className, "ens-webfont"])} />
  );
};
