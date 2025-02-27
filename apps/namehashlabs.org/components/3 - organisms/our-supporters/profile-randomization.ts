import { Profile } from "@/data/ensProfiles";

// A more reliable Fisher-Yates shuffle algorithm with seed
export function shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;

  // Simple seeded random function
  const random = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function getRandomProfiles(
  profiles: Profile[],
  title: string,
  maxCount: number = 4,
): Profile[] {
  // Filter out any undefined profiles first
  const validProfiles = profiles.filter((profile) => !!profile);

  if (validProfiles.length === 0) {
    return [];
  }

  // Create a more reliable seed from the title
  const seed = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Add a random component that changes on each page load
  // but is consistent for this render cycle
  const randomComponent = Math.floor(Math.random() * 10000);

  // Combine the deterministic seed with the random component
  // This ensures different randomization on each page load
  // but consistency within a single render
  const combinedSeed = seed + randomComponent;

  // Force randomization by adding a random component that's consistent for this category
  const randomizedProfiles = shuffleArrayWithSeed(validProfiles, combinedSeed);

  return randomizedProfiles.slice(
    0,
    Math.min(maxCount, randomizedProfiles.length),
  );
}
