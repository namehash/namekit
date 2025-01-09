"use client";

import { fetchCollectionMembers } from "@/lib/utils";
import { NameGraphFetchTopCollectionMembersResponse } from "@namehash/namegraph-sdk/utils";
import { useEffect, useState } from "react";

export const ExploreCollectionPage = ({ id }: { id: string }) => {
  const [loadingCollectionMembers, setLoadingCollectionMembers] =
    useState(true);

  /**
   * undefined: when query was never done
   * null: when query was done but resulted in error
   * NameGraphFetchTopCollectionMembersResponse: when query was successfully done
   */
  const [collectionMembersRes, setCollectionMembersRes] = useState<
    undefined | null | NameGraphFetchTopCollectionMembersResponse
  >(undefined);

  useEffect(() => {
    if (id) {
      setLoadingCollectionMembers(true);
      fetchCollectionMembers(id)
        .then((res) => {
          console.log(res);
          setCollectionMembersRes(res);
        })
        .catch(() => {
          setCollectionMembersRes(null);
        })
        .finally(() => {
          setLoadingCollectionMembers(false);
        });
    }
  }, [id]);

  return (
    <div className="mx-auto py-8 w-full">
      <div className="max-w-7xl mx-auto p-6">
        {loadingCollectionMembers ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="flex space-x-4 mb-8">
              <div className="w-20 h-20 bg-gray-200 border-gray-300 rounded-lg"></div>
              <div>
                <div className="text-3xl font-semibold mb-4">
                  {collectionMembersRes?.collection_title}
                </div>
                <div>ID: {id}</div>
              </div>
            </div>
            <div className="flex space-x-4">
              <h3>Collection suggestions:</h3>
              <div className="flex flex-col space-y-2">
                {collectionMembersRes?.suggestions.map((suggestion) => {
                  return (
                    <div
                      key={suggestion.name}
                      className="!no-underline group border border-l-0 border-r-0 border-b-0 pt-3 border-gray-200 flex items-start gap-[18px]"
                    >
                      <div className="relative flex items-center justify-center overflow-hidden">
                        {suggestion.tokenized_label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
