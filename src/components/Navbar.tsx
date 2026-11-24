"use client";

import { useLocalProgress } from "@/hooks/useLocalProgress";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface NavbarProps {
  onOpenReference: () => void;
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function SpeakerOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4h3l4 3.5v-15L7 6H4Z" />
      <path strokeLinecap="round" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4h3l4 3.5v-15L7 6H4Z" />
      <path strokeLinecap="round" d="m15.5 9.5 5 5m0-5-5 5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19.5A2.5 2.5 0 0 1 7.5 17H19" />
    </svg>
  );
}

export default function Navbar({ onOpenReference }: NavbarProps) {
  const { theme, toggleTheme, muted, toggleMuted } = useLocalProgress();
  const { playSelect } = useSoundEffects();

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-canvas/90 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-edge bg-surface-2 text-accent"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M4 18c3.5-1 5-4 5-7.5S7 4.5 4.5 4.5c0 4 1.5 7 4.5 9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M13.5 18c3.5-1 5.5-4.5 5.5-8s-2.5-5.5-5-5.5c0 4.5 2 7.5 5 9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path d="M13 20.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-ink">Learn Chinese</p>
            <p className="hidden text-[11px] text-ink-faint sm:block">
              Vocabulary in Pinyin &amp; English only
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              playSelect();
              onOpenReference();
            }}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-edge bg-surface px-2.5 py-2 text-xs font-medium text-ink-dim transition-colors hover:border-edge-strong hover:text-ink sm:px-3"
          >
            <BookIcon />
            <span className="hidden sm:inline">Study Reference</span>
            <span className="sm:hidden">Study</span>
          </button>

          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={muted}
            aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
            title={muted ? "Sound off" : "Sound on"}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-edge bg-surface text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
          >
            {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-edge bg-surface text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
