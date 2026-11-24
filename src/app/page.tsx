"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import type { DirectionMode, RoundResult } from "@/types/vocabulary";
import {
  categories,
  defaultCategoryId,
  getCategoryById,
  getSubTopic,
} from "@/data/categories";
import { useLocalProgress } from "@/hooks/useLocalProgress";
import Navbar from "@/components/Navbar";
import CategorySidebar from "@/components/CategorySidebar";
import SubTopicSelector from "@/components/SubTopicSelector";
import ModeAndDirectionBar from "@/components/ModeAndDirectionBar";
import ReferenceModal from "@/components/ReferenceModal";

/**
 * Game engines are client-only (`ssr: false`): their rounds are randomized on
 * mount, which must never run during the deterministic prerender pass.
 */
const QuizGame = dynamic(() => import("@/components/QuizGame"), {
  ssr: false,
  loading: () => <GameLoading label="Preparing quiz round…" />,
});

const MatchGame = dynamic(() => import("@/components/MatchGame"), {
  ssr: false,
  loading: () => <GameLoading label="Preparing match board…" />,
});

function GameLoading({ label }: { label: string }) {
  return (
    <div
      aria-busy
      aria-label={label}
      className="anim-pulse mx-auto w-full max-w-2xl rounded-2xl border border-edge bg-surface p-8"
    >
      <div className="h-3 w-28 rounded bg-surface-3" />
      <div className="mt-4 h-8 w-3/4 rounded-lg bg-surface-3" />
      <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-surface-2" />
        ))}
      </div>
    </div>
  );
}

type GameMode = "quiz" | "match";

function swapDirection(direction: DirectionMode): DirectionMode {
  if (direction === "en-to-pinyin") return "pinyin-to-en";
  if (direction === "pinyin-to-en") return "en-to-pinyin";
  return "en-to-pinyin";
}

export default function Home() {
  const { progress, recordRound } = useLocalProgress();

  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [subTopicId, setSubTopicId] = useState(
    () => getCategoryById(defaultCategoryId).subTopics[0].id,
  );
  const [mode, setMode] = useState<GameMode>("quiz");
  const [direction, setDirection] = useState<DirectionMode>("en-to-pinyin");
  const [roundKey, setRoundKey] = useState(0);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const category = getCategoryById(categoryId);
  const subTopic = getSubTopic(category, subTopicId);

  const bumpRound = useCallback(() => setRoundKey((key) => key + 1), []);

  const handleCategoryChange = useCallback(
    (nextCategoryId: string) => {
      const nextCategory = getCategoryById(nextCategoryId);
      setCategoryId(nextCategory.id);
      setSubTopicId(nextCategory.subTopics[0].id);
      bumpRound();
    },
    [bumpRound],
  );

  const handleSubTopicChange = useCallback(
    (nextSubTopicId: string) => {
      setSubTopicId(nextSubTopicId);
      bumpRound();
    },
    [bumpRound],
  );

  const handleDirectionChange = useCallback(
    (nextDirection: DirectionMode) => {
      setDirection(nextDirection);
      bumpRound();
    },
    [bumpRound],
  );

  const handleSwap = useCallback(() => {
    setDirection((current) => swapDirection(current));
    bumpRound();
  }, [bumpRound]);

  const handleFinish = useCallback(
    (result: RoundResult) => {
      recordRound(subTopic.id, result);
    },
    [recordRound, subTopic.id],
  );

  const subTopicProgress = progress[subTopic.id];

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      {/* Top-level categories live in the sidebar (rail on desktop, strip on mobile) */}
      <CategorySidebar
        variant="rail"
        categories={categories}
        activeCategoryId={category.id}
        onCategoryChange={handleCategoryChange}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenReference={() => setReferenceOpen(true)} />

        <CategorySidebar
          variant="strip"
          categories={categories}
          activeCategoryId={category.id}
          onCategoryChange={handleCategoryChange}
        />

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 pb-16 pt-6 sm:px-6">
          {/* Workspace header */}
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                {category.title}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {subTopic.title}
              </h1>
              {subTopic.description && (
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-dim">
                  {subTopic.description}
                </p>
              )}
            </div>
  
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-lg border border-edge bg-surface px-2.5 py-1.5 font-medium text-ink-dim">
                {subTopic.terms.length} terms
              </span>
              {subTopicProgress && subTopicProgress.completedRounds > 0 && (
                <>
                  <span className="rounded-lg border border-good/40 bg-good-soft px-2.5 py-1.5 font-medium text-good">
                    Best {subTopicProgress.bestAccuracy}%
                  </span>
                  <span className="rounded-lg border border-warn/40 bg-warn-soft px-2.5 py-1.5 font-medium text-warn">
                    Streak {subTopicProgress.bestStreak}
                  </span>
                  <span className="rounded-lg border border-edge bg-surface px-2.5 py-1.5 font-medium text-ink-dim">
                    {subTopicProgress.completedRounds} round
                    {subTopicProgress.completedRounds === 1 ? "" : "s"} played
                  </span>
                </>
              )}
            </div>
          </section>
  
          <SubTopicSelector
            subTopics={category.subTopics}
            activeSubTopicId={subTopic.id}
            onSelect={handleSubTopicChange}
            progressBySubTopic={progress}
          />
  
          <ModeAndDirectionBar
            mode={mode}
            direction={direction}
            onModeChange={setMode}
            onDirectionChange={handleDirectionChange}
            onSwap={handleSwap}
            onShuffle={bumpRound}
          />
  
          <section aria-label="Game area" className="pt-1">
            {mode === "quiz" ? (
              <QuizGame
                key={`quiz-${roundKey}`}
                terms={subTopic.terms}
                direction={direction}
                subTopicTitle={subTopic.title}
                onFinish={handleFinish}
                onRestart={bumpRound}
              />
            ) : (
              <MatchGame
                key={`match-${roundKey}`}
                terms={subTopic.terms}
                direction={direction}
                subTopicTitle={subTopic.title}
                onFinish={handleFinish}
                onRestart={bumpRound}
              />
            )}
          </section>
        </main>

        <footer className="border-t border-edge px-4 py-4 text-center text-[11px] text-ink-faint sm:px-6">
          Practice Chinese vocabulary with Pinyin &amp; English only — no Chinese
          characters anywhere. Progress is saved in your browser.
        </footer>
      </div>

      <ReferenceModal
        open={referenceOpen}
        onClose={() => setReferenceOpen(false)}
        categoryTitle={category.title}
        subTopic={subTopic}
      />
    </div>
  );
}
