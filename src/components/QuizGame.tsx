"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DirectionMode, QuizQuestion, RoundResult, VocabTerm } from "@/types/vocabulary";
import { generateQuizRound } from "@/utils/gameGenerators";
import { formatTime } from "@/utils/format";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const QUESTION_COUNT = 10;
const OPTION_KEYS = ["1", "2", "3", "4"] as const;

/** Per-question result recorded when the player answers. */
interface AnswerLogEntry {
  /** The option the player picked. */
  selected: string;
  /** Whether it matched the correct answer. */
  correct: boolean;
  /** Milliseconds from the question appearing to the answer. */
  ms: number;
}

interface QuizGameProps {
  terms: VocabTerm[];
  direction: DirectionMode;
  subTopicTitle: string;
  onFinish: (result: RoundResult) => void;
  onRestart: () => void;
}

function directionLabel(direction: DirectionMode): string {
  if (direction === "en-to-pinyin") return "English → Pinyin";
  if (direction === "pinyin-to-en") return "Pinyin → English";
  return "Mixed direction";
}

function promptLabel(direction: DirectionMode): string {
  if (direction === "en-to-pinyin") return "What is the Pinyin for…";
  if (direction === "pinyin-to-en") return "What does this mean?";
  return "Question";
}

export default function QuizGame({
  terms,
  direction,
  subTopicTitle,
  onFinish,
  onRestart,
}: QuizGameProps) {
  const { playCorrect, playWrong, playFanfare } = useSoundEffects();

  // Client-only component (loaded via next/dynamic with ssr: false), so the
  // randomized round can safely be created in the lazy initializer.
  const [questions] = useState<QuizQuestion[]>(() =>
    generateQuizRound(terms, direction, QUESTION_COUNT),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [answerLog, setAnswerLog] = useState<AnswerLogEntry[]>([]);
  const finishedRef = useRef(false);
  const startedAtRef = useRef<number>(0);
  const questionStartedAtRef = useRef<number>(0);

  // Start the round clock — and the first question's clock — the moment the
  // first question is on screen.
  useEffect(() => {
    startedAtRef.current = Date.now();
    questionStartedAtRef.current = Date.now();
  }, []);

  const question = questions[index];
  const isAnswered = selected !== null;
  const isLast = index === questions.length - 1;
  const wasCorrect = isAnswered && selected === question?.answer;
  // Log entry for the question currently on screen (undefined until answered).
  const currentLog = isAnswered ? answerLog[answerLog.length - 1] : undefined;

  const recordFinish = useCallback(
    (finalCorrect: number, finalStreak: number) => {
      if (finishedRef.current || questions.length === 0) return;
      finishedRef.current = true;
      onFinish({
        accuracy: (finalCorrect / questions.length) * 100,
        streak: finalStreak,
      });
    },
    [onFinish, questions],
  );

  const answer = useCallback(
    (option: string) => {
      if (!question || finished || isAnswered) return;
      const correct = option === question.answer;
      const ms = Math.max(0, Date.now() - questionStartedAtRef.current);
      setSelected(option);
      setAnswerLog((prev) => [...prev, { selected: option, correct, ms }]);
      if (correct) {
        setCorrectCount((c) => c + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        playCorrect();
      } else {
        setStreak(0);
        playWrong();
      }
    },
    [question, finished, isAnswered, playCorrect, playWrong],
  );

  const advance = useCallback(() => {
    if (!question || !isAnswered) return;
    if (isLast) {
      const finalCorrect = correctCount;
      const seconds = Math.max(
        1,
        Math.round((Date.now() - startedAtRef.current) / 1000),
      );
      setElapsed(seconds);
      setFinished(true);
      recordFinish(finalCorrect, Math.max(bestStreak, streak));
      playFanfare();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    questionStartedAtRef.current = Date.now();
  }, [
    question,
    isAnswered,
    isLast,
    correctCount,
    bestStreak,
    streak,
    recordFinish,
    playFanfare,
  ]);

  const restart = useCallback(() => {
    finishedRef.current = false;
    onRestart();
  }, [onRestart]);

  // Keyboard shortcuts: 1–4 answer, Enter advances / restarts.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // Don't steal keys while the reference modal (or any dialog) is open.
      if (document.querySelector('[role="dialog"]')) return;

      if (finished) {
        if (event.key === "Enter") {
          event.preventDefault();
          restart();
        }
        return;
      }

      if (!question) return;

      if (!isAnswered) {
        const optionIndex = OPTION_KEYS.indexOf(event.key as (typeof OPTION_KEYS)[number]);
        if (optionIndex !== -1 && question.options[optionIndex]) {
          event.preventDefault();
          answer(question.options[optionIndex]);
          return;
        }
      }

      if (event.key === "Enter" && isAnswered) {
        event.preventDefault();
        advance();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [question, isAnswered, finished, answer, advance, restart]);

  const accuracy = useMemo(
    () => (questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0),
    [correctCount, questions.length],
  );

  if (questions.length === 0 || !question) {
    return (
      <div className="rounded-2xl border border-edge bg-surface p-8 text-center text-ink-dim">
        No terms available for this sub-topic yet.
      </div>
    );
  }

  /* ----------------------------- Results ----------------------------- */
  if (finished) {
    const avgSeconds =
      answerLog.length > 0
        ? answerLog.reduce((sum, entry) => sum + entry.ms, 0) / answerLog.length / 1000
        : 0;

    return (
      <div className="anim-pop mx-auto w-full max-w-2xl rounded-2xl border border-edge bg-surface p-6 sm:p-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Round complete · {subTopicTitle}
          </p>
          <p className="mt-3 text-5xl font-bold tabular-nums text-ink">{accuracy}%</p>
          <p className="mt-1 text-sm text-ink-dim">
            {correctCount} of {questions.length} correct
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-edge bg-surface-2 p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-good">{bestStreak}</p>
            <p className="mt-0.5 text-xs text-ink-faint">Best streak</p>
          </div>
          <div className="rounded-xl border border-edge bg-surface-2 p-4 text-center">
            <p
              title="Time taken to finish this quiz"
              className="text-2xl font-bold tabular-nums text-ink"
            >
              {formatTime(elapsed)}
            </p>
            <p className="mt-0.5 text-xs text-ink-faint">Time</p>
          </div>
          <div className="rounded-xl border border-edge bg-surface-2 p-4 text-center">
            <p
              title="Average time to answer each question"
              className="text-2xl font-bold tabular-nums text-ink"
            >
              {avgSeconds.toFixed(1)}s
            </p>
            <p className="mt-0.5 text-xs text-ink-faint">Avg answer</p>
          </div>
          <div className="rounded-xl border border-edge bg-surface-2 p-4 text-center">
            <p className="text-xs font-bold leading-tight text-accent sm:text-sm">
              {directionLabel(direction)}
            </p>
            <p className="mt-1 text-xs text-ink-faint">Direction</p>
          </div>
        </div>

        {/* Per-question review with answer times */}
        {answerLog.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Question review · time to answer
            </p>
            <ol className="mt-2 space-y-1.5">
              {questions.map((q, i) => {
                const log = answerLog[i];
                if (!log) return null;
                return (
                  <li
                    key={`${q.term.id}-${i}`}
                    className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-edge bg-surface-2 px-3 py-2 text-xs"
                  >
                    <span className="w-4 shrink-0 tabular-nums text-ink-faint">{i + 1}</span>
                    <span className="font-medium text-ink">{q.prompt}</span>
                    <span aria-hidden className="text-ink-faint">
                      →
                    </span>
                    <span className="font-medium text-ink-dim">{q.answer}</span>
                    {log.correct ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-good">
                        <svg
                          viewBox="0 0 20 20"
                          className="h-3 w-3"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex min-w-0 items-center gap-1 font-semibold text-bad">
                        <svg
                          viewBox="0 0 20 20"
                          className="h-3 w-3 shrink-0"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
                        </svg>
                        You: <span className="min-w-0 break-words">{log.selected}</span>
                      </span>
                    )}
                    <span
                      title="Time taken to answer this question"
                      className="ml-auto shrink-0 tabular-nums font-semibold text-ink"
                    >
                      {(log.ms / 1000).toFixed(1)}s
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {/* No autoFocus: it would scroll the tall results card past its
              summary. Enter still restarts via the window key handler. */}
          <button
            type="button"
            onClick={restart}
            className="focus-ring rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:brightness-110 active:scale-[0.98]"
          >
            Play again
            <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-medium">
              Enter
            </span>
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Scores are saved locally for this sub-topic.
        </p>
      </div>
    );
  }

  /* ----------------------------- Playing ----------------------------- */
  const progressPct = ((index + (isAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Round header */}
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-ink-faint">
        <span className="font-medium">
          Question {index + 1} of {questions.length}
        </span>
        <span className="flex items-center gap-3">
          <span className="tabular-nums" title="Current streak">
            Streak{" "}
            <span className={streak > 0 ? "font-semibold text-warn" : "text-ink-dim"}>
              {streak}
            </span>
          </span>
          <span className="hidden sm:inline">{directionLabel(direction)}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
        className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-3"
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question card */}
      <div
        key={index}
        className="anim-fade-up rounded-2xl border border-edge bg-surface p-5 sm:p-7"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {promptLabel(direction)}
        </p>
        <p
          className={[
            "mt-2 break-words font-semibold leading-tight text-ink",
            direction === "pinyin-to-en" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          ].join(" ")}
        >
          {question.prompt}
        </p>

        {/* 2x2 answer grid */}
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === option;
            const isAnswer = option === question.answer;
            let stateClasses =
              "border-edge bg-surface-2 text-ink hover:border-edge-strong hover:bg-surface-3";
            if (isAnswered && isAnswer) {
              stateClasses = "border-good bg-good-soft text-ink";
            } else if (isAnswered && isSelected && !isAnswer) {
              stateClasses = "border-bad bg-bad-soft text-ink";
            } else if (isAnswered) {
              stateClasses = "border-edge bg-surface-2 text-ink-faint opacity-70";
            }

            return (
              <button
                key={option}
                type="button"
                disabled={isAnswered}
                onClick={() => answer(option)}
                className={[
                  "focus-ring group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all",
                  "disabled:cursor-default",
                  stateClasses,
                  isSelected && !isAnswer && isAnswered ? "anim-shake" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold tabular-nums",
                    isAnswered && isAnswer
                      ? "border-good text-good"
                      : isAnswered && isSelected && !isAnswer
                        ? "border-bad text-bad"
                        : "border-edge-strong text-ink-faint",
                  ].join(" ")}
                >
                  {optionIndex + 1}
                </span>
                <span className="min-w-0 break-words text-sm font-medium sm:text-base">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback + memory tip */}
        {isAnswered && (
          <div className="anim-fade-up mt-4 space-y-3">
            <div
              className={[
                "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
                wasCorrect
                  ? "border-good/50 bg-good-soft text-ink"
                  : "border-bad/50 bg-bad-soft text-ink",
              ].join(" ")}
            >
              <span aria-hidden className="mt-0.5 shrink-0">
                {wasCorrect ? (
                  <svg viewBox="0 0 20 20" className="h-4 w-4 text-good" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" className="h-4 w-4 text-bad" fill="currentColor">
                    <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
                  </svg>
                )}
              </span>
              <span>
                {wasCorrect ? (
                  <strong className="font-semibold">Correct.</strong>
                ) : (
                  <>
                    <strong className="font-semibold">Not quite.</strong> The answer is{" "}
                    <strong className="font-semibold">{question.answer}</strong>.
                  </>
                )}
              </span>
              {currentLog && (
                <span
                  title="Time taken to answer this question"
                  className="ml-auto shrink-0 rounded-md border border-edge bg-surface px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-ink-dim"
                >
                  {(currentLog.ms / 1000).toFixed(1)}s
                </span>
              )}
            </div>

            {/* Memory tip */}
            <div className="rounded-xl border border-edge bg-surface-2 px-4 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-warn" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M10 2a5.5 5.5 0 0 0-3.2 9.97c.4.3.7.75.7 1.26V14a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-.77c0-.51.3-.96.7-1.26A5.5 5.5 0 0 0 10 2ZM7.5 16.5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Z"
                    clipRule="evenodd"
                  />
                </svg>
                Memory tip
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-dim">{question.term.tip}</p>
            </div>

            <button
              type="button"
              onClick={advance}
              autoFocus
              className="focus-ring w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:brightness-110 active:scale-[0.98] sm:w-auto sm:float-right"
            >
              {isLast ? "See results" : "Next question"}
              <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-medium">
                Enter
              </span>
            </button>
            <div className="clear-both" />
          </div>
        )}
      </div>
    </div>
  );
}
