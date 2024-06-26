import React from "react";

import { Textarea, TextareaProps } from "./Textarea";

const ensInputClasses = "ens-webfont";

export const ENSTextarea: React.FC<TextareaProps> = (props) => {
  return (
    <Textarea
      {...props}
      className={`${props.className || ""} ${ensInputClasses}`}
    />
  );
};
