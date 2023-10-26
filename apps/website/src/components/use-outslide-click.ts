import { useRef, useEffect, type MutableRefObject } from "react";

type Callback = () => void;

export const useOutsideClick = (
  callback: Callback,
): MutableRefObject<null | HTMLDivElement> => {
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [callback, ref]);

  return ref;
};
