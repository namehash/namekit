/* eslint-disable react-hooks/exhaustive-deps */
import { useScreenSize } from "./useScreenSize";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import {
  useAppDispatch,
  useAppSelector,
} from "../components/features/instant-search/store";
import {
  type InstantSearchData,
  instantSearchInitialState,
} from "../components/features/instant-search/store/exactMatchPanel/reducers";
import { RegisterDomainContext } from "../components/01-atoms";
import {
  openRecursiveRelatedCollection,
  resetInstantSearchData,
  setDomainCard,
  setDomainCardError,
  setDomainCardLoading,
  setErrorInAIQuery,
  setIsRunningAIAction,
  setNameIdeas,
  setNameIdeasError,
  setNameIdeasLoading,
  setNewNameIdeasForCollection,
  updateQuickJumpCollectionPillsTopmostPosition,
} from "../components/features/instant-search/store/exactMatchPanel/actions";
import { NAME_GENERATOR_INSTANT_SEARCH_MODE } from "../lib/shared/utils";
import { checkNetworkError } from "../lib/shared/check-error";
import {
  DEFAULT_TIMEOUT_MS_ON_QUERY_RETRY,
  getCategoryID,
  scrollToNameIdeasCategory,
} from "../components/helpers/utils";
import { AIActionType } from "../components/03-organisms";
import { trpc } from "../trpc-utils/trpc-hooks";
import {
  type NKNameSuggestion,
  NKNameSuggestionType,
  type NKRecursiveRelatedCollection,
  type NKRelatedSuggestionCategory,
  type NKSuggestionCategory,
  PrimaryRegistrationStatus,
} from "../lib/shared/types";
import { useContext, useEffect, useState } from "react";
import { isAddressEqual } from "viem";

