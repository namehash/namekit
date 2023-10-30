"use client";

import { useMemo, Fragment } from "react";
import useSWR from "swr";
import { ReportHeader, Report } from "@namehash/nameguard-react";
import { parseName } from "@namehash/nameparser";
import { NameGuardReport, nameguard } from "@namehash/nameguard";

import { LoadingSkeleton } from "./LoadingSkeleton";
import { useSearchSettings } from "./use-search-settings";

async function fetchName(name: string) {
  return nameguard.inspectName(name);
}

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

  const { data, error } = useSWR<NameGuardReport>(
    parseNameResponse.outputName.name,
    fetchName
  );

  return (
    <Fragment>
      <ReportHeader />
      {!data && normalizationUnknown && <LoadingSkeleton />}
      {!data && !normalizationUnknown && (
        <LoadingSkeleton
          name={parseNameResponse.outputName.name}
          displayName={parseNameResponse.outputName.displayName}
        />
      )}
      {data && <Report parseNameResponse={parseNameResponse} data={data} />}
      {error && <p>Error: {error.message}</p>}
    </Fragment>
  );
}
