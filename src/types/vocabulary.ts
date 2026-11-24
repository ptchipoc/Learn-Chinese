/**
 * Generic vocabulary domain types.
 * These are category-agnostic so new top-level categories can be added
 * without touching any game engine or UI component.
 */

/** A single vocabulary entry: Pinyin + English + memory tip. NO Hanzi, ever. */
export interface VocabTerm {
  /** Stable unique id within a sub-topic (e.g. "paternal-bófù"). */
  id: string;
  /** Tone-marked Pinyin, e.g. "Bófù". */
  pinyin: string;
  /** English definition, e.g. "Father's older brother". */
  english: string;
  /** Memory tip shown during study / after quiz answers. */
  tip: string;
}

/** A grouping of terms inside a category (e.g. "Cousins"). */
export interface SubTopic {
  id: string;
  /** Display title, e.g. "Father's Side: Uncles & Aunts". */
  title: string;
  /** Short description shown under the pills / in the reference sheet. */
  description?: string;
  /** Terms belonging to this sub-topic. The "All Mixed" sub-topic
   *  aggregates every term in its category at build time. */
  terms: VocabTerm[];
}

/** Top-level vocabulary category (e.g. "Family & Relationships"). */
export interface VocabCategory {
  id: string;
  /** Display title for the category switcher. */
  title: string;
  /** Emoji-free short label used in compact nav pills. */
  shortTitle?: string;
  /** Sub-topics in display order. The final "All Mixed" entry is derived. */
  subTopics: SubTopic[];
}

/** Game modes available for every sub-topic. */
export type GameMode = "quiz" | "match" | "reference";

/** Direction of a question / board. */
export type DirectionMode = "en-to-pinyin" | "pinyin-to-en" | "mixed";

/** A single generated multiple-choice question. */
export interface QuizQuestion {
  /** The term being asked about. */
  term: VocabTerm;
  /** Text shown as the prompt. */
  prompt: string;
  /** Correct answer text. */
  answer: string;
  /** 4 options (including `answer`), shuffled, laid out 2x2. */
  options: string[];
}

/** Persisted per-sub-topic score record. */
export interface SubTopicProgress {
  /** Best accuracy percentage across rounds (0–100). */
  bestAccuracy: number;
  /** Best consecutive-correct streak across rounds. */
  bestStreak: number;
  /** Total finished rounds. */
  completedRounds: number;
}

/** Result of a finished round, used to update progress. */
export interface RoundResult {
  accuracy: number;
  streak: number;
}

export type ThemeMode = "light" | "dark";

/** Shape persisted in localStorage under `lxc-state-v1`. */
export interface LocalAppState {
  theme: ThemeMode;
  muted: boolean;
  progress: Record<string, SubTopicProgress>;
}
