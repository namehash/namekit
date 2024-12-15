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

  return (
    <div className="w-32 h-5 border border-gray-300 p-1 rounded overflow-hidden">
      <div className={`h-full ${getColorClass(value)} rounded-sm`} />
    </div>
  );
};
