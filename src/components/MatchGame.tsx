"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DirectionMode, RoundResult, VocabTerm } from "@/types/vocabulary";
import {
  generateMatchBoard,
  shuffleArray,
  type MatchBoard,
} from "@/utils/gameGenerators";
import { formatTime } from "@/utils/format";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface MatchGameProps {
  terms: VocabTerm[];
  direction: DirectionMode;
  subTopicTitle: string;
  onFinish: (result: RoundResult) => void;
  onRestart: () => void;
}

interface LineGeometry {
  termId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function SwapColumnsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h13m0 0-3-3m3 3-3 3M17 17H4m0 0 3 3m-3-3 3-3" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7h3.5c5 0 5 10 10 10H21m0 0-3-3m3 3-3 3M3 17h3.5c1.9 0 3.1-1.4 4.1-3M21 7h-3.5c-1.9 0-3.1 1.4-4.1 3M14 7l3-3m0 0 3 3m-3-3v6"
      />
    </svg>
  );
}

export default function MatchGame({
  terms,
  direction,
  subTopicTitle,
  onFinish,
  onRestart,
}: MatchGameProps) {
  const { playMatch, playWrong, playFanfare, playSelect } = useSoundEffects();

  // Client-only component (loaded via next/dynamic with ssr: false), so the
  // randomized board can safely be created in the lazy initializer.
  const [board, setBoard] = useState<MatchBoard>(() =>
    generateMatchBoard(terms, direction),
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [lines, setLines] = useState<LineGeometry[]>([]);

  const startedAtRef = useRef<number>(0);
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  const playFanfareRef = useRef(playFanfare);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef(new Map<number, HTMLButtonElement>());
  const rightRefs = useRef(new Map<number, HTMLButtonElement>());
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const totalPairs = board.left.length;
  const matchedCount = matchedIds.length;
  const isComplete = totalPairs > 0 && matchedCount === totalPairs;

  /* ----------------------- Connecting line geometry ----------------------- */

  const recalcLines = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();

    const next: LineGeometry[] = [];
    for (const termId of matchedIds) {
      const leftIndex = board.left.findIndex((cell) => cell.termId === termId);
      const rightIndex = board.right.findIndex((cell) => cell.termId === termId);
      if (leftIndex === -1 || rightIndex === -1) continue;

      const leftEl = leftRefs.current.get(leftIndex);
      const rightEl = rightRefs.current.get(rightIndex);
      if (!leftEl || !rightEl) continue;

      const lb = leftEl.getBoundingClientRect();
      const rb = rightEl.getBoundingClientRect();

      next.push({
        termId,
        x1: lb.right - box.left,
        y1: lb.top + lb.height / 2 - box.top,
        x2: rb.left - box.left,
        y2: rb.top + rb.height / 2 - box.top,
      });
    }
    setLines(next);
  }, [matchedIds, board]);

  useLayoutEffect(() => {
    recalcLines();
  }, [recalcLines]);

  useEffect(() => {
    window.addEventListener("resize", recalcLines);
    window.addEventListener("scroll", recalcLines, true);
    const observer =
      typeof ResizeObserver !== "undefined" && containerRef.current
        ? new ResizeObserver(() => recalcLines())
        : null;
    observer?.observe(containerRef.current!);
    return () => {
      window.removeEventListener("resize", recalcLines);
      window.removeEventListener("scroll", recalcLines, true);
      observer?.disconnect();
    };
  }, [recalcLines]);

  /* ------------------------------ Pair logic ------------------------------ */

  const evaluatePair = useCallback(
    (leftIndex: number, rightIndex: number) => {
      const leftCell = board.left[leftIndex];
      const rightCell = board.right[rightIndex];
      if (!leftCell || !rightCell) return;

      if (leftCell.termId === rightCell.termId) {
        setMatchedIds((prev) => [...prev, leftCell.termId]);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        setSelectedLeft(null);
        setSelectedRight(null);
        playMatch();
      } else {
        setMistakes((m) => m + 1);
        setStreak(0);
        setWrongPair({ left: leftIndex, right: rightIndex });
        playWrong();
        if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
        wrongTimeoutRef.current = setTimeout(() => {
          setWrongPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 450);
      }
    },
    [board, playMatch, playWrong],
  );

  const clickLeft = useCallback(
    (index: number) => {
      if (finished || wrongPair !== null) return;
      if (matchedIds.includes(board.left[index]?.termId)) return;
      if (selectedRight !== null) {
        evaluatePair(index, selectedRight);
      } else {
        setSelectedLeft((prev) => (prev === index ? null : index));
        playSelect();
      }
    },
    [finished, wrongPair, matchedIds, board.left, selectedRight, evaluatePair, playSelect],
  );

  const clickRight = useCallback(
    (index: number) => {
      if (finished || wrongPair !== null) return;
      if (matchedIds.includes(board.right[index]?.termId)) return;
      if (selectedLeft !== null) {
        evaluatePair(selectedLeft, index);
      } else {
        setSelectedRight((prev) => (prev === index ? null : index));
        playSelect();
      }
    },
    [finished, wrongPair, matchedIds, board.right, selectedLeft, evaluatePair, playSelect],
  );

  /* ------------------------------ Completion ------------------------------ */

  useEffect(() => {
    if (!isComplete || finishedRef.current) return;
    finishedRef.current = true;

    const seconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    setElapsed(seconds);
    setFinished(true);

    const accuracy =
      matchedCount + mistakes > 0 ? (matchedCount / (matchedCount + mistakes)) * 100 : 100;
    onFinishRef.current({ accuracy, streak: bestStreak });

    // Deliberately not cleaned up here: parent re-renders (e.g. after saving
    // progress) must not cancel the summary. Unmount cleanup below handles it.
    finishTimeoutRef.current = setTimeout(() => {
      setSummaryOpen(true);
      playFanfareRef.current();
    }, 550);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  // Keep the latest callbacks available to the completion effect without
  // re-triggering it (avoids double-saving a round).
  useEffect(() => {
    onFinishRef.current = onFinish;
    playFanfareRef.current = playFanfare;
  }, [onFinish, playFanfare]);

  useEffect(() => {
    return () => {
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    };
  }, []);

  /* ------------------------------ Board controls ------------------------------ */

  const swapColumns = useCallback(() => {
    playSelect();
    setBoard((prev) => ({
      ...prev,
      left: prev.right,
      right: prev.left,
      primarySide: prev.primarySide === "pinyin" ? "english" : "pinyin",
    }));
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [playSelect]);

  const shufflePositions = useCallback(() => {
    playSelect();
    setBoard((prev) => ({
      ...prev,
      left: shuffleArray(prev.left),
      right: shuffleArray(prev.right),
    }));
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [playSelect]);

  const accuracy = matchedCount + mistakes > 0 ? Math.round((matchedCount / (matchedCount + mistakes)) * 100) : 100;

  const primaryLabel = board.primarySide === "pinyin" ? "Pinyin" : "English";
  const secondaryLabel = board.primarySide === "pinyin" ? "English" : "Pinyin";

  if (totalPairs === 0) {
    return (
      <div className="rounded-2xl border border-edge bg-surface p-8 text-center text-ink-dim">
        No terms available for this sub-topic yet.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Round toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-ink-faint">
          <span className="rounded-lg border border-edge bg-surface px-2.5 py-1.5 font-medium text-ink-dim">
            <span className="text-ink">{matchedCount}</span> / {totalPairs} matched
          </span>
          <span className="rounded-lg border border-edge bg-surface px-2.5 py-1.5">
            Mistakes{" "}
            <span className={mistakes > 0 ? "font-semibold text-bad" : "text-ink-dim"}>
              {mistakes}
            </span>
          </span>
          <span className="rounded-lg border border-edge bg-surface px-2.5 py-1.5">
            Streak{" "}
            <span className={streak > 0 ? "font-semibold text-warn" : "text-ink-dim"}>
              {streak}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swapColumns}
            className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-edge bg-surface px-3 py-2 text-xs font-medium text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
          >
            <SwapColumnsIcon />
            Swap Columns
          </button>
          <button
            type="button"
            onClick={shufflePositions}
            className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-edge bg-surface px-3 py-2 text-xs font-medium text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
          >
            <ShuffleIcon />
            Shuffle Positions
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="rounded-2xl border border-edge bg-surface p-4 sm:p-6">
        <div className="mb-3 grid grid-cols-2 gap-x-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-faint sm:gap-x-16">
          <span>{primaryLabel}</span>
          <span>{secondaryLabel}</span>
        </div>

        <div ref={containerRef} className="relative grid grid-cols-2 gap-x-4 sm:gap-x-16">
          {/* Connecting lines */}
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
            aria-hidden
          >
            {lines.map((line) => (
              <path
                key={line.termId}
                d={`M ${line.x1} ${line.y1} C ${line.x1 + (line.x2 - line.x1) / 2} ${line.y1}, ${
                  line.x2 - (line.x2 - line.x1) / 2
                } ${line.y2}, ${line.x2} ${line.y2}`}
                fill="none"
                stroke="var(--good)"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.85}
              />
            ))}
          </svg>

          {/* Left column */}
          <div className="relative z-10 flex flex-col gap-2.5">
            {board.left.map((cell, index) => {
              const isMatched = matchedIds.includes(cell.termId);
              const isSelected = selectedLeft === index;
              const isWrong = wrongPair?.left === index;
              return (
                <button
                  key={`${cell.termId}-${index}`}
                  ref={(el) => {
                    if (el) leftRefs.current.set(index, el);
                    else leftRefs.current.delete(index);
                  }}
                  type="button"
                  disabled={isMatched}
                  onClick={() => clickLeft(index)}
                  aria-pressed={isSelected}
                  className={[
                    "focus-ring rounded-xl border px-3 py-3 text-sm font-medium transition-all sm:text-base",
                    isWrong ? "anim-shake" : "",
                    isMatched
                      ? "cursor-default border-good/60 bg-good-soft text-ink opacity-90"
                      : isSelected
                        ? "border-accent bg-accent-soft text-ink shadow-[0_0_0_1px_var(--accent)]"
                        : "border-edge bg-surface-2 text-ink hover:border-edge-strong hover:bg-surface-3",
                  ].join(" ")}
                >
                  {cell.text}
                </button>
              );
            })}
          </div>

          {/* Right column */}
          <div className="relative z-10 flex flex-col gap-2.5">
            {board.right.map((cell, index) => {
              const isMatched = matchedIds.includes(cell.termId);
              const isSelected = selectedRight === index;
              const isWrong = wrongPair?.right === index;
              return (
                <button
                  key={`${cell.termId}-${index}`}
                  ref={(el) => {
                    if (el) rightRefs.current.set(index, el);
                    else rightRefs.current.delete(index);
                  }}
                  type="button"
                  disabled={isMatched}
                  onClick={() => clickRight(index)}
                  aria-pressed={isSelected}
                  className={[
                    "focus-ring rounded-xl border px-3 py-3 text-sm font-medium transition-all sm:text-base",
                    isWrong ? "anim-shake" : "",
                    isMatched
                      ? "cursor-default border-good/60 bg-good-soft text-ink opacity-90"
                      : isSelected
                        ? "border-accent bg-accent-soft text-ink shadow-[0_0_0_1px_var(--accent)]"
                        : "border-edge bg-surface-2 text-ink hover:border-edge-strong hover:bg-surface-3",
                  ].join(" ")}
                >
                  {cell.text}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Pick one card from each column to pair them. Correct pairs draw a line.
        </p>
      </div>

      {/* Round summary modal */}
      {summaryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Round summary"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSummaryOpen(false)}
            aria-hidden
          />
          <div className="anim-pop relative w-full max-w-md rounded-2xl border border-edge bg-surface p-6 shadow-2xl">
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-good-soft text-good">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink">Round complete!</h3>
              <p className="mt-0.5 text-sm text-ink-dim">{subTopicTitle}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-edge bg-surface-2 p-3.5 text-center">
                <p className="text-2xl font-bold tabular-nums text-ink">{accuracy}%</p>
                <p className="mt-0.5 text-[11px] text-ink-faint">Accuracy</p>
              </div>
              <div className="rounded-xl border border-edge bg-surface-2 p-3.5 text-center">
                <p className="text-2xl font-bold tabular-nums text-ink">
                  {formatTime(elapsed)}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-faint">Time</p>
              </div>
              <div className="rounded-xl border border-edge bg-surface-2 p-3.5 text-center">
                <p className="text-2xl font-bold tabular-nums text-bad">{mistakes}</p>
                <p className="mt-0.5 text-[11px] text-ink-faint">Mistakes</p>
              </div>
              <div className="rounded-xl border border-edge bg-surface-2 p-3.5 text-center">
                <p className="text-2xl font-bold tabular-nums text-warn">{bestStreak}</p>
                <p className="mt-0.5 text-[11px] text-ink-faint">Best streak</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={onRestart}
                autoFocus
                className="focus-ring rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:brightness-110 active:scale-[0.98]"
              >
                Play again
              </button>
              <button
                type="button"
                onClick={() => setSummaryOpen(false)}
                className="focus-ring rounded-xl border border-edge px-6 py-2.5 text-sm font-medium text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
              >
                Review the board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
