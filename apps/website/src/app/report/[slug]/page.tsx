import React from "react";
import { nameguard } from "@namehash/nameguard";
// import { Report } from "@namehash/nameguard-react";

export default async function NamePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const decodedName = decodeURIComponent(slug);

  const data = await nameguard.inspectName(decodedName);

  return (
    <>
      {/* <Report data={data} /> */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
