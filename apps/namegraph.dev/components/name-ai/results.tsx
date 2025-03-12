import { Indicator } from "./indicator";

export function TokenAnalysisResults({ analysis }: any) {
  const topTokenization = analysis?.top_tokenization || [];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">NameAI Tokenization</h3>
        </div>

        <div className="bg-white flex items-center p-3 border border-gray-300 rounded mb-3 shadow-sm h-12">
          {topTokenization.length > 0 ? (
            topTokenization.map((token: any, index: any) => (
              <span
                key={index}
                className={`ens-webfont rounded px-3 py-1 text-sm border mr-2 ${
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
    </div>
  );
}
