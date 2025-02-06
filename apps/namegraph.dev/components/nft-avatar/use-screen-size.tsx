import { useState, useEffect } from "react";

export const WIDEST_SCREEN_SIZE = 1439;
export const WIDE_SCREEN_SIZE = 1279;
export const DESKTOP_SCREEN_SIZE = 1023;
export const TABLET_SCREEN_SIZE = 768;

export const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [isWidestScreen, setIsWidestScreen] = useState(false);

  const checkIfIsMobile = () => {
    setIsMobile(
      window.matchMedia(`(max-width: ${TABLET_SCREEN_SIZE - 1}px)`).matches,
    );
    setIsTablet(
      window.matchMedia(`(max-width: ${DESKTOP_SCREEN_SIZE - 1}px)`).matches,
    );
    setIsDesktop(
      window.matchMedia(`(min-width: ${DESKTOP_SCREEN_SIZE}px)`).matches,
    );
    setIsWideScreen(
      window.matchMedia(`(min-width: ${WIDE_SCREEN_SIZE}px)`).matches,
    );
    setIsWidestScreen(
      window.matchMedia(`(min-width: ${WIDEST_SCREEN_SIZE}px)`).matches,
    );
  };

  useEffect(() => {
    checkIfIsMobile();

    window.addEventListener("resize", checkIfIsMobile);

    return () => {
      window.removeEventListener("resize", checkIfIsMobile);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWideScreen,
    isWidestScreen,
  };
};
