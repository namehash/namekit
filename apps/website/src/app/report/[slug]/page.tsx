import React from "react";
import { nameguard } from "@namehash/nameguard";
import { parseName } from "@namehash/nameparser";

import { ReportWrapper } from "./report-wrapper";

export default async function ReportSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const decodedName = decodeURIComponent(slug);

  const { outputName } = parseName(decodedName);

  const data = await nameguard.inspectName(outputName);

  return <ReportWrapper data={data} name={outputName} />;
}
