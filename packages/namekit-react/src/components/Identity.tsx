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

interface IdentityContextType extends SecurePrimaryNameResult {
  address: string;
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
}

const Root = ({
  address,
  network = "mainnet",
  className,
  children,
  ...props
}: RootProps) => {
  const [data, setData] = useState<IdentityContextType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const nameguard = createClient({ network });

        const result = await nameguard.getSecurePrimaryName(address, {
          returnNameGuardReport: true,
        });

        setData({ ...result, address });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address, network]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <IdentityContext.Provider value={data}>
      <div className={`namekit-identity ${className}`} {...props}>
        {children}
      </div>
    </IdentityContext.Provider>
  );
};

const Avatar = ({ className, children, ...props }: SubComponentProps) => {
  const { display_name } = useIdentity();

  return (
    <div className={`namekit-avatar ${className}`} {...props}>
      <img
        src={`https://avatar.example.com/${display_name}`}
        alt={display_name}
      />
      {children}
    </div>
  );
};

const Name = ({ className, ...props }: SubComponentProps) => {
  const { display_name } = useIdentity();

  return (
    <div className={`namekit-name ${className}`} {...props}>
      {display_name}
    </div>
  );
};

const Address = ({ className, ...props }: SubComponentProps) => {
  const { address } = useIdentity();

  return (
    <div className={`namekit-address ${className}`} {...props}>
      {address}
    </div>
  );
};

const NameGuardShield = ({ className, ...props }: SubComponentProps) => {
  const { nameguard_report } = useIdentity();

  return (
    <div className={`namekit-nameguard-shield ${className}`} {...props}>
      <div className="namekit-nameguard-rating">
        Rating: {nameguard_report?.rating}
      </div>
      <div className="namekit-nameguard-risk-count">
        Risks: {nameguard_report?.risk_count}
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
