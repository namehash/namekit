import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nameguard } from "@namehash/nameguard";

import { NGReport } from "@/app/components/NGReport";

type Props = {
  params: { name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = params;

  if (!name) return notFound();

  const decodedName = decodeURIComponent(name);

  return {
    title: `${decodedName} - NameGuard Report`,
    twitter: {
      title: `${decodedName} - NameGuard Report`,
    },
    openGraph: {
      title: `${decodedName} - NameGuard Report`,
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
      <NGReport name={name} data={report} />
    </div>
  );
}
