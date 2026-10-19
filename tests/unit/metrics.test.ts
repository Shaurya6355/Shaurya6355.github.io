import { describe, expect, it } from "vitest";

import { spamSample } from "@/content/data/spam-sample";
import { confusionAt, formatRate, metricsAt, outcomeOf, type ScoredExample } from "@/lib/metrics";

describe("metricsAt on the documented spam sample", () => {
  it("has 16 spam and 24 real emails", () => {
    expect(spamSample).toHaveLength(40);
    expect(spamSample.filter((e) => e.positive)).toHaveLength(16);
  });

  // Hand-counted from the score lists in src/content/data/spam-sample.ts.
  it.each([
    // threshold, tp, fp, fn, tn
    [0.5, 13, 5, 3, 19],
    [0.8, 6, 1, 10, 23],
    [0.3, 15, 10, 1, 14],
    [0.51, 13, 5, 3, 19], // a score equal to the threshold counts as flagged
    [0.52, 12, 5, 4, 19],
  ])("at %s → tp %i fp %i fn %i tn %i", (t, tp, fp, fn, tn) => {
    expect(confusionAt(spamSample, t)).toEqual({ tp, fp, fn, tn });
  });

  it("computes precision and recall from the counts", () => {
    const m = metricsAt(spamSample, 0.5);
    expect(m.precision).toBeCloseTo(13 / 18);
    expect(m.recall).toBeCloseTo(13 / 16);
    expect(m.falsePositiveRate).toBeCloseTo(5 / 24);
    expect(m.accuracy).toBeCloseTo(32 / 40);
    expect(formatRate(m.precision)).toBe("72%");
    expect(formatRate(m.recall)).toBe("81%");
  });

  it("reports precision as undefined (null) when nothing is flagged", () => {
    const m = metricsAt(spamSample, 0.98);
    expect(m.predictedPositive).toBe(0);
    expect(m.precision).toBeNull();
    expect(m.recall).toBe(0);
    expect(formatRate(m.precision)).toBe("—");
  });

  it("flags everything at threshold 0", () => {
    const m = metricsAt(spamSample, 0);
    expect(m.predictedPositive).toBe(40);
    expect(m.recall).toBe(1);
    expect(m.precision).toBeCloseTo(16 / 40);
  });

  it("is consistent at every slider position", () => {
    for (let t = 0; t <= 100; t++) {
      const m = metricsAt(spamSample, t / 100);
      expect(m.tp + m.fp + m.fn + m.tn).toBe(40);
      expect(m.tp + m.fn).toBe(16);
      if (t > 0) expect(m.predictedPositive).toBeLessThanOrEqual(metricsAt(spamSample, (t - 1) / 100).predictedPositive);
    }
  });
});

describe("edge cases", () => {
  it("returns null recall when there are no positives", () => {
    const data: ScoredExample[] = [{ id: "a", score: 0.9, positive: false }];
    expect(metricsAt(data, 0.5).recall).toBeNull();
    expect(outcomeOf(data[0], 0.5)).toBe("fp");
  });
  it("handles an empty dataset", () => {
    const m = metricsAt([], 0.5);
    expect(m.accuracy).toBeNull();
    expect(m.precision).toBeNull();
  });
});
