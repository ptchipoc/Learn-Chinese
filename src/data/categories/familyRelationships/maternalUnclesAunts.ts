import type { SubTopic, VocabTerm } from "@/types/vocabulary";

export const maternalUnclesAunts: VocabTerm[] = [
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

export const maternalUnclesAuntsSubTopic: SubTopic = {
  id: "maternal-uncles-aunts",
  title: "Mother's Side: Uncles & Aunts",
  description: "Four terms covering your mother's sisters and brothers.",
  terms: maternalUnclesAunts,
};
