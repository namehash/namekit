import { analyzeNameRank } from "./actions";

interface ResultsProps {
  name: string;
}

export default async function Results({ name }: ResultsProps) {
  const result = await analyzeNameRank(name);

  const topTokenization = result.namerank.analysis.top_tokenization || [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">
        Label For Analysis: {result.namerank.analysis.inspection.label}
      </h2>

      <h3 className="text-lg font-semibold mb-2">Top Tokenization</h3>
      <div className="flex items-center mb-4">
        {topTokenization.length > 0 ? (
          topTokenization.map((token, index) => (
            <span
              key={index}
              className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold mr-2"
            >
              {token || "..."}
            </span>
          ))
        ) : (
          <span className="text-gray-500">No tokenization available</span>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">Alternative Tokenizations</h3>
      {result.namerank.analysis.tokenizations.map((tokenization, index) => (
        <div key={index} className="flex items-center mb-2">
          {tokenization.tokens.map((token, tokenIndex) => (
            <span
              key={tokenIndex}
              className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold mr-2"
            >
              {token || "..."}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
