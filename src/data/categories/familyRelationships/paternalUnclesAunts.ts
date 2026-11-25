import type { SubTopic, VocabTerm } from "@/types/vocabulary";

export const paternalUnclesAunts: VocabTerm[] = [
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

export const paternalUnclesAuntsSubTopic: SubTopic = {
  id: "paternal-uncles-aunts",
  title: "Father's Side: Uncles & Aunts",
  description:
    "Six terms for the senior and junior branches of your father's siblings.",
  terms: paternalUnclesAunts,
};
