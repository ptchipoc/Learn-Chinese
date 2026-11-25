import type { SubTopic, VocabTerm } from "@/types/vocabulary";

export const cousins: VocabTerm[] = [
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

export const cousinsSubTopic: SubTopic = {
  id: "cousins",
  title: "Cousins",
  description: "Eight terms splitting paternal vs. maternal lines and age/gender.",
  terms: cousins,
};
