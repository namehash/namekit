import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nameguard } from "@namehash/nameguard";
import { NGReport } from "@/components/molecules";
import {
  defaultMetaOpengraph,
  defaultMetaTwitter,
} from "@/app/shared-metadata";

type Props = {
  params: { name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = params;

  if (!name) return notFound();

  const decodedName = decodeURIComponent(name);
  const title = decodedName;
  const description = `NameGuard Report for ${decodedName}`;
  const url = `/inspect/${name}`;

  return {
    title,
    description,
    openGraph: {
      ...defaultMetaOpengraph,
      title,
      description,
      url,
    },
    twitter: {
      ...defaultMetaTwitter,
      title,
      description,
    },
  };
}

export default async function Namekit({ params }: Props) {
  const { name } = params;

  if (!name) return notFound();

  const decodedName = decodeURIComponent(name);

  const report = await nameguard.inspectName(decodedName);

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 pb-12">
      <NGReport name={decodedName} data={report} />
    </div>
  );
}
