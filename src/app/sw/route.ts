/**
 * Serves the service worker at /sw.js.
 *
 * The worker code is generated per build from the Next.js build id so the
 * browser sees a new script (and installs a new service worker) on every
 * release. The precache list is discovered from the filesystem so nothing
 * extra is needed after `next build`.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { generateServiceWorker } from "@/pwa/serviceWorker";

function collectUrls(dir: string, base = ""): string[] {
  const abs = join(process.cwd(), dir);
  const urls: string[] = [];
  let entries;
  try {
    entries = readdirSync(abs, { withFileTypes: true });
  } catch {
    return urls;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      urls.push(...collectUrls(join(dir, entry.name), rel));
    } else if (entry.isFile()) {
      urls.push("/" + rel);
    }
  }
  return urls;
}

function buildId(): string {
  try {
    const id = readFileSync(join(process.cwd(), ".next", "BUILD_ID"), "utf8").trim();
    if (id) return id;
  } catch {
    /* dev mode: .next/BUILD_ID may not exist yet */
  }
  return `dev-${Date.now()}`;
}

export async function GET(): Promise<Response> {
  // Public files and production hashed assets (.next/static).
  const urls = collectUrls("public").concat(collectUrls(".next/static"));
  urls.push("/", "/offline");

  const script = generateServiceWorker(buildId(), urls.sort());
  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
