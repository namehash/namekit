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

    fetchData();
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

export const Identity = {
  Root,
  Avatar,
  Name,
  Address,
  NameGuardShield,
};
