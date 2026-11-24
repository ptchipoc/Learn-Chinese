import type { SubTopic, VocabCategory, VocabTerm } from "@/types/vocabulary";

/* ------------------------------------------------------------------ */
/* Sub-Topic 1 — Father's Side: Uncles & Aunts (6 terms)               */
/* ------------------------------------------------------------------ */

const paternalUnclesAunts: VocabTerm[] = [
  {
    id: "paternal-bofu",
    pinyin: "Bófù",
    english: "Father's older brother",
    tip: "Bó marks the senior paternal branch; fù means father/male elder.",
  },
  {
    id: "paternal-bomu",
    pinyin: "Bómǔ",
    english: "Father's older brother's wife",
    tip: "Pairs directly with Bófù (Bó + mǔ for female elder).",
  },
  {
    id: "paternal-shushu",
    pinyin: "Shūshu",
    english: "Father's younger brother",
    tip: "Reduplicated Shū is used specifically for dad's younger brother.",
  },
  {
    id: "paternal-shenshen",
    pinyin: "Shěnshen",
    english: "Father's younger brother's wife",
    tip: "Reduplicated Shěn pairs with Shūshu.",
  },
  {
    id: "paternal-gugu",
    pinyin: "Gūgu",
    english: "Father's sister (older or younger)",
    tip: "Applies to any paternal aunt by blood, regardless of age.",
  },
  {
    id: "paternal-gufu",
    pinyin: "Gūfu",
    english: "Father's sister's husband",
    tip: "Combines Gū (paternal aunt) with fu (husband).",
  },
];

/* ------------------------------------------------------------------ */
/* Sub-Topic 2 — Mother's Side: Uncles & Aunts (4 terms)               */
/* ------------------------------------------------------------------ */

const maternalUnclesAunts: VocabTerm[] = [
  {
    id: "maternal-ayi",
    pinyin: "Āyí",
    english: "Mother's sister (older or younger)",
    tip: "Used for any maternal aunt by blood, whether older or younger than your mother.",
  },
  {
    id: "maternal-yifu",
    pinyin: "Yífu",
    english: "Mother's sister's husband",
    tip: "Combines Yí (from Āyí) with fu (husband).",
  },
  {
    id: "maternal-jiujiu",
    pinyin: "Jiùjiu",
    english: "Mother's brother (older or younger)",
    tip: "Reduplicated Jiù applies to any maternal uncle by blood, regardless of age.",
  },
  {
    id: "maternal-jiuma",
    pinyin: "Jiùmā",
    english: "Mother's brother's wife",
    tip: "Combines Jiù (maternal uncle) with mā (aunt/mother figure).",
  },
];

/* ------------------------------------------------------------------ */
/* Sub-Topic 3 — Cousins (8 terms)                                     */
/* ------------------------------------------------------------------ */

const cousins: VocabTerm[] = [
  {
    id: "cousin-tangge",
    pinyin: "Tánggē",
    english: "Older male cousin (man)",
    tip: "Táng = father's brother's side (same paternal surname); gē = older male.",
  },
  {
    id: "cousin-tangdi",
    pinyin: "Tángdì",
    english: "Younger male cousin (man)",
    tip: "Táng = father's brother's side; dì = younger male.",
  },
  {
    id: "cousin-tangjie",
    pinyin: "Tángjiě",
    english: "Older female cousin (man)",
    tip: "Táng = father's brother's side; jiě = older female.",
  },
  {
    id: "cousin-tangmei",
    pinyin: "Tángmèi",
    english: "Younger female cousin (man)",
    tip: "Táng = father's brother's side; mèi = younger female.",
  },
  {
    id: "cousin-biaoge",
    pinyin: "Biǎogē",
    english: "Older male cousin (woman)",
    tip: "Biǎo = father's sister's side OR mother's side; gē = older male.",
  },
  {
    id: "cousin-biaodi",
    pinyin: "Biǎodì",
    english: "Younger male cousin (woman)",
    tip: "Biǎo = father's sister's side OR mother's side; dì = younger male.",
  },
  {
    id: "cousin-biaojie",
    pinyin: "Biǎojiě",
    english: "Older female cousin (woman)",
    tip: "Biǎo = father's sister's side OR mother's side; jiě = older female.",
  },
  {
    id: "cousin-biaomei",
    pinyin: "Biǎomèi",
    english: "Younger female cousin (woman)",
    tip: "Biǎo = father's sister's side OR mother's side; mèi = younger female.",
  },
];

/* ------------------------------------------------------------------ */
/* Sub-Topic 4 — Grandchildren (4 terms)                               */
/* ------------------------------------------------------------------ */

const grandchildren: VocabTerm[] = [
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

/* ------------------------------------------------------------------ */
/* Sub-Topics (the four concrete groups)                               */
/* ------------------------------------------------------------------ */

const concreteSubTopics: SubTopic[] = [
  {
    id: "paternal-uncles-aunts",
    title: "Father's Side: Uncles & Aunts",
    description: "Six terms for the senior and junior branches of your father's siblings.",
    terms: paternalUnclesAunts,
  },
  {
    id: "maternal-uncles-aunts",
    title: "Mother's Side: Uncles & Aunts",
    description: "Four terms covering your mother's sisters and brothers.",
    terms: maternalUnclesAunts,
  },
  {
    id: "cousins",
    title: "Cousins",
    description: "Eight terms splitting paternal vs. maternal lines and age/gender.",
    terms: cousins,
  },
  {
    id: "grandchildren",
    title: "Grandchildren",
    description: "Four terms for son's children vs. daughter's children.",
    terms: grandchildren,
  },
];

/* ------------------------------------------------------------------ */
/* Sub-Topic 5 — All Family & Relationships Mixed (dynamic aggregate)  */
/* ------------------------------------------------------------------ */

const allFamilyTerms: VocabTerm[] = concreteSubTopics.flatMap((sub) => sub.terms);

const allFamilyMixed: SubTopic = {
  id: "all-family-mixed",
  title: "All Family & Relationships Mixed",
  description: `Every term in this category shuffled together (${allFamilyTerms.length} terms).`,
  terms: allFamilyTerms,
};

/* ------------------------------------------------------------------ */
/* Category export                                                     */
/* ------------------------------------------------------------------ */

export const familyRelationshipsCategory: VocabCategory = {
  id: "family-relationships",
  title: "Family & Relationships",
  shortTitle: "Family",
  subTopics: [...concreteSubTopics, allFamilyMixed],
};
