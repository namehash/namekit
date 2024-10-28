import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  createClient,
  Network,
  type SecurePrimaryNameResult,
} from "@namehash/nameguard";

interface IdentityContextType {
  network: string;
  address: string;
  returnNameGuardReport: boolean;
  loadingState: "loading" | "error" | "success";
  error?: string;
  identityData?: SecurePrimaryNameResult;
  followersCount?: string;
}

const IdentityContext = createContext<IdentityContextType | null>(null);

const useIdentity = () => {
  const context = useContext(IdentityContext);

  if (!context) {
    throw new Error("useIdentity must be used within an IdentityProvider");
  }

  return context;
};

interface SubComponentProps {
  className?: string;
  children?: ReactNode;
}

interface RootProps {
  address: string;
  network?: Network;
  className?: string;
  children: ReactNode;
  returnNameGuardReport?: boolean;
}

const Root = ({
  address,
  network = "mainnet",
  className,
  children,
  returnNameGuardReport = false,
  ...props
}: RootProps) => {
  const [data, setData] = useState<IdentityContextType>({
    address,
    network,
    returnNameGuardReport,
    loadingState: "loading",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, loadingState: "loading" }));

        const nameguard = createClient({ network });

        const result = await nameguard.getSecurePrimaryName(address, {
          returnNameGuardReport,
        });

        setData((prev) => ({
          ...prev,
          loadingState: "success",
          identityData: result,
        }));
      } catch (err) {
        setData((prev) => ({
          ...prev,
          loadingState: "error",
          error:
            err instanceof Error ? err.message : "An unknown error occurred",
        }));
      }
    };

    const fetchEthFollowUserStats = async () => {
      try {
        const response = await fetch(
          `https://api.ethfollow.xyz/api/v1/users/${address}/stats`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData((prev) => ({
          ...prev,
          followersCount: result.followers_count,
        }));
      } catch (err) {
        console.error("Error fetching followers data:", err);
      }
    };

    fetchData();
    fetchEthFollowUserStats();
  }, [address, network, returnNameGuardReport]);

  return (
    <IdentityContext.Provider value={data}>
      <div className={`namekit-identity ${className}`} {...props}>
        {children}
      </div>
    </IdentityContext.Provider>
  );
};

const Avatar = ({ className, ...props }: SubComponentProps) => {
  const { identityData, loadingState, network } = useIdentity();

  if (loadingState === "loading") {
    return (
      <div
        className={`namekit-identity namekit-avatar-skeleton ${className}`}
        {...props}
      >
        <div className="nk-w-10 nk-h-10 nk-bg-gray-200 nk-rounded-full nk-animate-pulse"></div>
      </div>
    );
  }

  if (loadingState === "error" || !identityData?.display_name) {
    return (
      <div
        className={`namekit-identity namekit-avatar-error ${className}`}
        {...props}
      >
        <div className="nk-w-10 nk-h-10 nk-bg-red-200 nk-rounded-full nk-flex nk-items-center nk-justify-center">
          !
        </div>
      </div>
    );
  }

  const avatarUrl = `https://metadata.ens.domains/${network}/avatar/${identityData.display_name}`;

  return (
    <div className={`namekit-identity namekit-avatar ${className}`} {...props}>
      <img
        src={avatarUrl}
        alt={identityData.display_name}
        className="nk-w-10 nk-h-10 nk-rounded-full nk-object-cover"
        onError={(e) => {
          e.currentTarget.src = "path/to/fallback/image.png";
        }}
      />
    </div>
  );
};

const Name = ({ className, ...props }: SubComponentProps) => {
  const { identityData, loadingState, address } = useIdentity();

  if (loadingState === "loading") {
    return (
      <div className={`namekit-name-skeleton ${className}`} {...props}></div>
    );
  }

  const displayName =
    identityData?.display_name ||
    address.slice(0, 6) + "..." + address.slice(-4);

  return (
    <div className={`namekit-identity namekit-name ${className}`} {...props}>
      {displayName}
    </div>
  );
};

