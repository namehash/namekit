import { Role } from "@/types";

/**
 * Gets the distinct set of roles from a list of roles.
 * Uses each role's slug to determine uniqueness.
 * 
 * @param roles The list of roles to filter.
 * @param slugs An optional list of slugs to also exclude from the results.
 * @returns The distinct set of roles.
 */
export const getDistinctRoles = (roles: Role[], slugs?: string[]): Role[] => {
  const seenSlugs = new Set<string>(slugs ? slugs : []);
  return roles.filter(role => {
    if (seenSlugs.has(role.slug)) {
      return false;
    } else {
      seenSlugs.add(role.slug);
      return true;
    }
  });
}

/**
 * Gets distinct roles in `allOpenRoles` that are distinct from `role` but most related to `role`.
 * 
 * Related roles are defined as roles in the same category as `role`, followed by roles
 * in different categories.
 * 
 * Distinct roles are defined as roles with distinct `slug` values.
 *
 * @param role The `Role` to get related roles for.
 * @param allOpenRoles All the roles that are open.
 * @param shuffle Whether to shuffle the returned roles. If `false` the results are
 *                determinstic. If `true` then the results are shuffled with a strict bias
 *                for roles in the same category as `role`.
 * @param maxRelatedRoles The maximum number of roles to return.
 * @returns A list of 0 to `maxRelatedRoles` distinct roles (as determined by their `slug`)
 *          that also excludes the provided `role`.
 */

export const getRelatedRoles = (
  role: Role,
  allOpenRoles: Role[],
  shuffle: boolean,
  maxRelatedRoles: number
): Role[] => {
  
  // filter out the specified role and any duplicates in allOpenRoles
  const distinctRoles = getDistinctRoles(allOpenRoles, [role.slug]);

  // shuffle the remaining roles
  const shuffledRoles = shuffle ? shuffleArray(distinctRoles) : distinctRoles;

  // get all roles in the same category as the specified role
  const sameCategoryRoles = shuffledRoles.filter(
    (item) => item.category.name === role.category.name
  );

  // get all roles in a different category as the specified role
  const differentCategoryRoles = shuffledRoles.filter(
    (item) => item.category.name !== role.category.name
  );

  // combine the two sets of roles, ensuring that the same category roles come first
  const relatedRoles = [...sameCategoryRoles, ...differentCategoryRoles];

  // Return the first 'maxRelatedRoles' elements
  return relatedRoles.slice(0, maxRelatedRoles);
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 *
 * @param array The array to shuffle. This array will be modified in place.
 * @returns The shuffled array.
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
