import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const previous = useRef<T>();

  useEffect(() => {
    previous.current = value;
  }, [value]);

  return previous.current;
}
