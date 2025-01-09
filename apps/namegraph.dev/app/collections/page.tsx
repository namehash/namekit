"use client";

import {
  NameGraphCollection,
  NameGraphFindCollectionsResponse,
} from "@namehash/namegraph-sdk/utils";
import { findCollectionsByString, getRandomColor } from "@/lib/utils";
import { DebounceInput } from "react-debounce-input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

interface PaginationState {
  currentPage: number;
  totalItems?: number;
}

export default function ExploreCollectionsPage() {
  /**
   * findCollectionsRes state:
   *
   * undefined is set when component never tried querying collections
   * null is set when component tried querying collections but failed
   * NameGraphFindCollectionsResponse is set when collections were successfully queried
   */
  const [findCollectionsRes, setFindCollectionsRes] = useState<
    undefined | null | NameGraphFindCollectionsResponse
  >(undefined);

  useEffect(() => {
    if (findCollectionsRes) {
      setPagination({
        ...pagination,
        totalItems:
          typeof findCollectionsRes.metadata
            .total_number_of_matched_collections === "number"
            ? findCollectionsRes.metadata.total_number_of_matched_collections
            : 1000,
      });

      let groupedCollections: NameGraphCollection[] = [];

      const otherCollections = findCollectionsRes.other_collections;
      const relatedCollections = findCollectionsRes.related_collections;

      /**
       * Unites "other" and "related" collections, from NameGraph SDK
       */
      groupedCollections = [...otherCollections, ...relatedCollections];
      console.log(findCollectionsRes, groupedCollections);
      setCollections(groupedCollections);
      setLoadingCollections(false);
    } else {
      setCollections(undefined);
    }
  }, [findCollectionsRes]);

  /**
   * collections state:
   *
   * undefined is set when component never tried querying collections
   * null is set when no collections was retrieved from NameGraph SDK for debouncedValue
   * NameGraphCollection[] is set when collections that were retrieved were grouped and state was set
   */
  const [collections, setCollections] = useState<
    undefined | null | NameGraphCollection[]
  >(undefined);

  const [loadingCollections, setLoadingCollections] = useState(true);

  const [debouncedValue, setDebouncedValue] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalItems: undefined,
  });

  useEffect(() => {
    goToNewPage();
  }, [debouncedValue, pagination.currentPage]);

  const goToNewPage = () => {
    if (debouncedValue) {
      let query = debouncedValue;
      if (debouncedValue.includes(".")) {
        query = debouncedValue.split(".")[0];
      }

      const offset = pagination.currentPage - 1;

      setFindCollectionsRes(undefined);
      setLoadingCollections(true);
      findCollectionsByString(query, { offset })
        .then((res) => setFindCollectionsRes(res))
        .catch(() => setFindCollectionsRes(null));
    } else {
      setPagination({
        currentPage: 1,
        totalItems: undefined,
      });
      setCollections(null);
      setLoadingCollections(false);
    }
  };

  return (
    <div className="mx-auto py-8 w-full">
      <div className="max-w-5xl mx-auto p-6">
        <div>
          <h1 className="text-sm text-gray-500">
            Collection search results for
          </h1>
          <h2 className="text-3xl font-bold mb-5 leading-9 truncate">
            {debouncedValue ? debouncedValue : "______"}
          </h2>

          {/* Search Bar */}
          <div className="relative mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <DebounceInput
              id="query"
              type="text"
              name="query"
              placeholder="Type something"
              autoComplete="off"
              value={debouncedValue}
              debounceTimeout={300}
              onChange={(e) => setDebouncedValue(e.target.value)}
              className="focus:outline-none w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-4 pl-9"
            />
            {debouncedValue && (
              <Button
                onClick={() => setDebouncedValue("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-transparent text-black shadow-none p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {debouncedValue && pagination.totalItems && (
            <>
              {/* Collection Count and Sort */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-2.5">
                    {pagination.totalItems
                      ? `${(pagination.currentPage - 1) * 10 + 1}-${Math.min(
                          pagination.currentPage * 10,
                          pagination.totalItems,
                        )} of ${pagination.totalItems} collections`
                      : "No collections found"}
                  </div>
                  <div className="flex">
                    <Button
                      className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
                      disabled={pagination.currentPage === 1}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage - 1,
                        }))
                      }
                    >
                      <ChevronLeft className="w-6 h-6 text-black" />
                    </Button>
                    <Button
                      className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                      disabled={
                        pagination.currentPage !== 1 &&
                        pagination.currentPage * 10 > pagination.totalItems
                      }
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: prev.currentPage + 1,
                        }))
                      }
                    >
                      <ChevronRight className="w-6 h-6 text-black" />
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-3 items-center">
                  <div className="text-sm text-gray-500">Sort by</div>
                  <Select defaultValue="ai">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI Match</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Collections List */}
              <div className="space-y-4">
                {collections?.map((collection) => (
                  <div
                    key={collection.collection_id}
                    className="border border-l-0 border-r-0 border-b-0 pt-3 border-gray-200 w-18 h-18 flex items-start gap-[18px]"
                  >
                    <div
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                      }}
                      className="flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100"
                    >
                      <div className="relative flex items-center justify-center overflow-hidden">
                        <p className="text-3xl">{collection.avatar_emoji}</p>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-sm font-semibold">
                        {collection.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        by {collection.owner}
                      </p>
                      <div className="relative">
                        <div className="flex gap-2">
                          {collection.top_names.map((tag) => (
                            <span
                              key={tag.namehash}
                              className="bg-gray-100 text-sm px-2 py-1 bg-muted rounded-full"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                        <div className="bg-gradient-white-to-transparent absolute right-0 top-0 w-40 h-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 pt-3">
                <div className="text-sm text-gray-500 mr-2.5">
                  {pagination.totalItems
                    ? `${(pagination.currentPage - 1) * 10 + 1}-${Math.min(
                        pagination.currentPage * 10,
                        pagination.totalItems,
                      )} of ${pagination.totalItems} collections`
                    : "No collections found"}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                    disabled={pagination.currentPage === 1}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage - 1,
                      }))
                    }
                  >
                    <ChevronLeft />
                    Prev
                  </Button>
                  <Button
                    className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                    disabled={
                      pagination.currentPage !== 1 &&
                      pagination.currentPage * 10 > pagination.totalItems
                    }
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage + 1,
                      }))
                    }
                  >
                    Next
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
