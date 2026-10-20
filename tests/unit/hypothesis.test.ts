import { describe, expect, it } from "vitest";

import { hypothesisTest, sectionEvidenceIds } from "@/content/hypothesis";
import { projects } from "@/content/projects";
import {
  ALPHAS,
  CRITICAL_Z,
  formatP,
  isRejected,
  normalCdf,
  normalPdf,
  pValue,
  statistic,
} from "@/lib/hypothesis";

describe("normal distribution", () => {
  it.each([
    [0, 0.5],
    [1, 0.841345],
    [1.96, 0.975002],
    [-1.6449, 0.05],
    [3.0902, 0.999],
  ])("Φ(%s) ≈ %s", (z, expected) => {
    expect(normalCdf(z)).toBeCloseTo(expected, 4);
  });
  it("pdf peaks at 1/√(2π)", () => {
    expect(normalPdf(0)).toBeCloseTo(0.398942, 5);
  });
  it("critical values give back their α", () => {
    for (const a of ALPHAS) expect(pValue(CRITICAL_Z[a])).toBeCloseTo(a, 4);
  });
  it("rejects exactly at and beyond the critical value", () => {
    expect(isRejected(1.6449, 0.05)).toBe(true);
    expect(isRejected(1.64, 0.05)).toBe(false);
  });
});

describe("formatP", () => {
  it.each([
    [0.3446, "0.34"],
    [0.0062, "0.006"],
    [0.0004, "< 0.001"],
  ])("%s → %s", (p, out) => expect(formatP(p)).toBe(out));
});

describe("evidence configuration", () => {
  const { evidence, baseline } = hypothesisTest;
  const ids = evidence.map((e) => e.id);

  it("has unique ids and positive weights", () => {
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of evidence) expect(e.weight).toBeGreaterThan(0);
  });
  it("covers every case study and every tracked homepage section", () => {
    for (const p of projects) expect(ids).toContain(`case:${p.slug}`);
    for (const s of sectionEvidenceIds) expect(ids).toContain(s);
  });
  it("starts unrejected at the default α", () => {
    expect(isRejected(baseline, hypothesisTest.defaultAlpha)).toBe(false);
  });
  it("can reach rejection at the strictest α when everything is explored", () => {
    const z = statistic(baseline, evidence, new Set(ids));
    expect(isRejected(z, 0.001)).toBe(true);
  });
  it("needs more than the hero alone: scrolling the homepage is enough at α = 0.05 but not at 0.01", () => {
    const z = statistic(baseline, evidence, new Set(sectionEvidenceIds));
    expect(isRejected(z, 0.05)).toBe(true);
    expect(isRejected(z, 0.01)).toBe(false);
  });
});
