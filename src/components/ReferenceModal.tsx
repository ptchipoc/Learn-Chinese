"use client";

import { useEffect } from "react";
import type { SubTopic } from "@/types/vocabulary";

interface ReferenceModalProps {
  open: boolean;
  onClose: () => void;
  categoryTitle: string;
  subTopic: SubTopic;
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5" aria-hidden>
      <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export default function ReferenceModal({
  open,
  onClose,
  categoryTitle,
  subTopic,
}: ReferenceModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Study reference: ${subTopic.title}`}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="anim-pop relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-edge bg-surface shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-edge px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Study reference · {categoryTitle}
            </p>
            <h2 className="mt-0.5 truncate text-lg font-semibold text-ink">
              {subTopic.title}
            </h2>
            <p className="mt-0.5 text-xs text-ink-faint">
              {subTopic.terms.length} term{subTopic.terms.length === 1 ? "" : "s"} · Pinyin &amp;
              English only
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close study reference"
            autoFocus
            className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-edge bg-surface-2 text-ink-dim transition-colors hover:border-edge-strong hover:text-ink"
          >
            <XIcon />
          </button>
        </div>

        {/* Term list */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {subTopic.description && (
            <p className="mb-3 text-sm leading-relaxed text-ink-dim">
              {subTopic.description}
            </p>
          )}

          <ol className="space-y-2.5">
            {subTopic.terms.map((term, index) => (
              <li
                key={term.id}
                className="anim-fade-up rounded-xl border border-edge bg-surface-2 px-4 py-3"
                style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="flex items-baseline gap-2.5">
                    <span className="w-5 shrink-0 text-[11px] tabular-nums text-ink-faint">
                      {index + 1}
                    </span>
                    <span className="text-lg font-semibold leading-snug text-ink">
                      {term.pinyin}
                    </span>
                  </span>
                  <span className="pl-7.5 text-sm text-ink-dim sm:pl-0">{term.english}</span>
                </div>
                <p className="mt-1.5 border-t border-edge/70 pt-1.5 pl-7.5 text-xs leading-relaxed text-ink-faint">
                  <span className="font-semibold uppercase tracking-wide text-warn">Tip </span>
                  {term.tip}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
        <div className="border-t border-edge px-5 py-3 text-center text-[11px] text-ink-faint sm:px-6">
          Press <kbd className="rounded border border-edge bg-surface-2 px-1 py-0.5 font-mono">Esc</kbd>{" "}
          to close
        </div>
      </div>
    </div>
  );
}
