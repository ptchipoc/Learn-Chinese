"use client";

import { useEffect, useReducer } from "react";
import type {
  LocalAppState,
  RoundResult,
  SubTopicProgress,
  ThemeMode,
} from "@/types/vocabulary";

/**
 * localStorage-backed app state: theme preference, sound mute flag, and
 * per-sub-topic best scores/streaks.
 *
 * Backed by a tiny module-level external store so every component that calls
 * this hook observes the same state without needing a React context provider.
 *
 * Hydration-safe: the store starts at defaults (identical to the server
 * render) and re-reads localStorage in an effect after mount.
 */

const STORAGE_KEY = "lxc-state-v1";

const DEFAULT_STATE: LocalAppState = {
  theme: "dark",
  muted: false,
  progress: {},
};

let state: LocalAppState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function readStoredState(): LocalAppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<LocalAppState>;
    return {
      theme: parsed.theme === "light" ? "light" : "dark",
      muted: Boolean(parsed.muted),
      progress: parsed.progress ?? {},
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function ensureLoaded(): void {
  if (!loaded && typeof window !== "undefined") {
    state = readStoredState();
    loaded = true;
  }
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — state still works in-memory */
  }
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function setState(next: LocalAppState): void {
  state = next;
  persist();
  emit();
}

function applyThemeToDom(theme: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

/** Read the current mute flag outside React (used by the sound synth). */
export function getMutedSnapshot(): boolean {
  ensureLoaded();
  return state.muted;
}

export interface LocalProgressApi {
  theme: ThemeMode;
  muted: boolean;
  progress: Record<string, SubTopicProgress>;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleMuted: () => void;
  setMuted: (muted: boolean) => void;
  getProgress: (subTopicId: string) => SubTopicProgress | undefined;
  recordRound: (subTopicId: string, result: RoundResult) => void;
}

export function useLocalProgress(): LocalProgressApi {
  const [, forceUpdate] = useReducer((tick: number) => tick + 1, 0);

  useEffect(() => {
    ensureLoaded();
    const listener = () => {
      applyThemeToDom(state.theme);
      forceUpdate();
    };
    listeners.add(listener);
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleTheme = () => {
    ensureLoaded();
    setState({
      ...state,
      theme: state.theme === "dark" ? "light" : "dark",
    });
  };

  const setTheme = (theme: ThemeMode) => {
    ensureLoaded();
    setState({ ...state, theme });
  };

  const toggleMuted = () => {
    ensureLoaded();
    setState({ ...state, muted: !state.muted });
  };

  const setMuted = (muted: boolean) => {
    ensureLoaded();
    setState({ ...state, muted });
  };

  const getProgress = (subTopicId: string) => state.progress[subTopicId];

  const recordRound = (subTopicId: string, result: RoundResult) => {
    ensureLoaded();
    const previous = state.progress[subTopicId] ?? {
      bestAccuracy: 0,
      bestStreak: 0,
      completedRounds: 0,
    };
    const nextProgress: SubTopicProgress = {
      bestAccuracy: Math.max(previous.bestAccuracy, Math.round(result.accuracy)),
      bestStreak: Math.max(previous.bestStreak, result.streak),
      completedRounds: previous.completedRounds + 1,
    };
    setState({
      ...state,
      progress: { ...state.progress, [subTopicId]: nextProgress },
    });
  };

  return {
    theme: state.theme,
    muted: state.muted,
    progress: state.progress,
    toggleTheme,
    setTheme,
    toggleMuted,
    setMuted,
    getProgress,
    recordRound,
  };
}
