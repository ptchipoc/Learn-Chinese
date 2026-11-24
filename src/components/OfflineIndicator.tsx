"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const onOnline = () => onChange();
  const onOffline = () => onChange();
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);
  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}

const getServerSnapshot = () => true;

function getSnapshot() {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

/**
 * Discrete offline indicator (bottom center, no design impact when online).
 */
export default function OfflineIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (isOnline) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 z-40 -translate-x-1/2 rounded-full border border-edge bg-surface-2 px-3.5 py-1.5 text-xs font-medium text-ink shadow-md"
      style={{ left: "50%" }}
    >
      You are offline — viewing saved content
    </div>
  );
}
