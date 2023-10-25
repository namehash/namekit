import React from "react";
import { nameguard } from "@namehash/nameguard";

import { ReportWrapper } from "./report-wrapper";

export default async function ReportSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const decodedName = decodeURIComponent(slug);

  const data = await nameguard.inspectName(decodedName);

  return <ReportWrapper data={data} />;
}
