import type { Maybe } from "@/lib/pending";

/**
 * Experience, education and teaching — from the owner's résumé (public/resume.pdf, Oct 2026).
 * Owner's decision: employer figures (percentages, counts, volumes) stay in the résumé only —
 * the website describes the work qualitatively. Internal product and team names are genericized.
 * Pending fields are hidden in production; an entry whose organization is pending is hidden entirely.
 */
export interface ExperienceEntry {
  id: string;
  organization: Maybe<string>;
  title: Maybe<string>;
  period?: Maybe<string>;
  location?: Maybe<string>;
  /** Small line under the title, e.g. a promotion. */
  note?: string;
  /** One or two sentences in plain language. */
  summary?: Maybe<string>;
  highlights?: Maybe<string[]>;
}

export const experience: ExperienceEntry[] = [
  {
    id: "wells-fargo",
    organization: "Wells Fargo",
    title: "Quantitative Analytics Specialist, Data Science",
    period: "Jul 2024 to Aug 2026",
    location: "Bengaluru, India",
    note: "Promoted from Program Associate, Jul 2025",
    highlights: [
      "Developed semantic search and retrieval evaluation for an Elasticsearch-powered RAG assistant used by bankers nationwide, replacing keyword-based procedure lookup and reducing procedure-related call volume after national rollout.",
      "Estimated the causal effect of branch closures on in-branch and digital account openings against comparable still-open branches, using channel-specific T-learner uplift models (ATT) on block-group and CBSA features.",
      "Built the national branch network simulator that scores the network quarterly and forecasts account-opening loss for any candidate closure with gradient-boosted regression, backtested against realized outcomes and adopted by the branch network team.",
      "Led the team that measured the brokerage-balance lift for enrollees in an in-app goal-planning feature, using propensity score matching against comparable non-enrollees.",
      "Improved the hit rate of branch field visits by rebuilding a branch dissatisfaction index, forecasting six-month employee churn with a Cox proportional hazards model on sentiment and topic-model features from survey free text.",
    ],
  },
  {
    id: "morgan-stanley",
    organization: "Morgan Stanley",
    title: "Data Science Intern, Legal & Compliance",
    period: "Feb 2024 to Jun 2024",
    location: "Mumbai, India",
    highlights: [
      "Stress-tested a developmental XGBoost insider-trading model built on client trading-behavior signals, documenting its detection coverage and failure modes across constructed test scenarios.",
      "Reduced false-positive alerts in manual compliance review by tuning detection thresholds that the surveillance team adopted into live monitoring across EMEA and APAC typologies.",
      "Automated weekly regression checks by replaying historical trade data through the surveillance platform, extending coverage with synthetic scenarios.",
    ],
  },
];

export const education: ExperienceEntry[] = [
  {
    id: "uw",
    organization: "University of Washington",
    title: "M.S. in Data Science",
    period: "Sep 2026 to Jun 2028 (expected)",
    location: "Seattle, WA",
  },
  {
    id: "bits",
    organization: "BITS Pilani, K. K. Birla Goa Campus",
    title: "B.E. in Computer Science, minor in Data Science",
    period: "Aug 2020 to Jun 2024",
    location: "Goa, India",
  },
];

export const teaching: ExperienceEntry[] = [
  {
    id: "bits-teaching",
    organization: "BITS Pilani",
    title: "Teaching Assistant and Machine Learning Club Instructor",
    summary:
      "Teaching assistant for Principles of Programming Languages (a cohort of 200) and instructor at the campus Machine Learning Club (~50 students), designing and delivering ML and deep learning lectures and labs.",
  },
];
