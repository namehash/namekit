import { CollectionCard } from "@/components/collections/collection-card";
import { CollectionsCardsSkeleton } from "@/components/collections/collections-grid-skeleton";
import {
  NameRelatedCollectionsTabs,
  CollectionsData,
  TabNavigationState,
} from "../collections/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Skeleton from "@/components/skeleton";

interface CollectionsTabContentProps {
  tab: NameRelatedCollectionsTabs;
  loading: boolean;
  collections:
    | Record<number, CollectionsData | null | undefined>
    | undefined
    | null;
  navigation: TabNavigationState;
  textLabel: string;
  currentPage: number;
  onPageChange: (page: number, tab: NameRelatedCollectionsTabs) => void;
}

export const CollectionsTabContent = ({
  tab,
  loading,
  collections,
  navigation,
  textLabel,
  currentPage,
  onPageChange,
}: CollectionsTabContentProps) => {
  if (!collections) {
    return (
      <p className="mt-8 text-sm ml-2">
        No related collections were found for this name
      </p>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col xl:flex-row space-y-8 xl:space-x-8 xl:space-y-0">
        <div className="w-full">
          <div className="w-full mb-8">
            <div className="w-full flex flex-col space-y-4 p-3 rounded-xl border border-gray-200">
              <div className="w-full flex flex-col justify-start">
                <div className="h-full">
                  {/* Collection Count and Sort */}
                  <div className="max-w-[756px] w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-5">
                    <div className="flex items-center">
                      <div className="text-lg font-semibold mr-2.5">
                        {textLabel}
                      </div>
                      {navigation.totalItems > 0 && (
                        <div className="flex">
                          <Button
                            className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
                            disabled={navigation.isFirstPage}
                            onClick={() => onPageChange(currentPage - 1, tab)}
                          >
                            <ChevronLeft className="w-6 h-6 text-black" />
                          </Button>
                          <Button
                            className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                            disabled={navigation.isLastPage}
                            onClick={() => onPageChange(currentPage + 1, tab)}
                          >
                            <ChevronRight className="w-6 h-6 text-black" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Collections List */}
                  <div className="w-full h-full max-w-[756px] space-y-4">
                    {loading ? (
                      <div className="w-full flex flex-col justify-center items-center">
                        <div className="w-full flex flex-col space-y-4 rounded-xl">
                          <Skeleton className="w-[350px] my-2 h-6 mr-auto" />
                          <CollectionsCardsSkeleton className="flex flex-col space-y-[30px]" />
                          <CollectionsCardsSkeleton />
                        </div>
                      </div>
                    ) : collections && collections[currentPage] ? (
                      collections[currentPage].related_collections.map(
                        (collection) => (
                          <CollectionCard
                            key={collection.collection_id}
                            collection={collection}
                          />
                        ),
                      )
                    ) : (
                      <p className="mt-8 text-sm ml-2">
                        No collections found for the current page
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  {/* Pagination */}
                  {navigation.totalItems > 0 && (
                    <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 p-3">
                      <div className="text-sm text-gray-500 mr-2.5">
                        {textLabel}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                          disabled={navigation.isFirstPage}
                          onClick={() => onPageChange(currentPage - 1, tab)}
                        >
                          <ChevronLeft />
                          Prev
                        </Button>
                        <Button
                          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                          disabled={navigation.isLastPage}
                          onClick={() => onPageChange(currentPage + 1, tab)}
                        >
                          Next
                          <ChevronRight />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
