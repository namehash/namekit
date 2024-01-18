import { notFound } from "next/navigation";
import { nameguard } from "@namehash/nameguard";

import { NGReport } from "@/app/components/NGReport";

export default async function Namekit({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;

  if (!name) return notFound();

  const decodedName = decodeURIComponent(name);

  const report = await nameguard.inspectName(decodedName);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <NGReport name={name} data={report} />
    </div>
  );
}
