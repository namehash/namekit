import { Profile } from "@/data/ensProfiles";
import { AvatarQueryModel, getDynamicENSAvatarCallback } from "./avatar";

const getCachedAvatarCallback = async (ensName: string) => {
  return fetch(`/images/avatars/${ensName}.png`, {
    method: "GET",
    mode: "no-cors",
  })
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error(`Failed to fetch cached avatar for ${ensName}`);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const getFallbackAvatarCallback = async (ensName: string) => {
  return fetch("/images/no-avatar.png", {
    method: "GET",
    mode: "no-cors",
  })
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error(`Failed to fetch fallback avatar for ${ensName}`);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const getNameHashLabsAvatarCallbacks = (
  profile: Profile,
): AvatarQueryModel[] => {
  return [
    async () => await getCachedAvatarCallback(profile.ensName),
    async () => await getDynamicENSAvatarCallback(profile.ensName),
    async () => await getFallbackAvatarCallback(profile.ensName),
  ];
};
