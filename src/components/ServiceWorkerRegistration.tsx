"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    // "reloadPagesOnServiceWorkerUpdate" would force a reload on update;
    // the default (claim on activate) keeps the session running and picks
    // the new build up on the next navigation.
    navigator.serviceWorker.register("/sw").catch(() => {
      /* Offline support is best effort; the app works without it. */
    });
  }, []);
  return null;
}
