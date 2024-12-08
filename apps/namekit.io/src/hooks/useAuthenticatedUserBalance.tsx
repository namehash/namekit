/* eslint-disable react-hooks/exhaustive-deps */
import { useCountdown } from "./useCountdown";
import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { trpc } from "../trpc-utils/trpc-hooks";
import { type Price } from "@namehash/ens-utils";
import { useEffect, useState } from "react";

interface AuthenticatedUserBalanceHook {
  triggerBalanceUpdate: () => void;
  balanceInEth: Price | null;
  balanceInUsd: Price | null;
  isLoadingBalance: boolean;
}

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

export const useAuthenticatedUserBalance = (): AuthenticatedUserBalanceHook => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const [balanceInUsd, setBalanceInUsd] = useState<Price | null>(null);
  const [balanceInEth, setBalanceInEth] = useState<Price | null>(null);
  const { countDown, reset } = useCountdown(FIVE_MINUTES_IN_MS);

  const {
    data: { balance: walletBalance } = {},
    isLoading: loadingWalletBalance,
    refetch: refetchWalletBalance,
  } = trpc.walletBalance.get.useQuery(undefined, {
    enabled: !!authenticatedUserAddress, // Only fetch if user is authenticated
  });

  useEffect(() => {
    if (authenticatedUserAddress) {
      if (walletBalance) {
        setBalanceInUsd(walletBalance.usd);
        setBalanceInEth(walletBalance.eth);
      } else {
        refetchWalletBalance();
      }
    } else {
      setBalanceInUsd(null);
      setBalanceInEth(null);
    }
  }, [authenticatedUserAddress, walletBalance]);

  /*
    Update wallet balance every 5 minutes
  */
  useEffect(() => {
    if (countDown === 0) {
      refetchWalletBalance();
      reset();
    }
  }, [countDown]);

  /*
    Trigger wallet balance update
  */
  const triggerBalanceUpdate = async () => {
    await refetchWalletBalance();
    reset();
  };

  return {
    isLoadingBalance: !!authenticatedUserAddress && loadingWalletBalance,
    triggerBalanceUpdate,
    balanceInEth,
    balanceInUsd,
  };
};
