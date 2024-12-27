import Skeleton from "@/components/skeleton";
import { ArrowNavigationBar } from "./arrow-navigation-bar";
import { RelatedCollectionPill } from "./related-collection-pill";
import { NameGraphRelatedCollectionResponse } from "@namehash/namegraph-sdk/utils";
import { RELATED_COLLECTION_PILLS_RESULTS_NUMBER } from "@/lib/utils";

interface RecursiveRelatedCollectionPillsProps {
  recursiveRelatedCollections: NameGraphRelatedCollectionResponse[];
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
      {Array(RELATED_COLLECTION_PILLS_RESULTS_NUMBER).map((idx) => (
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
