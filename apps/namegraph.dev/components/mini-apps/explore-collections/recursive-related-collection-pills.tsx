import { NameGraphRelatedCollection } from "@/lib/utils";
import { ArrowNavigationBar } from "./arrow-navigation-bar";
import { RelatedCollectionPill } from "./related-collection-pill";
import Skeleton from "@/components/skeleton";

interface RecursiveRelatedCollectionPillsProps {
  recursiveRelatedCollections: NameGraphRelatedCollection[];
}

export const RecursiveRelatedCollectionPills = ({
  recursiveRelatedCollections,
}: RecursiveRelatedCollectionPillsProps) => {
  if (recursiveRelatedCollections.length === 0) {
    return null;
  }

  const RelatedCollectionPillsSkeleton = (
    <div className="ml-1 flex flex-wrap items-center text-sm mt-3 gap-2">
      <p className="font-light min-w-[128px]">Check out related collections:</p>
      {Array(3).map((idx) => (
        <Skeleton key={idx} />
      ))}
    </div>
  );

  if (
    recursiveRelatedCollections === null ||
    recursiveRelatedCollections.length === 0
  )
    return RelatedCollectionPillsSkeleton;

  return (
    <>
      <ArrowNavigationBar
        skeletonMarkup={RelatedCollectionPillsSkeleton}
        barContentMarkup={
          <div className="flex flex-col text-sm mt-3 items-center gap-2">
            <p className="font-light min-w-[128px]">
              Check out related collections:
            </p>
            {recursiveRelatedCollections.map((collection) => (
              <RelatedCollectionPill
                key={collection.collection_id}
                relatedCollection={collection}
              />
            ))}
          </div>
        }
      />
    </>
  );
};
