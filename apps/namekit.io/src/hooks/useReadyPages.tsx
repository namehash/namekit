/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useReadyPages = () => {
  const router = useRouter();

  useEffect(() => {
    const WatchlistPage = "/watchlist";
    const NftDetailsPage = "/name";
    const AccountPage = "/0x";

    const pagesThatShouldntBeAccessibleForLaunch = [
      NftDetailsPage,
      WatchlistPage,
      AccountPage,
    ];

    let userIsVisitingUnaccessiblePage = false;
    pagesThatShouldntBeAccessibleForLaunch.forEach((unaccessiblePageRoute) => {
      if (router.pathname.includes(unaccessiblePageRoute)) {
        userIsVisitingUnaccessiblePage = true;
      }
    });

    if (userIsVisitingUnaccessiblePage) {
      router.push("/");
    }
  }, [router.pathname]);
};
