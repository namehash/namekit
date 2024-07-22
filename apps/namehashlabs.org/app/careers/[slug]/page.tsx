import { Role } from "../../../types";
import rolesData from "../../../data/rolesData";
import { RolePage } from "@/components/3 - organisms/role-page";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: { slug: string };
}

// Generate metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const role = rolesData.roles.find((role: Role) => role.slug === slug);

  if (!role) {
    return {
      title: "Role not found - NameHash Labs",
      description: "The role you are looking for does not exist.",
    };
  }

  return {
    title: `${role.title} - NameHash Labs`,
    description: `Join us as a ${role.title} at NameHash Labs.`,
    keywords: [
      "ens",
      "web3",
      "eth",
      "namehash",
      "careers",
      role.title.toLowerCase(),
    ],
  };
}

export default function Page({ params }: Props) {
  // Destructure slug from params
  const { slug } = params;

  // Find the role using the slug
  const role = rolesData.roles.find((role: Role) => role.slug === slug);

  if (!role) {
    notFound();
  }

  return (
    <section className="w-full lg:pb-20 pb-5 px-5 lg:px-[112px]">
      <RolePage {...role} />
    </section>
  );
}
