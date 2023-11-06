import { useRef, useEffect, type MutableRefObject } from "react";

type Callback = () => void;

export const useOutsideClick = (
  callback: Callback,
  isOpen: boolean
): MutableRefObject<null | HTMLDivElement> => {
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();

      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [callback, isOpen]);

  return ref;
};
