"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { Profile } from "@/data/ensProfiles";
import { AvatarSize, AvatarWithTooltip } from "./avatar-with-tooltip";
import { useEffect, useState } from "react";
import {
  AvatarQueryModel,
  LogLevel,
  queryMultipleEndpointsToGetAvatar,
} from "@/lib/client/avatar";

interface UltimateENSAvatarProps {
  profile: Profile;
  size?: AvatarSize;
  className?: string;
  avatarQueries?: AvatarQueryModel[];
  queriesLogLevel?: LogLevel;
}

export const UltimateENSAvatar = ({
  profile,
  className = "",
  size = AvatarSize.MEDIUM,
  queriesLogLevel,
  avatarQueries,
}: UltimateENSAvatarProps) => {
  if (!avatarQueries?.length)
    throw new Error(
      "At least one Avatar Query must be provided in order to fetch an Avatar image.",
    );

  const [avatarResponse, setAvatarResponse] = useState<Response | null>(null);

  useEffect(() => {
    queryMultipleEndpointsToGetAvatar({
      avatarQueries,
      logLevel: queriesLogLevel,
    }).then((result) => {
      setAvatarResponse(result);
    });
  }, [avatarQueries]);

  return (
    <AvatarWithTooltip
      avatarQueryResponse={avatarResponse}
      className={className}
      profile={profile}
      size={size}
    />
  );
};
