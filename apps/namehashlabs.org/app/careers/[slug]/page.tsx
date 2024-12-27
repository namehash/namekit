import { Role } from "../../../types";
import rolesData from "../../../data/rolesData";
import { RolePage } from "@/components/3 - organisms/role-page";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import {
  defaultMetaOpengraph,
  defaultMetaTwitter,
} from "../../shared-metadata";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const role = rolesData.roles.find((role: Role) => role.slug === slug);

  if (!role) {
    return notFound();
  }

  const title = `${role.title} Role`;
  const description = `Join us as a ${role.title} at NameHash Labs.`;
  const url = `/careers/${role.slug}`;

  return {
    title,
    description,
    keywords: [
      "ens",
      "web3",
      "eth",
      "namehash",
      "careers",
      role.title.toLowerCase(),
    ],
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

export default function Page({ params }: Props) {
  const { slug } = params;

  const role = rolesData.roles.find((role: Role) => role.slug === slug);

  if (!role) {
    notFound();
  }

  return (
    <section className="w-full lg:pb-20 pb-5 px-5 lg:px-[50px]">
      <RolePage {...role} />
    </section>
  );
}