export const useInstantSearch = (): {
  closeInstantSearch: () => void;
  instantSearchData: InstantSearchData;
  refetchDomainCard: () => void;
  refetchNameIdeas: (query: string) => void;
  scrambleNameIdeasForCollectionID: (
    collectionID: string,
    isTryAgain?: boolean,
  ) => any;
  ideateNameIdeasForCollectionID: (
    collectionID: string,
    isTryAgain?: boolean,
  ) => any;
  addCollectionID: (
    collection: NKRecursiveRelatedCollection,
    parentCollectionID: string,
  ) => any;
  nameDoesntExist: boolean;
  domainForSale: boolean;
  invalidName: boolean;
  nameFound: boolean;
} => {
  const instantSearchOpen = useAppSelector((state) => state.instantSearchOpen);
  const activeISview = useAppSelector((state) => state.activeISview);
  const displayedNameLinesOfContent = useAppSelector(
    (state) => state.displayedNameLinesOfContent,
  );
  const domainCard = useAppSelector((state) => state.domainCard);
  const domainCardError = useAppSelector((state) => state.domainCardError);
  const domainCardLoading = useAppSelector((state) => state.domainCardLoading);
  const errorInAIQuery = useAppSelector((state) => state.errorInAIQuery);
  const filteredIdeas = useAppSelector((state) => state.filteredIdeas);
  const justResetData = useAppSelector((state) => state.justResetData);
  const nameIdeas = useAppSelector((state) => state.nameIdeas);
  const nameIdeasError = useAppSelector((state) => state.nameIdeasError);
  const nameIdeasLoading = useAppSelector((state) => state.nameIdeasLoading);
  const nameIdeasNumber = useAppSelector((state) => state.nameIdeasNumber);
  const parseNameError = useAppSelector((state) => state.parseNameError);
  const parsedName = useAppSelector((state) => state.parsedName);
  const quickJumpBarIsAtTheTopmost = useAppSelector(
    (state) => state.quickJumpBarIsAtTheTopmost,
  );
  const runningAIQuery = useAppSelector((state) => state.runningAIQuery);
  const userSearch = useAppSelector((state) => state.userSearch);
  const dispatch = useAppDispatch();

  // Domain Card fetching
  const { refetch: refetchDomainCardQuery } = trpc.domainCard.get.useQuery(
    {
      slug: parsedName?.slug || "",
    },
    {
      enabled: false,
      onSettled: (data, error) => {
        if (data?.domainCard) {
          dispatch(setDomainCard(data?.domainCard));
        } else if (error) {
          dispatch(setDomainCardError(error));
        } else if (data?.domainCard === null) {
          setInvalidName(true);
        }

        dispatch(setDomainCardLoading(false));
      },
    },
  );

  const refetchDomainCard = () => {
    setNameFound(false);
    setInvalidName(false);
    setDomainForSale(false);
    setNameDoesntExist(false);

    dispatch(setDomainCardError(null));

    dispatch(setDomainCardLoading(true));
  };

  useEffect(() => {
    if (domainCardLoading) {
      // The timeout exists so we execute this method after DOM is updated
      setTimeout(() => {
        refetchDomainCardQuery({ throwOnError: true });
      }, 1000);
    }
  }, [domainCardLoading]);

  // Name Ideas fetching
  const [nameIdeasQuery, setNameIdeasQuery] = useState<string>("");

  const { refetch: refetchNameIdeasQuery } = trpc.generateNames.get.useQuery(
    {
      label: nameIdeasQuery,
      mode: NAME_GENERATOR_INSTANT_SEARCH_MODE,
    },
    {
      enabled: false,
      onSettled: (data, error) => {
        if (data?.nameIdeas) {
          dispatch(setNameIdeas(data?.nameIdeas));
        } else {
          dispatch(setNameIdeas(null));
        }

        if (error) {
          dispatch(setNameIdeasError(error));
        }

        dispatch(setNameIdeasLoading(false));
      },
    },
  );

  useEffect(() => {
    if (nameIdeasQuery) {
      // The timeout exists so we execute this method after DOM is updated
      setTimeout(async () => {
        const nameIdeasQuery = await refetchNameIdeasQuery({
          throwOnError: true,
        });
        return nameIdeasQuery;
      }, DEFAULT_TIMEOUT_MS_ON_QUERY_RETRY);
    }
  }, [nameIdeasQuery]);

  const refetchNameIdeas = async (query: string) => {
    if (query.trim() === nameIdeasQuery.trim()) return;

    dispatch(setNameIdeasError(null));

    dispatch(setNameIdeasLoading(true));

    setNameIdeasQuery(query);
  };

  // Name Ideas Category Scramble
  const [scrambleForCollectionID, setScrambleForCollectionID] = useState<
    string | null
  >(null);

  const { refetch: scrambleNameIdeas } =
    trpc.generateNames.scrambleNames.useQuery(
      {
        /*
        This query is disabled by default and is triggered
        when scrambleForCollectionID is set. This state is
        only set by SuggestionCategoryHeader component
      */
        collection_id: scrambleForCollectionID || "",
      },
      {
        enabled: false,
        onSettled: (data, error) => {
          if (data) {
            addScrambledNameIdeas(data.nameIdeas);

            if (runningAIQuery.isRetryingQuery && scrambleForCollectionID) {
              dispatch(
                setErrorInAIQuery({
                  collectionID: scrambleForCollectionID,
                  AIAction: null,
                  error: null,
                }),
              );
            }
          } else if (error) {
            const reqError = checkNetworkError({
              error,
            });

            if (scrambleForCollectionID) {
              dispatch(
                setErrorInAIQuery({
                  collectionID: scrambleForCollectionID,
                  error: reqError,
                  AIAction: AIActionType.Scramble,
                }),
              );
            }
          }

          setScrambleForCollectionID(null);
          dispatch(
            setIsRunningAIAction({
              isRetryingQuery: false,
              collectionID: "",
              AIAction: null,
            }),
          );
        },
      },
    );

  const addScrambledNameIdeas = (scrambledNameIdeas: NKNameSuggestion[]) => {
    if (nameIdeas && scrambleForCollectionID && scrambledNameIdeas) {
      dispatch(
        setNewNameIdeasForCollection(
          scrambleForCollectionID,
          scrambledNameIdeas,
        ),
      );
    }
  };

  useEffect(() => {
    if (scrambleForCollectionID) {
      scrambleNameIdeas({ throwOnError: true });
    }
  }, [scrambleForCollectionID]);

  const scrambleNameIdeasForCollectionID = (
    collectionID: string,
    isTryAgain = false,
  ) => {
    dispatch(
      setIsRunningAIAction({
        collectionID: collectionID,
        isRetryingQuery: isTryAgain,
        AIAction: AIActionType.Scramble,
      }),
    );

    if (isTryAgain) {
      setTimeout(() => {
        setScrambleForCollectionID(collectionID);
      }, DEFAULT_TIMEOUT_MS_ON_QUERY_RETRY);
    } else {
      setScrambleForCollectionID(collectionID);
    }
  };

  // Name Ideas Category Ideate
  const [ideateForCollectionID, setIdeateForCollectionID] = useState<
    string | null
  >(null);

  const { refetch: ideateNameIdeas } = trpc.generateNames.sampleNames.useQuery(
    {
      /*
        This query is disabled by default and is triggered
        when ideateForCollectionID is set. This state is
        only set by SuggestionCategoryHeader component
      */
      collection_id: ideateForCollectionID || "",
      mode: NAME_GENERATOR_INSTANT_SEARCH_MODE,
    },
    {
      enabled: false,
      onSettled: (data, error) => {
        if (data) {
          addIdeatedNameIdeas(data.nameIdeas);

          if (runningAIQuery.isRetryingQuery && ideateForCollectionID) {
            dispatch(
              setErrorInAIQuery({
                collectionID: ideateForCollectionID,
                AIAction: null,
                error: null,
              }),
            );
          }
        } else if (error) {
          const reqError = checkNetworkError({
            error,
          });

          if (ideateForCollectionID) {
            dispatch(
              setErrorInAIQuery({
                error: reqError,
                AIAction: AIActionType.Ideate,
                collectionID: ideateForCollectionID,
              }),
            );
          }
        }

        setIdeateForCollectionID(null);
        dispatch(
          setIsRunningAIAction({
            isRetryingQuery: false,
            collectionID: "",
            AIAction: null,
          }),
        );
      },
    },
  );

  useEffect(() => {
    if (ideateForCollectionID) {
      ideateNameIdeas({ throwOnError: true });
    }
  }, [ideateForCollectionID]);

  const addIdeatedNameIdeas = (nameIdeas: NKNameSuggestion[]) => {
    if (nameIdeas && ideateForCollectionID) {
      dispatch(setNewNameIdeasForCollection(ideateForCollectionID, nameIdeas));
    }
  };

  const ideateNameIdeasForCollectionID = (
    collectionID: string,
    isTryAgain = false,
  ) => {
    dispatch(
      setIsRunningAIAction({
        collectionID: collectionID,
        isRetryingQuery: isTryAgain,
        AIAction: AIActionType.Ideate,
      }),
    );

    if (isTryAgain) {
      setTimeout(() => {
        setIdeateForCollectionID(collectionID);
      }, DEFAULT_TIMEOUT_MS_ON_QUERY_RETRY);
    } else {
      setIdeateForCollectionID(collectionID);
    }
  };

  // Name Ideas Collection Pill click
  const [openRelatedCollection, setOpenRelatedCollection] =
    useState<NKRecursiveRelatedCollection | null>(null);

  const { refetch: addNewRelatedCollection } =
    trpc.generateNames.openRelatedCollection.useQuery(
      {
        /*
          This query is disabled by default and is triggered
          when openRelatedCollection is set. This state is
          only set by RecursiveRelatedCollectionPill click.
        */
        collection_id: openRelatedCollection?.collection_id || "",
      },
      {
        enabled: false,
      },
    );

  const { isDesktop } = useScreenSize();

  useEffect(() => {
    if (openRelatedCollection) {
      dispatch(updateQuickJumpCollectionPillsTopmostPosition(true));

      const categoryToScrollTo = document.getElementById(
        getCategoryID({
          ...openRelatedCollection,
          suggestions: [],
        }),
      );

      if (categoryToScrollTo) {
        scrollToNameIdeasCategory(openRelatedCollection, isDesktop);
      }

      addNewRelatedCollection({ throwOnError: true })
        .then((data) => {
          if (data.data?.nameIdeas) addRelatedCollection(data.data?.nameIdeas);
        })
        .catch((error) => {
          // TODO: Remove this when we have a proper error handling
          if (error && String(error).includes("redux")) return;

          const reqError = checkNetworkError({
            error,
          });

          if (openRelatedCollection) {
            dispatch(
              setErrorInAIQuery({
                collectionID: openRelatedCollection.collection_id,
                AIAction: AIActionType.AddRecursiveRelatedCollection,
                error: reqError,
              }),
            );
          }
        })
        .finally(() => {
          setOpenRelatedCollection(null);
          dispatch(
            setIsRunningAIAction({
              isRetryingQuery: false,
              collectionID: "",
              AIAction: null,
            }),
          );
        });
    }
  }, [openRelatedCollection]);

  const addRelatedCollection = (newRelatedCollection: NKSuggestionCategory) => {
    if (nameIdeas && newRelatedCollection) {
      /*
        Add new related collection to name suggestions categories list.
      */
      const idxToUpdate = nameIdeas.categories.findIndex((category) => {
        if (category.type === NKNameSuggestionType.related) {
          return (
            (category as NKRelatedSuggestionCategory).collection_id ===
            openRelatedCollection?.collection_id
          );
        }
      });

      const suggestions = { ...nameIdeas };
      suggestions.categories[idxToUpdate] = newRelatedCollection;

      dispatch(setNameIdeas(suggestions));

      dispatch(
        setIsRunningAIAction({
          isRetryingQuery: false,
          collectionID: "",
          AIAction: null,
        }),
      );
    }
  };

  const addCollectionID = async (
    collection: NKRecursiveRelatedCollection,
    parentCollectionID: string,
  ) => {
    dispatch(openRecursiveRelatedCollection(collection, parentCollectionID));
    setOpenRelatedCollection(collection);
  };

  // ENS Domain states
  const [domainForSale, setDomainForSale] = useState(false);
  const [nameDoesntExist, setNameDoesntExist] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [nameFound, setNameFound] = useState(false);

  const { authenticatedUserAddress } = useAuthenticatedUser();

  // Domain FOR SALE state setter
  useEffect(() => {
    if (domainCard) {
      const isForSale =
        domainCard.registration?.primaryStatus ===
          PrimaryRegistrationStatus.Active &&
        !!domainCard?.ownerAddress &&
        domainCard &&
        domainCard.topListing !== null &&
        (!domainCard.ownerAddress ||
          !authenticatedUserAddress ||
          !isAddressEqual(domainCard.ownerAddress, authenticatedUserAddress));

      setDomainForSale(isForSale);
    }
  }, [domainCard, authenticatedUserAddress]);

  // Name DOESNT EXIST state setter
  useEffect(() => {
    const doesntExist =
      !parsedName?.normalizedName && domainCard === null && !domainCardLoading;

    setNameDoesntExist(doesntExist);
  }, [domainCard, parsedName, domainCardLoading]);

  // NAME FOUND state setter
  useEffect(() => {
    const nameFound =
      !!parsedName &&
      !parsedName?.normalizedName &&
      !!domainCard?.parsedName.normalizedName;

    setNameFound(nameFound);
  }, [domainCard, parsedName]);

  const { updateRegistrationContext } = useContext(RegisterDomainContext);

  const closeInstantSearch = () => {
    updateRegistrationContext({ domainName: null });
    dispatch(resetInstantSearchData(true));
  };

  return {
    instantSearchData:
      {
        instantSearchOpen,
        activeISview,
        displayedNameLinesOfContent,
        domainCard,
        domainCardError,
        domainCardLoading,
        errorInAIQuery,
        filteredIdeas,
        justResetData,
        nameIdeas,
        nameIdeasError,
        nameIdeasLoading,
        nameIdeasNumber,
        parseNameError,
        parsedName,
        quickJumpBarIsAtTheTopmost,
        runningAIQuery,
        userSearch,
      } || instantSearchInitialState,
    refetchDomainCard,
    refetchNameIdeas,
    scrambleNameIdeasForCollectionID,
    ideateNameIdeasForCollectionID,
    addCollectionID,
    nameDoesntExist,
    domainForSale,
    invalidName,
    nameFound,
    closeInstantSearch,
  };
};
