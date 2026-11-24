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
/* Sub-Topic 5 — Sentences (15 terms)                                  */
/* ------------------------------------------------------------------ */

const familySentences: VocabTerm[] = [
  {
    id: "sentence-intro-bofu",
    pinyin: "Zhè shì wǒ bófù.",
    english: "This is my father's older brother.",
    tip: "Zhè shì means 'this is'; put the kinship term (bófù) at the end.",
  },
  {
    id: "sentence-intro-gugu",
    pinyin: "Tā shì wǒ gūgu.",
    english: "She is my father's sister.",
    tip: "Tā covers both 'he' and 'she'; wǒ before a noun means 'my'.",
  },
  {
    id: "sentence-intro-jiuma",
    pinyin: "Zhè shì wǒ jiùmā.",
    english: "This is my mother's brother's wife.",
    tip: "Chain the relationships: mother's brother is jiùjiu, his wife is jiùmā.",
  },
  {
    id: "sentence-intro-yifu",
    pinyin: "Tā shì wǒ yífu.",
    english: "He is my mother's sister's husband.",
    tip: "Tā shì = 'he is'; yífu is your maternal aunt's husband.",
  },
  {
    id: "sentence-intro-tangjie",
    pinyin: "Tā shì wǒ tángjiě.",
    english: "She is my older female cousin (man).",
    tip: "Word order stays the same: subject + shì + wǒ + relationship term.",
  },
  {
    id: "sentence-intro-biaodi",
    pinyin: "Tā shì wǒ biǎodì.",
    english: "He is my younger male cousin (woman).",
    tip: "Biǎo covers the mother's side; add -dì for a younger male cousin.",
  },
  {
    id: "sentence-size-tangge",
    pinyin: "Wǒ yǒu liǎng ge tánggē.",
    english: "I have two older male cousins (man).",
    tip: "Wǒ yǒu = 'I have'; count people with ge, and use liǎng ge (not èr) for 'two'.",
  },
  {
    id: "sentence-size-biaomei",
    pinyin: "Wǒ yǒu yí ge biǎomèi.",
    english: "I have one younger female cousin (woman).",
    tip: "Use yí ge for 'one' person — yī changes to yí before a fourth-tone syllable.",
  },
  {
    id: "sentence-size-sunzi",
    pinyin: "Wǒ yǒu yí ge sūnzi hé yí ge wàisūnnǚ.",
    english: "I have one grandson (man) and one granddaughter (woman).",
    tip: "Hé joins the two objects: 'I have one sūnzi and one wàisūnnǚ'.",
  },
  {
    id: "sentence-size-waisun",
    pinyin: "Wǒ yǒu liǎng ge wàisūn.",
    english: "I have two grandsons (woman).",
    tip: "Wàisūn is a daughter's son; the count still uses liǎng ge.",
  },
  {
    id: "sentence-friend-pengyou",
    pinyin: "Tā shì wǒ zuì hǎo de péngyou.",
    english: "He is my best friend.",
    tip: "De links a description to a noun: zuì hǎo de = 'best'.",
  },
  {
    id: "sentence-friend-tongshi",
    pinyin: "Tā shì wǒ de tóngshì.",
    english: "She is my work colleague.",
    tip: "Tóngshì means colleague ('same matter'); wǒ de = 'my'.",
  },
  {
    id: "sentence-friend-tongxue",
    pinyin: "Tā shì wǒ de tóngxué.",
    english: "He is my classmate.",
    tip: "Tóngxué = classmate ('same study'); nothing else is needed for 'my'.",
  },
  {
    id: "sentence-friend-tongshi-plural",
    pinyin: "Tāmen shì wǒ de tóngshì.",
    english: "They are my colleagues.",
    tip: "Tāmen is 'they'; the noun tóngshì stays unchanged for plural.",
  },
  {
    id: "sentence-friend-both",
    pinyin: "Tā shì wǒ de tóngxué, yě shì wǒ zuì hǎo de péngyou.",
    english: "She is my classmate and also my best friend.",
    tip: "Yě means 'also'; repeat shì to join the two descriptions.",
  },
];

/* ------------------------------------------------------------------ */
/* Sub-Topics (the five concrete groups)                               */
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
  {
    id: "sentences",
    title: "Sentences",
    description:
      "Fifteen complete sentences built on Zhè shì…, Tā shì…, and Wǒ yǒu… to introduce family and friends.",
    terms: familySentences,
  },
];

/* ------------------------------------------------------------------ */
/* Sub-Topic 6 — All Family & Relationships Mixed (dynamic aggregate)  */
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
