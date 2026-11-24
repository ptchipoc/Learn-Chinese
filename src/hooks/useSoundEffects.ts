"use client";

import { getMutedSnapshot } from "./useLocalProgress";

/**
 * Web Audio API synth for subtle UI chimes — no external audio assets.
 * Respects the globally persisted mute flag from useLocalProgress.
 */

type SoundName = "correct" | "wrong" | "match" | "fanfare" | "select";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    try {
      audioContext = new Ctor();
    } catch {
      return null;
    }
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

interface ToneOptions {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

function playTone({
  freq,
  start,
  duration,
  type = "sine",
  gain = 0.12,
}: ToneOptions): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

  const at = ctx.currentTime + start;
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(gain, at + 0.015);
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  oscillator.connect(envelope);
  envelope.connect(ctx.destination);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.03);
}

function playSound(name: SoundName): void {
  if (getMutedSnapshot()) return;

  switch (name) {
    case "correct":
      playTone({ freq: 659.25, start: 0, duration: 0.12, type: "sine", gain: 0.14 });
      playTone({ freq: 783.99, start: 0.09, duration: 0.16, type: "sine", gain: 0.14 });
      break;
    case "wrong":
      playTone({ freq: 196, start: 0, duration: 0.14, type: "triangle", gain: 0.13 });
      playTone({ freq: 155, start: 0.1, duration: 0.2, type: "triangle", gain: 0.11 });
      break;
    case "match":
      playTone({ freq: 880, start: 0, duration: 0.1, type: "triangle", gain: 0.1 });
      playTone({ freq: 1174.66, start: 0.06, duration: 0.14, type: "sine", gain: 0.09 });
      break;
    case "fanfare": {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        playTone({
          freq,
          start: i * 0.11,
          duration: 0.22,
          type: "sine",
          gain: 0.12,
        });
      });
      playTone({ freq: 1318.51, start: 0.44, duration: 0.4, type: "sine", gain: 0.1 });
      break;
    }
    case "select":
      playTone({ freq: 1046.5, start: 0, duration: 0.05, type: "sine", gain: 0.06 });
      break;
  }
}

export interface SoundEffectsApi {
  playCorrect: () => void;
  playWrong: () => void;
  playMatch: () => void;
  playFanfare: () => void;
  playSelect: () => void;
}

/** Stable singleton: every call site shares the same harmless callbacks. */
const soundEffects: SoundEffectsApi = {
  playCorrect: () => playSound("correct"),
  playWrong: () => playSound("wrong"),
  playMatch: () => playSound("match"),
  playFanfare: () => playSound("fanfare"),
  playSelect: () => playSound("select"),
};

export function useSoundEffects(): SoundEffectsApi {
  return soundEffects;
}
