import { ExploreCollectionPage } from "./explore-collection-page";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <ExploreCollectionPage id={id} />;
}
