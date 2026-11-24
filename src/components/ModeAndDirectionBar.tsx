"use client";

import type { DirectionMode } from "@/types/vocabulary";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface ModeAndDirectionBarProps {
  mode: "quiz" | "match";
  direction: DirectionMode;
  onModeChange: (mode: "quiz" | "match") => void;
  onDirectionChange: (direction: DirectionMode) => void;
  onSwap: () => void;
  onShuffle: () => void;
}

const DIRECTIONS: { id: DirectionMode; label: string; short: string }[] = [
  { id: "en-to-pinyin", label: "English → Pinyin", short: "En → Py" },
  { id: "pinyin-to-en", label: "Pinyin → English", short: "Py → En" },
  { id: "mixed", label: "Mixed", short: "Mixed" },
];

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v13m0 0-3-3m3 3 3-3M17 20V7m0 0 3 3m-3-3-3 3" />
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

function PuzzleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 4.5a2 2 0 1 1 4 0V6h4.5a1.5 1.5 0 0 1 1.5 1.5V12h-1.5a2 2 0 1 1 0 4H19v4.5a1.5 1.5 0 0 1-1.5 1.5H13v-1.5a2 2 0 1 0-4 0V18H4.5A1.5 1.5 0 0 1 3 16.5V12h1.5a2 2 0 1 0 0-4H3V6a1.5 1.5 0 0 1 1.5-1.5H9V4.5Z"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ModeAndDirectionBar({
  mode,
  direction,
  onModeChange,
  onDirectionChange,
  onSwap,
  onShuffle,
}: ModeAndDirectionBarProps) {
  const { playSelect } = useSoundEffects();

  return (
    <section
      aria-label="Game mode and direction"
      className="flex flex-col gap-3 rounded-2xl border border-edge bg-surface p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      {/* Mode switcher */}
      <div
        role="group"
        aria-label="Game mode"
        className="flex rounded-xl border border-edge bg-surface-2 p-1"
      >
        <button
          type="button"
          aria-pressed={mode === "quiz"}
          onClick={() => {
            if (mode === "quiz") return;
            playSelect();
            onModeChange("quiz");
          }}
          className={[
            "focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm",
            mode === "quiz"
              ? "bg-surface text-ink shadow-sm ring-1 ring-edge-strong"
              : "text-ink-dim hover:text-ink",
          ].join(" ")}
        >
          <ListIcon />
          Multiple-Choice Quiz
        </button>
        <button
          type="button"
          aria-pressed={mode === "match"}
          onClick={() => {
            if (mode === "match") return;
            playSelect();
            onModeChange("match");
          }}
          className={[
            "focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm",
            mode === "match"
              ? "bg-surface text-ink shadow-sm ring-1 ring-edge-strong"
              : "text-ink-dim hover:text-ink",
          ].join(" ")}
        >
          <PuzzleIcon />
          Column Match Game
        </button>
      </div>

      {/* Direction + actions */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Question direction"
          className="flex rounded-xl border border-edge bg-surface-2 p-1"
        >
          {DIRECTIONS.map((option) => {
            const isActive = option.id === direction;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  if (isActive) return;
                  playSelect();
                  onDirectionChange(option.id);
                }}
                className={[
                  "focus-ring rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3",
                  isActive
                    ? "bg-accent text-white"
                    : "text-ink-dim hover:bg-surface-3 hover:text-ink",
                ].join(" ")}
              >
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{option.short}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            playSelect();
            onSwap();
          }}
          title="Swap direction"
          aria-label="Swap direction"
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-xl border border-edge bg-surface text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
        >
          <SwapIcon />
        </button>

        <button
          type="button"
          onClick={() => {
            playSelect();
            onShuffle();
          }}
          title="Shuffle round"
          aria-label="Shuffle round"
          className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-xl border border-edge bg-surface px-3 text-xs font-medium text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
        >
          <ShuffleIcon />
          Shuffle
        </button>
      </div>
    </section>
  );
}
