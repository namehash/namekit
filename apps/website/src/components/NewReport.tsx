"use client";

import { Fragment } from "react";
import useSWR from "swr";
import { ReportHeader, Report } from "@namehash/nameguard-react";
import type { ParsedName } from "@namehash/nameparser";
import { NameGuardReport, nameguard } from "@namehash/nameguard";

import { LoadingSkeleton } from "./LoadingSkeleton";

async function fetchName(name: string) {
  return nameguard.inspectName(name);
}

type Props = {
  name: ParsedName;
};

export function NewReport(props: Props) {
  const { name } = props;

  const normalizationUnknown = name.outputName.normalization === "unknown";

  const { data, error, isLoading } = useSWR<NameGuardReport>(
    name.outputName.name,
    fetchName
  );

  return (
    <Fragment>
      <ReportHeader />
      {isLoading && normalizationUnknown && (
        <LoadingSkeleton parsedName={name} />
      )}
      {isLoading && !normalizationUnknown && (
        <LoadingSkeleton parsedName={name} />
      )}
      {data && <Report parseNameResponse={name} data={data} />}
      {error && <p>Error: {error.message}</p>}
    </Fragment>
  );
}
