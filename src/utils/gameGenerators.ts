import type {
  DirectionMode,
  QuizQuestion,
  VocabTerm,
} from "@/types/vocabulary";

/** Fisher–Yates shuffle. Returns a new array; input is untouched. */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Resolve the effective direction for a single item when mode is "mixed". */
function resolveDirection(direction: DirectionMode): "en-to-pinyin" | "pinyin-to-en" {
  if (direction === "mixed") {
    return Math.random() < 0.5 ? "en-to-pinyin" : "pinyin-to-en";
  }
  return direction;
}

function promptFor(term: VocabTerm, dir: "en-to-pinyin" | "pinyin-to-en"): string {
  return dir === "en-to-pinyin" ? term.english : term.pinyin;
}

function answerFor(term: VocabTerm, dir: "en-to-pinyin" | "pinyin-to-en"): string {
  return dir === "en-to-pinyin" ? term.pinyin : term.english;
}

/**
 * Build a quiz round of `count` multiple-choice questions from any term list.
 * - Cycles through a shuffled pool so small sub-topics still reach `count`.
 * - Never repeats the same term twice in a row when possible.
 * - Always yields exactly 4 options (2x2 grid), 3 distractors from the pool.
 * - Direction "mixed" is resolved independently per question.
 */
export function generateQuizRound(
  terms: readonly VocabTerm[],
  direction: DirectionMode,
  count = 10,
): QuizQuestion[] {
  if (terms.length === 0) return [];

  const questions: QuizQuestion[] = [];
  let lastTermId: string | null = null;
  let pool: VocabTerm[] = [];

  for (let i = 0; i < count; i++) {
    if (pool.length === 0) pool = shuffleArray(terms);

    // Avoid an immediate repeat when the pool allows it.
    if (pool.length > 1 && pool[0].id === lastTermId) {
      [pool[0], pool[1]] = [pool[1], pool[0]];
    }

    const term = pool.shift()!;
    lastTermId = term.id;

    const dir = resolveDirection(direction);
    const answer = answerFor(term, dir);

    const distractorPool = terms.filter((t) => t.id !== term.id);
    const distractors = shuffleArray(distractorPool)
      .slice(0, 3)
      .map((t) => answerFor(t, dir));

    // With < 4 total terms, pad distractors from the opposite language so
    // the grid still has 4 distinct-looking options.
    while (distractors.length < 3) {
      const filler = answerFor(
        terms[(distractors.length + 1) % terms.length],
        dir === "en-to-pinyin" ? "pinyin-to-en" : "en-to-pinyin",
      );
      if (filler !== answer && !distractors.includes(filler)) {
        distractors.push(filler);
      } else {
        distractors.push(`— ${distractors.length + 1} —`);
      }
    }

    questions.push({
      term,
      prompt: promptFor(term, dir),
      answer,
      options: shuffleArray([answer, ...distractors]),
    });
  }

  return questions;
}

/** One side of a match board cell. */
export interface MatchCell {
  termId: string;
  text: string;
}

/** A prepared two-column match board. */
export interface MatchBoard {
  /** Left column cells, shuffled. */
  left: MatchCell[];
  /** Right column cells, shuffled independently of the left. */
  right: MatchCell[];
  /** Effective column order for this round (relevant for "mixed"). */
  primarySide: "pinyin" | "english";
}

export const MATCH_BOARD_SIZE = 8;

/**
 * Build a two-column matching board from any term list.
 * - Caps at `MATCH_BOARD_SIZE` randomly chosen terms (keeps "All Mixed" playable).
 * - Direction decides which language sits on the left; "mixed" randomizes it.
 * - The right column is always shuffled so pairs never line up.
 */
export function generateMatchBoard(
  terms: readonly VocabTerm[],
  direction: DirectionMode,
): MatchBoard {
  const sample = shuffleArray(terms).slice(0, MATCH_BOARD_SIZE);

  let primarySide: "pinyin" | "english";
  if (direction === "mixed") {
    primarySide = Math.random() < 0.5 ? "pinyin" : "english";
  } else {
    primarySide = direction === "pinyin-to-en" ? "pinyin" : "english";
  }

  const toCell = (t: VocabTerm, side: "pinyin" | "english"): MatchCell => ({
    termId: t.id,
    text: side === "pinyin" ? t.pinyin : t.english,
  });

  const left = shuffleArray(sample.map((t) => toCell(t, primarySide)));
  const right = shuffleArray(
    sample.map((t) => toCell(t, primarySide === "pinyin" ? "english" : "pinyin")),
  );

  return { left, right, primarySide };
}
