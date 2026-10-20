import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";

import { HypothesisProvider } from "@/components/hypothesis/HypothesisProvider";
import { TestBadge } from "@/components/hypothesis/TestBadge";
import { Analytics } from "@/components/site/Analytics";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { copy } from "@/content/copy";
import { hypothesisTest, sectionEvidenceIds } from "@/content/hypothesis";
import { site } from "@/content/site";
import { getContact } from "@/lib/contact";
import { navItems } from "@/lib/nav";

import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${copy.meta.titleSuffix}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · ${copy.meta.titleSuffix}`,
    description: site.description,
    url: "/",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} · ${copy.meta.titleSuffix}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${copy.meta.titleSuffix}`,
    description: site.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const resume = getContact("resume");
  return (
    <html lang="en" className={`${interTight.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#content"
          className="sr-only z-[60] rounded-full bg-accent-strong px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          {copy.nav.skipLink}
        </a>
        <HypothesisProvider
          evidence={hypothesisTest.evidence}
          baseline={hypothesisTest.baseline}
          defaultAlpha={hypothesisTest.defaultAlpha}
          sectionIds={sectionEvidenceIds}
        >
          <Nav name={site.name} items={navItems} resumeHref={resume?.href} />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
          <TestBadge />
        </HypothesisProvider>
        <Analytics />
      </body>
    </html>
  );
}
