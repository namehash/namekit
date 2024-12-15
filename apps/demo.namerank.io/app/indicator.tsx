const LOG_PROB_GOOD = -1.0;
const LOG_PROB_WARNING = -2.0;

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

  return <div className={`w-5 h-5 rounded-full ${getColorClass(value)}`} />;
};
