import type { ScoredExample } from "@/lib/metrics";

/**
 * Synthetic data for the threshold explorer. Illustrative only — not output from
 * any real model and unrelated to any professional work.
 *
 * Scenario: a spam filter has scored 40 emails between 0 and 1. Sixteen are
 * actually spam, twenty-four are not. The scores were written by hand (fixed,
 * deterministic, two decimals) so the two groups overlap the way real classifier
 * scores do: most spam scores high, most real email scores low, and a handful
 * of each sit in the ambiguous middle.
 */
const spamScores = [
  0.97, 0.94, 0.91, 0.88, 0.86, 0.83, 0.79, 0.76, 0.72, 0.68, 0.63, 0.57, 0.51, 0.44, 0.36, 0.27,
];

const legitimateScores = [
  0.81, 0.69, 0.62, 0.58, 0.53, 0.47, 0.42, 0.39, 0.35, 0.31, 0.28, 0.25, 0.22, 0.19, 0.17, 0.14,
  0.12, 0.1, 0.08, 0.07, 0.05, 0.04, 0.03, 0.02,
];

export const spamSample: readonly ScoredExample[] = [
  ...spamScores.map((score, i) => ({ id: `S${String(i + 1).padStart(2, "0")}`, score, positive: true })),
  ...legitimateScores.map((score, i) => ({
    id: `R${String(i + 1).padStart(2, "0")}`,
    score,
    positive: false,
  })),
];

export const DEFAULT_THRESHOLD = 0.5;

export const thresholdPresets = [
  { label: "Catch more spam", threshold: 0.3 },
  { label: "Balanced", threshold: 0.5 },
  { label: "Protect real email", threshold: 0.8 },
] as const;
