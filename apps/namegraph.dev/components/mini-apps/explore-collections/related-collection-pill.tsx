import { NameGraphRelatedCollectionResponse } from "@namehash/namegraph-sdk/utils";
import { TruncatedText } from "@namehash/namekit-react/client";

interface RelatedCollectionPillProps {
  relatedCollection: NameGraphRelatedCollectionResponse;
}

export const RelatedCollectionPill = ({
  relatedCollection,
}: RelatedCollectionPillProps) => {
  return (
    <div className="bg-gray-100 p-1 px-2.5 rounded-xl hover:bg-gray-200 transition">
      <TruncatedText
        maxDisplayWidth={200}
        displayTooltipWhenTextOverflows={true}
        text={relatedCollection.collection_title}
      />
    </div>
  );
};
