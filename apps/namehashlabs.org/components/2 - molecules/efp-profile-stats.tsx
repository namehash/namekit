import { useProfileStats } from "ethereum-identity-kit";
import NextLink from "next/link";

interface EfpProfileStatsProps {
  address: string;
}

// Helper function to format numbers according to user's locale
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const EfpProfileStats = ({ address }: EfpProfileStatsProps) => {
  const { followers, following, statsLoading, refreshProfileStats } =
    useProfileStats({
      addressOrName: address,
    });

  return (
    <div className="flex items-center">
      <NextLink
        href={`https://efp.app/${address}`}
        target="_blank"
        className="flex items-center gap-2 transition-all duration-200"
      >
        <div className="flex flex-col items-center gap-1">
          {statsLoading ? (
            <p className="text-sm font-normal bg-gray-200 animate-pulse rounded-md w-16 h-5"></p>
          ) : (
            <p className="text-sm font-normal min-w-16 text-center">
              {formatNumber(following || 0)}
            </p>
          )}

          <p className="text-xs font-normal text-gray-400">Following</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          {statsLoading ? (
            <p className="text-sm font-normal bg-gray-200 animate-pulse rounded-md w-16 h-5"></p>
          ) : (
            <p className="text-sm font-normal min-w-16 text-center">
              {formatNumber(followers || 0)}
            </p>
          )}
          <p className="text-xs font-normal text-gray-400">Followers</p>
        </div>
      </NextLink>
    </div>
  );
};
