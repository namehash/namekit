const LOG_PROB_GOOD = -1.0;
const LOG_PROB_WARNING = -10.0;

interface IndicatorProps {
  value: number;
}

export const Indicator = ({ value }: IndicatorProps) => {
  const getColorClass = (val: number): string => {
    if (val >= LOG_PROB_GOOD) {
      return "bg-green-500";
    } else if (val >= LOG_PROB_WARNING) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };

  const getLogProbabilityColor = (val: number): [number, number, number] => {
    // Ensure value is within bounds
    const clampedValue = Math.max(-100, Math.min(0, val));
    
    // Convert -100...0 range to 0...1 range
    const normalized = (clampedValue + 100) / 100;
    
    // Calculate green component (0 to 255)
    const green = Math.floor(255 * normalized);
    
    // Return RGB tuple (black to green)
    return [0, green, 0];
  };


  const [r, g, b] = getLogProbabilityColor(val);
  
  return (
    <div className="w-32 h-5 border border-gray-300 p-1 rounded overflow-hidden">
      <div className={`h-full rounded-sm`} style={{backgroundColor: `rgb(${r}, ${g}, ${b})`}} />
    </div>
  );
};
