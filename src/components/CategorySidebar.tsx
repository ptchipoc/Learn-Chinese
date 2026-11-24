"use client";

import type { VocabCategory } from "@/types/vocabulary";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface CategorySidebarProps {
  categories: VocabCategory[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  /**
   * "rail" — sticky desktop sidebar column.
   * "strip" — horizontal scroller for small screens (< lg).
   */
  variant: "rail" | "strip";
}

function totalTerms(category: VocabCategory): number {
  // Unique ids: the "All Mixed" sub-topic re-aggregates the same terms.
  const ids = new Set(category.subTopics.flatMap((sub) => sub.terms.map((t) => t.id)));
  return ids.size;
}

function ComingSoonBadge({ className }: { className?: string }) {
  return (
    <span
      aria-disabled
      className={
        className ??
        "inline-block shrink-0 cursor-default rounded-full border border-dashed border-edge px-3 py-1.5 text-xs font-medium text-ink-faint"
      }
      title={"Food & Dining, Travel & Directions, and more are on the way"}
    >
      More categories coming soon
    </span>
  );
}

export default function CategorySidebar({
  categories,
  activeCategoryId,
  onCategoryChange,
  variant,
}: CategorySidebarProps) {
  const { playSelect } = useSoundEffects();

  const select = (categoryId: string) => {
    if (categoryId === activeCategoryId) return;
    playSelect();
    onCategoryChange(categoryId);
  };

  /* ------------------------------ Rail (desktop) ------------------------------ */
  if (variant === "rail") {
    return (
      <aside
        aria-label="Vocabulary categories"
        className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-edge bg-surface/40 px-4 py-5 lg:flex"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          Categories
        </p>

        <nav className="mt-3 flex flex-col gap-1.5">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => select(category.id)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "focus-ring flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                  isActive
                    ? "border-accent bg-accent text-white shadow-[0_0_0_1px_var(--accent)]"
                    : "border-transparent text-ink-dim hover:bg-surface-2 hover:text-ink",
                ].join(" ")}
              >
                <span className="flex items-center gap-2 text-sm font-medium leading-tight">
                  <svg
                    viewBox="0 0 16 16"
                    className={[
                      "h-3.5 w-3.5 shrink-0",
                      isActive ? "text-white" : "text-ink-faint",
                    ].join(" ")}
                    fill="none"
                    aria-hidden
                  >
                    <rect
                      x="2.5"
                      y="2.5"
                      width="4.5"
                      height="4.5"
                      rx="1.2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="9"
                      y="9"
                      width="4.5"
                      height="4.5"
                      rx="1.2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="9"
                      y="2.5"
                      width="4.5"
                      height="4.5"
                      rx="1.2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {category.title}
                </span>
                <span
                  className={[
                    "pl-5.5 text-[11px]",
                    isActive ? "text-white/75" : "text-ink-faint",
                  ].join(" ")}
                >
                  {totalTerms(category)} terms · {category.subTopics.length} topics
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4">
          <ComingSoonBadge className="flex cursor-default items-start rounded-xl border border-dashed border-edge px-3 py-2.5 text-xs font-medium leading-snug text-ink-faint" />
        </div>

        <div className="mt-auto pt-6">
          <p className="border-t border-edge pt-4 text-[11px] leading-relaxed text-ink-faint">
            New top-level categories land here — switching keeps your saved scores
            per sub-topic.
          </p>
        </div>
      </aside>
    );
  }

  /* ------------------------------ Strip (mobile) ------------------------------ */
  return (
    <nav
      aria-label="Vocabulary categories"
      className="flex items-center gap-2 overflow-x-auto border-b border-edge bg-canvas px-4 py-2.5 no-scrollbar lg:hidden"
    >
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
        Categories
      </span>
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => select(category.id)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "focus-ring shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "border-accent bg-accent text-white"
                : "border-edge bg-surface text-ink-dim hover:border-edge-strong hover:text-ink",
            ].join(" ")}
          >
            {category.title}
          </button>
        );
      })}
      <ComingSoonBadge className="shrink-0 cursor-default rounded-full border border-dashed border-edge px-3 py-1.5 text-xs font-medium text-ink-faint" />
    </nav>
  );
}
