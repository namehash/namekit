import Skeleton from "../skeleton";

const NUMBER_OF_SKELETONS_OF_COLLECTION_CARDS = 5;

export const CollectionsCardsSkeleton = ({
  className = "flex flex-col space-y-2.5",
  number = NUMBER_OF_SKELETONS_OF_COLLECTION_CARDS,
}) => {
  return (
    <div className={className}>
      {[...Array(number).keys()].map((collection) => {
        return (
          <div key={collection}>
            <CollectionCardSkeleton />
          </div>
        );
      })}
    </div>
  );
};

const CollectionCardSkeleton = () => {
  return (
    <div className="flex py-3 overflow-hidden">
      <div className="ml-3">
        <Skeleton className="w-[73px] h-[73px]" />
      </div>
      <div className="relative w-full flex flex-col justify-start space-y-2 ml-[18px] items-start">
        <div className="flex flex-col space-y-1 mb-2">
          <Skeleton className="w-[100px] md:w-[200px] h-4 mr-auto" />
          <Skeleton className="w-[120px] md:w-[320px] h-3 mr-auto" />
          <Skeleton className="md:hidden w-[120px] md:w-[320px] h-3 mr-auto" />
        </div>
        <div className="flex gap-2 relative">
          {[...Array(8).keys()].map((collection) => {
            return (
              <div key={collection}>
                <Skeleton className="mt-1 w-20 h-6 !rounded-full" />
              </div>
            );
          })}
          <div className="pointer-events-none bg-gradient-white-to-transparent absolute right-0 top-0 w-40 h-full"></div>
        </div>
      </div>
    </div>
  );
};
