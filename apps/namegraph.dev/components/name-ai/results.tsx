import { NLPLabelAnalysis } from "@namehash/nameai";
import { Indicator } from "./indicator";
<<<<<<< HEAD
import { Link } from "@namehash/namekit-react";
=======
>>>>>>> origin/main

export function TokenAnalysisResults({
  analysis,
  label,
}: {
  analysis: NLPLabelAnalysis;
  label: string;
}) {
  const topTokenization = analysis?.top_tokenization || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col p-3 pb-0 border border-gray-200 rounded">
        <div className="flex justify-between items-center mb-3">
          <Link
            href={`https://www.nameai.io/tokenization?label=${label}`}
            className="!text-lg font-semibold"
            target="_blank"
          >
            NameAI Tokenization
          </Link>
        </div>
        <div className="bg-white flex items-center mb-3 h-12">
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
