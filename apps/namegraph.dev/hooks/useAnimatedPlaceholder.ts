import { useState, useEffect, useCallback } from "react";

const STATIC_TEXT = {
  full: "Search your favorite ",
  mobile: "Search ",
};

const PROMPTS = [
  { full: "bands", mobile: "bands" },
  { full: "cities", mobile: "cities" },
  { full: "movies", mobile: "movies" },
  { full: "people", mobile: "people" },
  { full: "video games", mobile: "games" },
  { full: "artists", mobile: "artists" },
];

const TYPING_SPEED = 100;
const DELAY_BETWEEN_PROMPTS = 2000;

export function useAnimatedPlaceholder() {
  const [animatedPart, setAnimatedPart] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    // Check initial size
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      const currentPrompt =
        PROMPTS[currentPromptIndex][isMobile ? "mobile" : "full"];
      if (animatedPart.length < currentPrompt.length) {
        timeout = setTimeout(() => {
          setAnimatedPart(currentPrompt.slice(0, animatedPart.length + 1));
        }, TYPING_SPEED);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, DELAY_BETWEEN_PROMPTS);
      }
    } else {
      if (animatedPart.length > 0) {
        timeout = setTimeout(() => {
          setAnimatedPart(animatedPart.slice(0, -1));
        }, TYPING_SPEED / 2);
      } else {
        setCurrentPromptIndex((prev) => (prev + 1) % PROMPTS.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [animatedPart, currentPromptIndex, isTyping, isMobile]);

  return (isMobile ? STATIC_TEXT.mobile : STATIC_TEXT.full) + animatedPart;
}
