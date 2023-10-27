"use client";

import { useMemo, Fragment } from "react";
import {
  useInspectName,
  Shield,
  ReportHeader,
  Banner,
  CheckResultCard,
  GraphemeCard,
  ReportFooter,
} from "@namehash/nameguard-react";
import { parseName } from "@namehash/nameparser";
import { useSearchSettings } from "./use-search-settings";
import { NameGuardReport } from "@namehash/nameguard";

type Props = {
  input: string;
};

export function NewReport(props: Props) {
  const { input } = props;
  const { settings } = useSearchSettings();

  const parseNameResponse = useMemo(() => {
    return parseName(input, settings);
  }, [input, settings]);

  const normalizationUnknown =
    parseNameResponse.outputName.normalization === "unknown";

  const { loading, error, data } = useInspectName(
    parseNameResponse.outputName.name
  ) as { loading: boolean; error: any; data: NameGuardReport | null };

  const rawLabels = data?.labels.map((label) => label.label) ?? [];

  return (
    <Fragment>
      <ReportHeader />
      {loading && normalizationUnknown && <LoadingSkeleton />}
      {loading && !normalizationUnknown && (
        <LoadingSkeleton
          name={parseNameResponse.outputName.name}
          displayName={parseNameResponse.outputName.displayName}
        />
      )}
      {data && (
        <Fragment>
          <Banner parsedName={parseNameResponse} report={data} />
          <div className="space-y-4 md:space-y-5">
            <p className="text-black font-semibold text-lg leading-6">
              {data?.risk_count} of {data?.checks.length} risks found
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {data?.checks.map((check, index) => (
                <CheckResultCard key={index} {...check} />
              ))}
            </div>
          </div>
          <div className="space-y-4 md:space-y-5">
            <p className="text-black font-semibold text-lg leading-6">
              Name inspection
            </p>

            {data?.labels.map((label, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md divide-y divide-gray-200"
              >
                <div className="py-[10px] px-6 text-sm font-normal">
                  {rawLabels.map((l, index) => (
                    <Fragment key={index}>
                      <span
                        className={
                          l === label.label
                            ? "text-black font-semibold"
                            : "text-gray-500 grayscale"
                        }
                      >
                        {l}
                      </span>
                      {index < rawLabels.length - 1 && (
                        <span className="text-gray-500">.</span>
                      )}
                    </Fragment>
                  ))}
                </div>
                {label?.graphemes?.map((grapheme, index) => (
                  <GraphemeCard key={index} {...grapheme} />
                ))}
              </div>
            ))}
          </div>
          <ReportFooter />
        </Fragment>
      )}
      {error && <p>Error: {error.message}</p>}
    </Fragment>
  );
}

type LoadingProps = {
  name?: string;
  displayName?: string;
};

// TODO: Move back into Banner.tsx
function LoadingSkeleton({ name, displayName }: LoadingProps) {
  const displayNameDifferent = name !== displayName;

  return (
    <div className="rounded-xl border shadow-xl divide-y divide-gray-200 space-y-4 md:space-y-0 border-gray-200 shadow-gray-50">
      <div className="p-5 md:py-7 md:px-10 flex flex-col md:flex-row md:items-start justify-between">
        <div className="md:w-4/6">
          <p className="uppercase text-[12px] text-gray-500 font-medium">
            Rating for
          </p>
          {name ? (
            <>
              <h1 className="mt-1 text-2xl md:text-4xl text-black font-semibold md:font-bold overflow-hidden overflow-ellipsis">
                {name}
              </h1>
              {displayNameDifferent && (
                <p className="text-sm text-gray-500 mt-4">
                  <span className="mr-2.5">Generally displays as:</span>
                  <span className="text-black">{displayName}</span>
                </p>
              )}
            </>
          ) : (
            <div className="mt-5 w-40 h-3 rounded bg-gradient-to-r from-gray-300 to-gray-100 animate-pulse"></div>
          )}
        </div>
        <div className="flex items-start space-x-4 pt-5 md:pt-0 md:w-2/6">
          <Shield status="info" size="large" />
          <div className="space-y-1">
            <p className="font-semibold text-sm md:text-2xl text-gray-500">
              Inspecting...
            </p>
            <p className="text-gray-500 text-sm font-normal leading-6">
              Analyzing name details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
