/**
 * Service worker code generator.
 *
 * The worker is generated as JavaScript on the server by the `/sw.js` route
 * (app/sw.js/route.ts). It receives:
 *   - version:      the Next.js build id, bumped on every `next build`.
 *   - precache:     absolute root-relative URLs the worker downloads at install
 *                   time (hashed static assets of the app).
 *
 * Strategy summary:
 *   install:    download all precache entries (network), skipWaiting().
 *   activate:   clients.claim(), record the cache name, prune stale caches.
 *   fetch:
 *     - navigation requests: network-first, then precache, then the cached
 *       entry from the previous build, then the offline fallback page.
 *     - same-origin asset requests: precache cache-first (hashed assets are
 *       immutable), otherwise network with a stale-while-revalidate runtime
 *       cache; failures fall back to the stale entry instead of erroring.
 *     - cross-origin requests: untouched (never cached).
 */

export function generateServiceWorker(version: string, precache: string[]): string {
  return `"use strict";
(() => {
  const VERSION = ${JSON.stringify(version)};
  const PRECACHE = ${JSON.stringify(precache)};
  const PRECACHE_BASE = "pwa-precache-";
  const PREVIOUS_KEY = "pwa-last-precache";
  const RUNTIME_CACHE = "pwa-runtime";

  const isNavigation = (request) =>
    request.mode === "navigate" ||
    request.destination === "" ||
    request.destination === "document";
  const rootPath = (url) => new URL(url).pathname || "/";

  const open = (name) => caches.open(name).catch(() => null);
  const precacheNames = () =>
    caches.keys().then((names) => names.filter((n) => n.startsWith(PRECACHE_BASE)));
  const readPrevious = () => {
    try {
      return localStorage.getItem(PREVIOUS_KEY);
    } catch (e) {
      return null;
    }
  };
  const readAssets = (cache, url) =>
    cache.match(new Request(url)).catch(() => null);

  self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        const cache = await open(PRECACHE_BASE + VERSION);
        if (!cache) throw new Error("sw: cannot open precache");
        for (const url of PRECACHE) {
          const request = new Request(url, { cache: "reload" });
          const response = await fetch(request).catch(() => null);
          if (!response || response.status < 200 || response.status >= 300) {
            throw new Error("sw: failed to cache " + url);
          }
          await cache.put(request, response.clone());
        }
        // A version without the entry shell could never work offline.
        const shell = await readAssets(cache, "/");
        if (!shell) throw new Error("sw: entry shell missing from precache");
        self.skipWaiting();
      })(),
    );
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        try {
          localStorage.setItem(PREVIOUS_KEY, PRECACHE_BASE + VERSION);
        } catch (e) {
          /* best effort */
        }
        const current = PRECACHE_BASE + VERSION;
        const previous = readPrevious();
        for (const name of await precacheNames()) {
          if (name === current || name === previous) continue;
          await caches.delete(name).catch(() => null);
        }
        await self.clients.claim();
      })(),
    );
  });

  self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET" && request.method !== "HEAD") return;
    if (request.mode === "navigate") {
      event.respondWith(navigateToOffline(request));
      return;
    }
    if (new URL(request.url).origin !== location.origin) return; // never cache cross-origin
    event.respondWith(assetStrategy(request));
  });

  async function navigateToOffline(request) {
    const url = rootPath(request.url);
    const offlinePath = "/offline";
    const runtime = await open(RUNTIME_CACHE);
    // Network first (fresh HTML while online); store a copy for later fallbacks.
    const network = await fetch(request).catch(() => null);
    if (network && network.ok && network.status !== 404) {
      if (runtime) runtime.put(request, network.clone()).catch(() => null);
      return network;
    }
    // Try the versioned precache, then the previous version's cache.
    for (const name of [PRECACHE_BASE + VERSION, readPrevious()].filter(Boolean)) {
      const cache = await open(name);
      const match = cache && (await readAssets(cache, url));
      if (match) return match;
    }
    // Fallback: the offline page itself (any cache).
    if (runtime) {
      const cached = await runtime
        .match(new Request(offlinePath, { cache: "reload" }))
        .catch(() => null);
      if (cached) return cached;
    }
    for (const name of [PRECACHE_BASE + VERSION, readPrevious()].filter(Boolean)) {
      const cache = await open(name);
      const match = cache && (await readAssets(cache, offlinePath));
      if (match) return match;
    }
    return new Response(
      "<!DOCTYPE html><title>Offline</title><p>You are offline and this route is not cached. Visit the app first while you are online.</p>",
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  async function assetStrategy(request) {
    const url = rootPath(request.url);
    // Precache first: hashed same-origin assets are immutable per build.
    for (const name of [PRECACHE_BASE + VERSION, readPrevious()].filter(Boolean)) {
      const cache = await open(name);
      const match = cache && (await readAssets(cache, url));
      if (match) return match;
    }
    // Network (cached clone into the runtime cache for later fallback).
    const network = await fetch(request).catch(() => null);
    if (network && network.ok) {
      const runtime = await open(RUNTIME_CACHE);
      if (runtime) runtime.put(request, network.clone()).catch(() => null);
      return network;
    }
    // Stale-while-revalidate: prefer older cached response over failure.
    const runtime = await open(RUNTIME_CACHE);
    if (runtime) {
      const cached = await runtime.match(new Request(url)).catch(() => null);
      if (cached) return cached;
    }
    // Last resort from any previous precache.
    for (const name of [PRECACHE_BASE + VERSION, readPrevious()].filter(Boolean)) {
      const cache = await open(name);
      const match = cache && (await readAssets(cache, url));
      if (match) return match;
    }
    return new Response("Not found", { status: 404 });
  }
})();
`;
}
