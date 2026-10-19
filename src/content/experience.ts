import { pending, type Maybe } from "@/lib/pending";

/**
 * Experience and education.
 *
 * Only the organization names below were supplied by the site owner. Titles, dates,
 * locations and highlights are deliberately left as `pending(...)` until they can be
 * copied from the résumé — nothing here is invented. Pending fields are hidden in
 * production; an entry whose organization is pending is hidden entirely.
 */
export interface ExperienceEntry {
  id: string;
  organization: Maybe<string>;
  title: Maybe<string>;
  period: Maybe<string>;
  location?: Maybe<string>;
  /** One or two sentences in plain language. */
  summary?: Maybe<string>;
  highlights?: Maybe<string[]>;
}

export const experience: ExperienceEntry[] = [
  {
    id: "wells-fargo",
    organization: "Wells Fargo",
    title: pending("Job title at Wells Fargo"),
    period: pending("Dates, e.g. Jun 2025 – Present"),
    location: pending("Location (optional)"),
    summary: pending("One-sentence summary of the role, from your résumé"),
    highlights: pending("2–3 résumé bullets you're comfortable making public"),
  },
  {
    id: "morgan-stanley",
    organization: "Morgan Stanley",
    title: pending("Job title at Morgan Stanley"),
    period: pending("Dates"),
    location: pending("Location (optional)"),
    summary: pending("One-sentence summary of the role, from your résumé"),
    highlights: pending("2–3 résumé bullets you're comfortable making public"),
  },
];

export const education: ExperienceEntry[] = [
  {
    id: "education",
    organization: pending("University name"),
    title: pending("Degree and field"),
    period: pending("Graduation year"),
  },
];
