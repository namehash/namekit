import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nameguard } from "@namehash/nameguard";
import { NGReport } from "@/components/molecules";

type Props = {
  params: { name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = params;

  if (!name) return notFound();

  const decodedName = decodeURIComponent(name);

  return {
    title: `Report for ${decodedName}`,
    twitter: {
      title: `Report for ${decodedName}`,
    },
    openGraph: {
      title: `Report for ${decodedName}`,
    },
  };
}

export default async function Namekit({ params }: Props) {
  const { name } = params;

  if (!name) return notFound();

  const decodedName = decodeURIComponent(name);

  const report = await nameguard.inspectName(decodedName);

  return (
    <div className="max-w-7xl mx-auto p-6 py-12">
      <NGReport name={decodedName} data={report} />
    </div>
  );
}
