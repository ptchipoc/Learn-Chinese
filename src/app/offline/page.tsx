import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-ink sm:text-3xl">You are offline</h1>
      <p className="max-w-md text-sm text-ink-dim">
        The app is running, but some resources need a connection. Pages you have visited are
        available again as soon as you are back online.
      </p>
      <Link
        href="/"
        className="focus-ring rounded-lg border border-edge bg-surface-2 px-4 py-2 text-sm font-medium text-ink hover:border-edge-strong"
      >
        Return to the app
      </Link>
    </main>
  );
}
