/**
 * The (playful) live hypothesis test: H₀ = "just another data scientist".
 * Evidence collected while exploring the site raises a z statistic; the one-sided
 * p-value comes from the standard normal distribution. Pure functions, unit-tested.
 */

export const ALPHAS = [0.1, 0.05, 0.01, 0.001] as const;
export type Alpha = (typeof ALPHAS)[number];

/** One-sided (upper-tail) critical values of the standard normal. */
export const CRITICAL_Z: Record<Alpha, number> = {
  0.1: 1.2816,
  0.05: 1.6449,
  0.01: 2.3263,
  0.001: 3.0902,
};

export function normalPdf(z: number): number {
  return Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);
}

/** Standard normal CDF via the Abramowitz–Stegun 7.1.26 erf approximation (|error| < 1.5e-7). */
export function normalCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-x * x);
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}

/** Upper-tail p-value for an observed z. */
export function pValue(z: number): number {
  return Math.min(1, Math.max(0, 1 - normalCdf(z)));
}

export function isRejected(z: number, alpha: Alpha): boolean {
  return z >= CRITICAL_Z[alpha];
}

export interface EvidenceItem {
  id: string;
  label: string;
  /** How much this piece of evidence adds to z. */
  weight: number;
}

export function statistic(baseline: number, evidence: readonly EvidenceItem[], collected: ReadonlySet<string>): number {
  return evidence.reduce((z, item) => (collected.has(item.id) ? z + item.weight : z), baseline);
}

/** "0.34", "0.006", or "< 0.001". */
export function formatP(p: number): string {
  if (p < 0.001) return "< 0.001";
  if (p < 0.01) return p.toFixed(3);
  return p.toFixed(2);
}

export function formatAlpha(alpha: Alpha): string {
  return String(alpha);
}
