import { ActivityDescription } from "../Procedure/Activity.ts";

interface CategorizedDescriptions {
  category: string;
  activityDescriptions: ActivityDescription[];
}

function createCategorizedDescriptions(
  category: string,
  activityDescriptions: ActivityDescription[]
): CategorizedDescriptions {
  return { category: category, activityDescriptions: activityDescriptions };
}

export { createCategorizedDescriptions, CategorizedDescriptions };
