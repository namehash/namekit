import { NameDetailsPage } from "./name-details-page";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const name = (await params).name;
  return <NameDetailsPage name={name} />;
}
