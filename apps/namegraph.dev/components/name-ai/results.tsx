import { NLPLabelAnalysis } from "@namehash/nameai";
import { Indicator } from "./indicator";
import { NameAILogo } from "./nameai-logo";
import Link from "next/link";

export function TokenAnalysisResults({
  analysis,
  label,
}: {
  analysis: NLPLabelAnalysis;
  label: string;
}) {
  const topTokenization = analysis?.top_tokenization || [];

  return (
    <div className="space-y-6 p-3 pb-0 border border-gray-200 rounded">
      <div className="md:w-[80%] md:mx-auto lg:w-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="flex justify-start space-x-2 items-center">
              <NameAILogo className="w-6 h-6" />
              <Link
                className="animated-black-underline font-medium text-right"
                href={`https://www.nameai.io/tokenization?label=${label}`}
                target="_blank"
              >
                NameAI Tokenization
              </Link>
            </div>
          </div>
          {analysis.word_count ? (
            <div className="text-sm text-gray-400 font-semibold">
              {analysis.word_count} word{analysis.word_count > 1 ? "s" : ""}
            </div>
          ) : null}
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
