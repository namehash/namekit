import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useCallback } from "react";

export const useClipboard = () => {
  const copyToClipboard = useCallback(
    (value: string, message = "Copied to clipboard") => {
      const copied = copy(value);
      if (copied) {
        toast(message);
      }
    },
    [],
  );

  return copyToClipboard;
};
