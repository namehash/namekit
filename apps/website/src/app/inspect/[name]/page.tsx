import { notFound } from "next/navigation";
import { Report, useChatModalStore } from "@namehash/nameguard-react";

export default function InspectNamePage({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;

  if (!name) return notFound();

  const decodedName = decodeURIComponent(name);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Report name={decodedName} useChatModalStore={useChatModalStore} />
    </div>
  );
}
