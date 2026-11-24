import type { VocabCategory } from "@/types/vocabulary";
import { familyRelationshipsCategory } from "./familyRelationships";

/**
 * Central category registry.
 *
 * To add a new top-level category (e.g. Food & Dining):
 *   1. Create `src/data/categories/foodDining.ts` exporting a `VocabCategory`.
 *   2. Import it below and append it to `categories`.
 * Nothing else in the app needs to change — navigation, sub-topic pills,
 * the reference sheet, and both game engines read from this array.
 */
export const categories: VocabCategory[] = [familyRelationshipsCategory];

export const defaultCategoryId = familyRelationshipsCategory.id;

export function getCategoryById(id: string): VocabCategory {
  return categories.find((c) => c.id === id) ?? categories[0];
}

export function getSubTopic(category: VocabCategory, subTopicId: string) {
  return category.subTopics.find((s) => s.id === subTopicId) ?? category.subTopics[0];
}

export { familyRelationshipsCategory };
