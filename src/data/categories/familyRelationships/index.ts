import type { VocabCategory, VocabTerm } from "@/types/vocabulary";
import { paternalUnclesAuntsSubTopic } from "./paternalUnclesAunts";
import { maternalUnclesAuntsSubTopic } from "./maternalUnclesAunts";
import { cousinsSubTopic } from "./cousins";
import { grandchildrenSubTopic } from "./grandchildren";
import { familySentencesSubTopic } from "./familySentences";

const concreteSubTopics = [
  paternalUnclesAuntsSubTopic,
  maternalUnclesAuntsSubTopic,
  cousinsSubTopic,
  grandchildrenSubTopic,
  familySentencesSubTopic,
];

const allFamilyTerms: VocabTerm[] = concreteSubTopics.flatMap((sub) => sub.terms);

const allFamilyMixedSubTopic = {
  id: "all-family-mixed",
  title: "All Family & Relationships Mixed",
  description: `Every term in this category shuffled together (${allFamilyTerms.length} terms).`,
  terms: allFamilyTerms,
};

export const familyRelationshipsCategory: VocabCategory = {
  id: "family-relationships",
  title: "Family & Relationships",
  shortTitle: "Family",
  subTopics: [...concreteSubTopics, allFamilyMixedSubTopic],
};
