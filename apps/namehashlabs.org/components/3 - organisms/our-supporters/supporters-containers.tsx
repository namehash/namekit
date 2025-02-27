import { AvatarSize, UltimateENSAvatar } from "@/components/2 - molecules";
import { getNameHashLabsAvatarCallbacks } from "@/lib/client/nh-labs-avatar";
import { Profile } from "@/data/ensProfiles";

export interface ProfilesContainerProps {
  profiles: Profile[];
}

export const ThreeSupportersContainer = ({
  profiles,
}: ProfilesContainerProps) => {
  return (
    <div className="w-full flex relative">
      <div className="w-full flex justify-center gap-4">
        <UltimateENSAvatar
          avatarQueries={getNameHashLabsAvatarCallbacks(profiles[0])}
          profile={profiles[0]}
          size={AvatarSize.SMALL}
        />
        <UltimateENSAvatar
          avatarQueries={getNameHashLabsAvatarCallbacks(profiles[1])}
          profile={profiles[1]}
          size={AvatarSize.SMALL}
        />
        <UltimateENSAvatar
          avatarQueries={getNameHashLabsAvatarCallbacks(profiles[2])}
          profile={profiles[2]}
          size={AvatarSize.SMALL}
        />
      </div>
    </div>
  );
};

export const FourSupportersContainer = ({
  profiles,
}: ProfilesContainerProps) => {
  return (
    <div className="flex relative pr-[62px] h-[120px] b w-[265px] items-center justify-center">
      <UltimateENSAvatar
        avatarQueries={getNameHashLabsAvatarCallbacks(profiles[1])}
        profile={profiles[1]}
        size={AvatarSize.SMALL}
        className="absolute top-0 right-[122px]"
      />
      <UltimateENSAvatar
        avatarQueries={getNameHashLabsAvatarCallbacks(profiles[3])}
        profile={profiles[3]}
        size={AvatarSize.SMALL}
        className="absolute top-0 right-0"
      />
      <UltimateENSAvatar
        avatarQueries={getNameHashLabsAvatarCallbacks(profiles[0])}
        profile={profiles[0]}
        size={AvatarSize.SMALL}
        className="absolute bottom-0 left-0 "
      />
      <UltimateENSAvatar
        avatarQueries={getNameHashLabsAvatarCallbacks(profiles[2])}
        profile={profiles[2]}
        size={AvatarSize.SMALL}
        className="absolute bottom-0 left-[122px]"
      />
    </div>
  );
};
