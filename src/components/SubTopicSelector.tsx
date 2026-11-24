"use client";

import type { SubTopic, SubTopicProgress } from "@/types/vocabulary";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface SubTopicSelectorProps {
  subTopics: SubTopic[];
  activeSubTopicId: string;
  onSelect: (subTopicId: string) => void;
  progressBySubTopic: Record<string, SubTopicProgress | undefined>;
}

function ProgressBadge({ progress }: { progress: SubTopicProgress }) {
  if (progress.completedRounds === 0) return null;
  return (
    <span
      title={`Best ${progress.bestAccuracy}% · best streak ${progress.bestStreak} · ${progress.completedRounds} round${progress.completedRounds === 1 ? "" : "s"}`}
      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-good-soft px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-good"
    >
      {progress.bestAccuracy}%
    </span>
  );
}

export default function SubTopicSelector({
  subTopics,
  activeSubTopicId,
  onSelect,
  progressBySubTopic,
}: SubTopicSelectorProps) {
  const { playSelect } = useSoundEffects();

  return (
    <section aria-label="Sub-topics">
      <div className="flex items-baseline justify-between gap-3 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          Choose a sub-topic
        </h2>
        <span className="text-xs text-ink-faint">{subTopics.length} topics</span>
      </div>

      <div
        role="tablist"
        aria-label="Sub-topics"
        className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {subTopics.map((subTopic) => {
          const isActive = subTopic.id === activeSubTopicId;
          const progress = progressBySubTopic[subTopic.id];
          const isMixed = subTopic.id.endsWith("-mixed");
          return (
            <button
              key={subTopic.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => {
                if (isActive) return;
                playSelect();
                onSelect(subTopic.id);
              }}
              className={[
                "focus-ring group flex shrink-0 snap-start items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all",
                isActive
                  ? "border-accent bg-accent-soft shadow-[0_0_0_1px_var(--accent)]"
                  : "border-edge bg-surface hover:border-edge-strong hover:bg-surface-2",
              ].join(" ")}
            >
              <span className="flex flex-col">
                <span
                  className={[
                    "flex items-center gap-1.5 text-sm font-medium leading-tight",
                    isActive ? "text-ink" : "text-ink-dim group-hover:text-ink",
                  ].join(" ")}
                >
                  {isMixed && (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent" fill="none" aria-hidden>
                      <path
                        d="M2 4h5l2 4h5M2 12h5l2-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {subTopic.title}
                </span>
                <span className="mt-0.5 text-[11px] text-ink-faint">
                  {subTopic.terms.length} term{subTopic.terms.length === 1 ? "" : "s"}
                </span>
              </span>
              {progress && <ProgressBadge progress={progress} />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
