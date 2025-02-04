"use client";

import { Tooltip } from "@namehash/namekit-react/client";

export const calculateNormalizedPercentage = (
  log_probability: number,
): number => {
  // Ensure value is within bounds
  const clampedValue = Math.max(-100, Math.min(0, log_probability));

  // Convert -100...0 range to 0...1 range
  return (clampedValue + 100) / 100;
};

export const getRGBColor = (
  normalizedPercentage: number,
): [number, number, number] => {
  // Calculate green component (0 to 255)
  const green = Math.floor(255 * normalizedPercentage);

  // Return RGB tuple (black to green)
  return [0, green, 0];
};

interface IndicatorProps {
  log_probability: number;
}

export const Indicator = ({ log_probability }: IndicatorProps) => {
  const normalizedPercentage = calculateNormalizedPercentage(log_probability);
  const [r, g, b] = getRGBColor(normalizedPercentage);

  const minWidth = 20;
  const maxWidth = 128;
  const width = Math.max(minWidth, maxWidth * normalizedPercentage);

  const getTooltipMessage = (percentage: number) => {
    if (percentage >= 0.75) {
      return "Higher probability";
    } else if (percentage >= 0.5) {
      return "Moderate probability";
    } else {
      return "Lower probability";
    }
  };

  return (
    <div
      className="h-2 rounded cursor-help"
      style={{
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        width: `${width}px`,
      }}
    />
    // <Tooltip
    //   trigger={
    //     <div
    //       className="h-2 rounded cursor-help"
    //       style={{
    //         backgroundColor: `rgb(${r}, ${g}, ${b})`,
    //         width: `${width}px`,
    //       }}
    //     />
    //   }
    // >
    //   {getTooltipMessage(normalizedPercentage)}
    // </Tooltip>
  );
};
