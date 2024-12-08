/* eslint-disable react-hooks/exhaustive-deps */
import { trpc } from "../trpc-utils/trpc-hooks";
import { UserRole, type UserRoleType } from "../lib/shared/constants";
import { ADDRESS_ZERO } from "../lib/shared/address";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

interface AuthenticatedUserHook {
  isAdmin: boolean;
  loadingPrimaryName: boolean;
  role: UserRoleType | undefined;
  loadingAuthenticatedUser: boolean;
  authenticatedUserPrimaryName: string | null;
  authenticatedUserAddress: `0x${string}` | null;
  disconnectUser: () => void;
}

export const useAuthenticatedUser = (): AuthenticatedUserHook => {
  const { disconnect } = useDisconnect();
  const { data: nextAuthUser } = useSession();
  const { address, isConnected } = useAccount();
  const [authenticatedAccountAddress, setAuthenticatedAccountAddress] =
    useState<`0x${string}` | null>(null);
  const [loadingAuthenticatedUser, setLoadingAuthenticatedUser] =
    useState(true);

  /*
    We always need to make sure not only the information
    that user is connected but ALSO that user has signed-in.
    Anyone can fake connecting their wallet as a wallet that isn't
    theirs but no one can fake signing in with a wallet that isn't theirs.

    'nextAuthUser' provides the information that user has signed-in.
    'isConnected' provides the information that user has connected his/her wallet.
  */

  useEffect(() => {
    const accountAuthenticated =
      isConnected &&
      !!nextAuthUser &&
      nextAuthUser.user.id == address?.toLowerCase();

    setAuthenticatedAccountAddress(
      accountAuthenticated && address ? address : null,
    );
    setLoadingAuthenticatedUser(false);
  }, [nextAuthUser, isConnected, address]);

  const disconnectUser = () => {
    signOut({ redirect: false }).then(() => {
      if (authenticatedAccountAddress) {
        disconnect();
      }
    });
  };

  useEffect(() => {
    window.addEventListener("load", () => {
      if (window.ethereum) {
        window.ethereum.on("disconnect", disconnectUser);
      }
    });
  }, []);

  const { data: { primaryName } = {}, isLoading: loadingPrimaryName } =
    trpc.reverseLookup.get.useQuery(
      {
        /*
          Below param will always carry the value of 'authenticatedAccountAddress'
          since 'enabled' property prevents request from being sent when
          'authenticatedAccountAddress' is null.
        */
        address: authenticatedAccountAddress ?? ADDRESS_ZERO,
      },
      {
        enabled: !!authenticatedAccountAddress,
      },
    );

  return {
    loadingPrimaryName,
    loadingAuthenticatedUser,
    authenticatedUserPrimaryName: primaryName || null,
    authenticatedUserAddress: authenticatedAccountAddress,
    role: authenticatedAccountAddress
      ? (nextAuthUser?.user?.role as UserRoleType)
      : undefined,
    isAdmin:
      !!authenticatedAccountAddress &&
      nextAuthUser?.user?.role === UserRole.Admin,
    disconnectUser,
  };
};
