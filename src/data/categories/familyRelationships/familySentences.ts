import type { SubTopic, VocabTerm } from "@/types/vocabulary";

export const familySentences: VocabTerm[] = [
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
  {
    id: "sentence-mama-haizi",
    pinyin: "Wǒ māma yǒu yí ge háizi, érqiě zhège háizi jiù shì wǒ.",
    english: "My mother has one child, and that child is exactly me.",
    tip: "Wǒ māma = 'my mother'; háizi = child; érqiě = 'and'; shì = 'is'.",
  },
];

export const familySentencesSubTopic: SubTopic = {
  id: "sentences",
  title: "Sentences",
  description:
    "Sixteen complete sentences built on Zhè shì…, Tā shì…, and Wǒ yǒu… to introduce family and friends.",
  terms: familySentences,
};
