import React from "react";
import cc from "classcat";

import { TextArea, TextAreaProps } from "./TextArea";

export const EnsTextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <TextArea {...props} className={cc([props.className, "ens-webfont"])} />
  );
};
