import { type NameAIReport } from "@namehash/nameai";

import { Indicator } from "./indicator";
import { ProbabilityHeader } from "../skeleton";

export function Results({ analysis }: NameAIReport) {
  const topTokenization = analysis?.top_tokenization || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Label For Analysis</h3>

        <p className="bg-white ens-webfont flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm h-12">
          {analysis?.inspection.label}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Recommended Tokenization</h3>
          <ProbabilityHeader />
        </div>

        <div className="bg-white flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm h-12">
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
            <span className="text-gray-500">
              Insufficient confidence to recommend.
            </span>
          )}
          {analysis?.top_tokenization && (
            <div className="ml-auto">
              <Indicator log_probability={analysis.log_probability} />
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Discovered Tokenizations</h3>
          <ProbabilityHeader />
        </div>

        {analysis?.tokenizations.length === 0 && (
          <div className="bg-white flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm h-12">
            <span className="text-gray-500">
              No tokenizations were discovered.
            </span>
          </div>
        )}
        {analysis?.tokenizations.map((tokenization, index) => (
          <div
            key={index}
            className="bg-white flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm h-12"
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
              <Indicator log_probability={tokenization.log_probability} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
