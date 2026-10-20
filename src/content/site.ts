import type { Maybe } from "@/lib/pending";

/**
 * Personal details and links — the one file to edit for contact information.
 *
 * Rules: never guess a URL. A link left as `pending(...)` is hidden in production
 * and shown as a review marker in development.
 */
export const site = {
  name: "Shaurya Agarwal",
  /** Short line under the name in the hero and in metadata. */
  tagline: "Applied data science, machine learning, and LLM systems",
  location: "Seattle, WA",
  description:
    "Portfolio of Shaurya Agarwal, an applied data scientist. Case studies on causal analysis, recommender evaluation, and an LLM research tool that cites its sources.",

  /**
   * Public URL of the deployed site, used for canonical/social metadata and the sitemap.
   * Set NEXT_PUBLIC_SITE_URL at build time once the site has a home.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  links: {
    // From the résumé supplied by the owner (Oct 2026).
    email: "shaurya2agarwal@gmail.com" as Maybe<string>,
    linkedin: "https://www.linkedin.com/in/shaurya-agarwal-14aa74235" as Maybe<string>,
    // Verified: the authenticated GitHub account that owns both project repositories.
    github: "https://github.com/Shaurya6355" as Maybe<string>,
    /** Put the PDF in /public (e.g. public/resume.pdf) and set this to "/resume.pdf". */
    resume: "/resume.pdf" as Maybe<string>,
  },
} as const;

export type SiteLinks = typeof site.links;
