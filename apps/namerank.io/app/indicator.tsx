export const calculateNormalizedPercentage = (
  logProbability: number,
): number => {
  // Ensure value is within bounds
  const clampedValue = Math.max(-100, Math.min(0, logProbability));

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

  const width = Math.max(50, 128 * normalizedPercentage);

  return (
    <div
      className={`h-2 rounded`}
      style={{ backgroundColor: `rgb(${r}, ${g}, ${b})`, width: `${width}px` }}
    />
  );
};
