import { ActivityDescription } from "../Procedure/Activity.ts";

interface CategorizedDescriptions {
  category: string;
  activityDescriptions: ActivityDescription[];
}

/**
 * Creates an object with the CategorizedDescriptions interface containing a category and its associated activity descriptions.
 *
 * @param category - The category name.
 * @param activityDescriptions - An array of activity descriptions associated with the category.
 * @returns An object with the CategorizedDescriptions interface containing the category and its associated activity descriptions.
 */
function createCategorizedDescriptions(
  category: string,
  activityDescriptions: ActivityDescription[]
): CategorizedDescriptions {
  return { category: category, activityDescriptions: activityDescriptions };
}

export { createCategorizedDescriptions, CategorizedDescriptions };
