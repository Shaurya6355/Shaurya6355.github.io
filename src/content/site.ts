import { pending, type Maybe } from "@/lib/pending";

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
  description:
    "Shaurya Agarwal — applied data scientist. Case studies in causal analysis, recommender systems evaluation, and evidence-grounded LLM systems.",

  /**
   * Public URL of the deployed site, used for canonical/social metadata and the sitemap.
   * Set NEXT_PUBLIC_SITE_URL at build time once the site has a home.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  links: {
    email: pending("Email address to publish (e.g. the one in your git config)") as Maybe<string>,
    linkedin: pending("LinkedIn profile URL") as Maybe<string>,
    // Verified: the authenticated GitHub account that owns both project repositories.
    github: "https://github.com/Shaurya6355" as Maybe<string>,
    /** Put the PDF in /public (e.g. public/resume.pdf) and set this to "/resume.pdf". */
    resume: pending("Résumé PDF — add public/resume.pdf and set this to \"/resume.pdf\"") as Maybe<string>,
  },
} as const;

export type SiteLinks = typeof site.links;
