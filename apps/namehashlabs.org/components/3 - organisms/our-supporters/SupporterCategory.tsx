"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/data/ensProfiles";
import { getRandomProfiles } from "./profile-randomization";
import {
  ThreeSupportersContainer,
  FourSupportersContainer,
} from "./supporters-containers";

export interface SupporterCategoryProps {
  title: string;
  profiles: Profile[];
}

export const SupporterCategory = ({
  title,
  profiles,
}: SupporterCategoryProps) => {
  const [profilesDisplay, setProfilesDisplay] = useState<Profile[]>([]);

  useEffect(() => {
    setProfilesDisplay(getRandomProfiles(profiles, title));
  }, [profiles, title]);

  // Don't render if we don't have valid profiles
  if (
    !profiles ||
    profiles.length === 0 ||
    !profilesDisplay ||
    profilesDisplay.length === 0
  ) {
    return (
      <div className="flex items-center justify-center flex-col gap-7 bg-white py-8 px-10 border border-gray-200 rounded-[8px]">
        <p className="text-lg leading-6 font-semibold text-center ">{title}</p>
        <p>Loading supporters...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col gap-7 bg-white py-8 px-10 border border-gray-200 rounded-[8px]">
      <p className="text-lg leading-6 font-semibold text-center ">{title}</p>
      {profilesDisplay.length >= 4 ? (
        <FourSupportersContainer profiles={profilesDisplay} />
      ) : (
        <ThreeSupportersContainer profiles={profilesDisplay} />
      )}
    </div>
  );
};