const Address = ({ className, ...props }: SubComponentProps) => {
  const { address } = useIdentity();

  return (
    <div className={`namekit-identity namekit-address ${className}`} {...props}>
      {address}
    </div>
  );
};

const NameGuardShield = ({ className, ...props }: SubComponentProps) => {
  const { identityData, returnNameGuardReport, loadingState } = useIdentity();

  if (
    !returnNameGuardReport ||
    loadingState !== "success" ||
    !identityData?.nameguard_report
  ) {
    return null;
  }

  return (
    <div className={`namekit-nameguard-shield ${className}`} {...props}>
      <div className="namekit-nameguard-rating">
        Rating: {identityData.nameguard_report.rating}
      </div>
      <div className="namekit-nameguard-risk-count">
        Risks: {identityData.nameguard_report.risk_count}
      </div>
    </div>
  );
};

const Followers = ({ className, ...props }: SubComponentProps) => {
  const { followersCount, loadingState } = useIdentity();

  if (loadingState === "loading") {
    return (
      <div className={`namekit-followers-skeleton ${className}`} {...props}>
        Loading followers...
      </div>
    );
  }

  if (followersCount === undefined) {
    return (
      <div className={`namekit-followers-loading ${className}`} {...props}>
        Fetching followers...
      </div>
    );
  }

  return (
    <div
      className={`namekit-identity namekit-followers ${className}`}
      {...props}
    >
      {followersCount} followers
    </div>
  );
};

const ENSLogo = () => (
  <svg
    fill="none"
    height="16"
    viewBox="0 0 202 231"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="#0080bc">
      <path d="m98.3592 2.80337-63.5239 104.52363c-.4982.82-1.6556.911-2.2736.178-5.5924-6.641-26.42692-34.89-.6463-60.6377 23.5249-23.4947 53.4891-40.24601 64.5942-46.035595 1.2599-.656858 2.587.758365 1.8496 1.971665z" />
      <path d="m94.8459 230.385c1.2678.888 2.8299-.626 1.9802-1.918-14.1887-21.581-61.3548-93.386-67.8702-104.165-6.4264-10.632-19.06614-28.301-20.12056-43.4178-.10524-1.5091-2.19202-1.8155-2.71696-.3963-.8466 2.2888-1.74793 5.0206-2.58796 8.1413-10.60469 39.3938 4.79656 81.1968 38.24488 104.6088l53.0706 37.148z" />
      <path d="m103.571 228.526 63.524-104.523c.498-.82 1.656-.911 2.274-.178 5.592 6.64 26.427 34.89.646 60.638-23.525 23.494-53.489 40.246-64.594 46.035-1.26.657-2.587-.758-1.85-1.972z" />
      <path d="m107.154.930762c-1.268-.8873666-2.83.625938-1.98 1.918258 14.189 21.58108 61.355 93.38638 67.87 104.16498 6.427 10.632 19.066 28.301 20.121 43.418.105 1.509 2.192 1.815 2.717.396.846-2.289 1.748-5.02 2.588-8.141 10.604-39.394-4.797-81.1965-38.245-104.609z" />
    </g>
  </svg>
);

const ENSProfileLink = ({ className, ...props }: SubComponentProps) => {
  const { identityData, loadingState } = useIdentity();

  if (loadingState !== "success" || !identityData?.display_name) {
    return null;
  }

  return (
    <a
      href={`https://app.ens.domains/${identityData.display_name}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`namekit-ens-profile-link ${className}`}
      {...props}
    >
      <ENSLogo />
      <span className="nk-ml-1">ENS Profile</span>
    </a>
  );
};

export const Identity = {
  Root,
  Avatar,
  Name,
  Address,
  NameGuardShield,
  ENSProfileLink,
  Followers,
};
