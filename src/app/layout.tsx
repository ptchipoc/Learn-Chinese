import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OfflineIndicator from "@/components/OfflineIndicator";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinyin Practice — Chinese Vocabulary in Pinyin & English",
  description:
    "Practice Chinese vocabulary using only Pinyin and English. Quizzes, matching games, and study sheets — no Chinese characters.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Learn Chinese",
  },
  formatDetection: { telephone: false },
};

/**
 * Applies the persisted theme (from useLocalProgress / localStorage) before
 * first paint to avoid a flash of the wrong canvas color. The key and shape
 * must stay in sync with src/hooks/useLocalProgress.ts.
 */
const themeBootstrap = `(function(){try{var raw=localStorage.getItem("lxc-state-v1");var theme="dark";if(raw){var s=JSON.parse(raw);if(s&&s.theme==="light")theme="light";}var root=document.documentElement;root.classList.toggle("dark",theme==="dark");root.style.colorScheme=theme;}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <ServiceWorkerRegistration />
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
