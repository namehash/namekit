import Skeleton from "../skeleton";

export const CollectionsGridSkeleton = () => {
  return (
    <div className="w-full flex flex-col xl:flex-row max-w-7xl xl:space-x-0">
      <div className="w-full flex flex-col space-y-2.5 items-start">
        <div className="mt-2 md:mt-0 flex flex-col md:flex-row justify-between w-full mb-2">
          <div className="flex">
            <div className="flex mr-2.5">
              <Skeleton className="h-7 w-[200px]" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-7 w-9" />
              <Skeleton className="h-7 w-9" />
            </div>
          </div>
          <div className="mt-3 md:mt-0 xl:mr-[68px]">
            <Skeleton className="w-[180px] h-9" />
          </div>
        </div>
        <div className="flex flex-col space-y-7">
          <CollectionsCardsSkeleton />
        </div>
      </div>
      <div className="relative z-50 xl:max-w-[400px] mt-10 xl:mt-0 border rounded-md border-gray-200 w-full h-fit">
        <div className="px-5 py-[13px] border border-gray-200 border-r-0 border-l-0 border-t-0">
          <Skeleton className="w-[80px] h-5" />
        </div>
        <div className="px-5 overflow-hidden pb-[10px]">
          <CollectionsCardsSkeleton />
        </div>
        <div className="bg-gradient-white-to-transparent absolute right-0 top-[47px] w-20 h-full"></div>
      </div>
    </div>
  );
};

const NUMBER_OF_SKELETONS_OF_COLLECTION_CARDS = 5;

export const CollectionsCardsSkeleton = ({
  className = "flex flex-col space-y-2.5",
}) => {
  return (
    <div className={className}>
      {[...Array(NUMBER_OF_SKELETONS_OF_COLLECTION_CARDS).keys()].map(
        (collection) => {
          return (
            <div key={collection}>
              <CollectionCardSkeleton />
            </div>
          );
        },
      )}
    </div>
  );
};

const CollectionCardSkeleton = () => {
  return (
    <div className="flex h-[86px] py-3">
      <div>
        <Skeleton className="w-[73px] h-[73px]" />
      </div>
      <div className="w-full flex flex-col justify-start space-y-2 ml-[18px] items-start">
        <Skeleton className="w-[100px] md:w-[200px] h-4 mr-auto" />
        <Skeleton className="w-[180px] md:w-[320px] h-3 mr-auto" />
        <div className="flex gap-2 relative">
          {[...Array(8).keys()].map((collection) => {
            return (
              <div key={collection}>
                <Skeleton className="mt-1 w-20 h-6 !rounded-full" />
              </div>
            );
          })}
          <div className="bg-gradient-white-to-transparent absolute right-0 top-0 w-40 h-full"></div>
        </div>
      </div>
    </div>
  );
};
