import type { SubTopic, VocabTerm } from "@/types/vocabulary";

export const grandchildren: VocabTerm[] = [
  {
    id: "grandchild-sunzi",
    pinyin: "Sūnzi",
    english: "Grandson (son's son)",
    tip: "Sūn- without Wài- means patrilineal (son's child); -zi marks grandson.",
  },
  {
    id: "grandchild-sunnv",
    pinyin: "Sūnnǚ",
    english: "Granddaughter (son's daughter)",
    tip: "Sūn- = son's child; -nǚ marks female/granddaughter.",
  },
  {
    id: "grandchild-waisun",
    pinyin: "Wàisūn",
    english: "Grandson (daughter's son)",
    tip: 'Wài- ("outer/maternal branch") marks daughter\'s child; no -nǚ suffix = grandson.',
  },
  {
    id: "grandchild-waisunnv",
    pinyin: "Wàisūnnǚ",
    english: "Granddaughter (daughter's daughter)",
    tip: "Wài- = daughter's child + sūn = grandchild + -nǚ = female.",
  },
];

export const grandchildrenSubTopic: SubTopic = {
  id: "grandchildren",
  title: "Grandchildren",
  description: "Four terms for son's children vs. daughter's children.",
  terms: grandchildren,
};
