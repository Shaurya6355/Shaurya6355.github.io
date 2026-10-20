/**
 * Binary-classification metrics at a decision threshold.
 * Pure functions so the threshold explorer's numbers are unit-tested.
 */
export interface ScoredExample {
  id: string;
  /** Model score in [0, 1]; higher means "more likely positive". */
  score: number;
  /** Ground truth. */
  positive: boolean;
}

export type Outcome = "tp" | "fp" | "fn" | "tn";

export interface Confusion {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
}

export interface ThresholdMetrics extends Confusion {
  threshold: number;
  predictedPositive: number;
  actualPositive: number;
  total: number;
  /** null when nothing is predicted positive: precision is undefined, not 0 or 1. */
  precision: number | null;
  /** null when the data has no actual positives. */
  recall: number | null;
  /** Share of actual negatives wrongly flagged; null when there are no negatives. */
  falsePositiveRate: number | null;
  accuracy: number | null;
}

/** An example is predicted positive when its score is at or above the threshold. */
export function predict(score: number, threshold: number): boolean {
  return score >= threshold;
}

export function outcomeOf(example: ScoredExample, threshold: number): Outcome {
  const flagged = predict(example.score, threshold);
  if (flagged) return example.positive ? "tp" : "fp";
  return example.positive ? "fn" : "tn";
}

export function confusionAt(data: readonly ScoredExample[], threshold: number): Confusion {
  const counts: Confusion = { tp: 0, fp: 0, fn: 0, tn: 0 };
  for (const example of data) counts[outcomeOf(example, threshold)] += 1;
  return counts;
}

function ratio(numerator: number, denominator: number): number | null {
  return denominator === 0 ? null : numerator / denominator;
}

export function metricsAt(data: readonly ScoredExample[], threshold: number): ThresholdMetrics {
  const c = confusionAt(data, threshold);
  const predictedPositive = c.tp + c.fp;
  const actualPositive = c.tp + c.fn;
  const total = data.length;
  return {
    ...c,
    threshold,
    predictedPositive,
    actualPositive,
    total,
    precision: ratio(c.tp, predictedPositive),
    recall: ratio(c.tp, actualPositive),
    falsePositiveRate: ratio(c.fp, c.fp + c.tn),
    accuracy: ratio(c.tp + c.tn, total),
  };
}

/** Format a proportion as a whole-number percentage, or "n/a" when undefined. */
export function formatRate(value: number | null): string {
  return value === null ? "n/a" : `${Math.round(value * 100)}%`;
}
