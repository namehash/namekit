import { useEffect, useState } from "react";

export const useCountdown = (milliseconds: number) => {
  function reset(newDelay?: number): void {
    if (newDelay) {
      setCountDown(newDelay);
      return;
    }
    setCountDown(milliseconds);
  }

  const [countDown, setCountDown] = useState(milliseconds);

  useEffect(() => {
    if (countDown < 1) {
      setCountDown(0);
      return;
    }
    const interval = setInterval(() => {
      setCountDown(countDown - 50);
    }, 50);

    return () => clearInterval(interval);
  }, [countDown]);

  return { countDown, reset };
};
