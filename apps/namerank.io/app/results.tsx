import { namerank } from "@namehash/namerank";
import { Indicator } from "./indicator";

interface ResultsProps {
  name: string;
}

export default async function Results({ name }: ResultsProps) {
  if (!name) return null;

  const result = await namerank.inspectName(name, {});

  console.log({ result });

  if (!result.namerank || !result.namerank.analysis) {
    return <p>Please try again.</p>;
  }

  const topTokenization = result.namerank.analysis.top_tokenization || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Label For Analysis</h3>

        <p className="ens-webfont flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm">
          {result.namerank.analysis.inspection.label}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Top Tokenization</h3>
        <div className="flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm">
          {topTokenization.length > 0 ? (
            topTokenization.map((token, index) => (
              <span
                key={index}
                className={`ens-webfont rounded px-3 py-1 text-sm border font-semibold mr-2 ${
                  token ? "bg-white border-gray-200" : "bg-gray-200 opacity-30"
                }`}
              >
                {token || "..."}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No tokenization available</span>
          )}
          {result.namerank.analysis.top_tokenization && (
            <div className="ml-auto">
              <Indicator value={result.namerank.analysis.log_probability} />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          Alternative Tokenizations
        </h3>
        {result.namerank.analysis.tokenizations.map((tokenization, index) => (
          <div
            key={index}
            className="flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm"
          >
            {tokenization.tokens.map((token: string, tokenIndex: any) => (
              <span
                key={tokenIndex}
                className={`ens-webfont rounded px-3 py-1 text-sm border font-semibold mr-2 ${
                  token ? "bg-white border-gray-200" : "bg-gray-200 opacity-30"
                }`}
              >
                {token || "..."}
              </span>
            ))}
            <div className="ml-auto">
              <Indicator value={tokenization.log_probability} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
