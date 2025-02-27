import { useState, useCallback } from "react";
import {
  CollectionsState,
  CollectionsData,
  NameRelatedCollectionsTabs,
  UseCollectionsProps,
} from "../../components/collections/utils";
import { NameGraphSortOrderOptions } from "@namehash/namegraph-sdk/utils";
import { findCollectionsByMember, findCollectionsByString } from "@/lib/utils";

export const useCollections = ({
  label,
  navigationConfig,
  onUpdateTotalItems,
}: UseCollectionsProps) => {
  const [state, setState] = useState<CollectionsState>({
    collections: {
      [NameRelatedCollectionsTabs.ByConcept]: undefined,
      [NameRelatedCollectionsTabs.ByMembership]: undefined,
    },
    loading: {
      [NameRelatedCollectionsTabs.ByConcept]: false,
      [NameRelatedCollectionsTabs.ByMembership]: false,
    },
  });

  const setCollections = useCallback(
    (
      tab: NameRelatedCollectionsTabs,
      page: number,
      data: CollectionsData | null,
    ) => {
      setState((prev: any) => {
        const updatedCollections = {
          ...prev.collections,
          [tab]: {
            ...(prev.collections[tab] || {}),
            [page]: data,
          },
        };

        return {
          ...prev,
          collections: updatedCollections,
        };
      });
    },
    [],
  );

  const setLoading = useCallback(
    (tab: NameRelatedCollectionsTabs, loading: boolean) => {
      setState((prev: any) => ({
        ...prev,
        loading: {
          ...prev.loading,
          [tab]: loading,
        },
      }));
    },
    [],
  );

  const fetchCollections = useCallback(
    async (
      tab: NameRelatedCollectionsTabs,
      page: number,
      sortOrder: NameGraphSortOrderOptions,
    ) => {
      /* Set loading state immediately */
      setLoading(tab, true);

      try {
        const query = label;
        const MAX_COLLECTIONS_FOR_EXACT_MATCH = 10;
        const MAX_RELATED_COLLECTIONS = 20;
        const OTHER_COLLECTIONS_NUMBER = 5;
        const offset = (page - 1) * navigationConfig.itemsPerPage;

        if (tab === NameRelatedCollectionsTabs.ByMembership) {
          const response = await findCollectionsByMember(query, {
            offset,
            sort_order: sortOrder,
            limit_labels: MAX_COLLECTIONS_FOR_EXACT_MATCH,
            max_results: MAX_RELATED_COLLECTIONS,
          });

          if (response) {
            const MAX_COLLECTIONS_NUMBER = 1000;
            const totalMatched =
              typeof response.metadata.total_number_of_matched_collections ===
              "number"
                ? response.metadata.total_number_of_matched_collections
                : MAX_COLLECTIONS_NUMBER;

            /* Update total items first */
            onUpdateTotalItems(tab, totalMatched);

            /* Then update collections */
            if (response.collections && response.collections.length > 0) {
              setCollections(tab, page, {
                sort_order: sortOrder,
                related_collections: response.collections,
              });
            } else {
              setCollections(tab, page, null);
            }
          } else {
            setCollections(tab, page, null);
          }
        } else {
          const response = await findCollectionsByString(query, {
            offset,
            sort_order: sortOrder,
            max_total_collections:
              MAX_RELATED_COLLECTIONS + OTHER_COLLECTIONS_NUMBER,
            max_related_collections: MAX_RELATED_COLLECTIONS,
            max_other_collections: OTHER_COLLECTIONS_NUMBER,
            min_other_collections: OTHER_COLLECTIONS_NUMBER,
          });

          if (response) {
            const MAX_COLLECTIONS_NUMBER = 1000;
            const totalMatched =
              typeof response.metadata.total_number_of_matched_collections ===
              "number"
                ? response.metadata.total_number_of_matched_collections
                : MAX_COLLECTIONS_NUMBER;

            onUpdateTotalItems(tab, totalMatched);

            if (
              response.related_collections &&
              response.related_collections.length > 0
            ) {
              setCollections(tab, page, {
                sort_order: sortOrder,
                related_collections: response.related_collections,
              });
            } else {
              setCollections(tab, page, null);
            }
          } else {
            setCollections(tab, page, null);
          }
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        setCollections(tab, page, null);
      } finally {
        setLoading(tab, false);
      }
    },
    [
      label,
      navigationConfig.itemsPerPage,
      onUpdateTotalItems,
      setCollections,
      setLoading,
    ],
  );

  return {
    collections: state.collections,
    loading: state.loading,
    fetchCollections,
  };
};
