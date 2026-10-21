"use client";

import { copy } from "@/content/copy";
import { fill } from "@/lib/fill";
import { ALPHAS, formatP } from "@/lib/hypothesis";

import { useHypothesis } from "./HypothesisProvider";

/** Choose the significance level: a smaller α demands more evidence before rejecting H₀. */
export function AlphaPicker({ compact = false }: { compact?: boolean }) {
  const { alpha, setAlpha } = useHypothesis();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${compact ? "text-[0.75rem]" : "text-[0.8125rem]"} text-ink-3`}>{copy.hypothesis.alphaLabel}</span>
      <div role="group" aria-label={copy.hypothesis.alphaLabel} className="flex flex-wrap gap-1.5">
        {ALPHAS.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={alpha === a}
            onClick={() => setAlpha(a)}
            className={`rounded-full border px-2.5 py-1 font-mono tabular-nums transition-colors ${
              compact ? "text-[0.6875rem]" : "text-[0.75rem]"
            } ${
              alpha === a
                ? "border-[var(--bold-line)] bg-bold-soft text-ink"
                : "border-line-strong text-ink-2 hover:text-ink"
            }`}
          >
            α = {a}
          </button>
        ))}
      </div>
    </div>
  );
}

/** One-sentence state of the test. Announced politely to screen readers when it changes. */
export function Readout({ className = "" }: { className?: string }) {
  const { z, p, alpha, rejected } = useHypothesis();
  const c = copy.hypothesis;
  const text = fill(rejected ? c.readoutRejected : c.readoutHolds, {
    z: z.toFixed(2),
    p: formatP(p),
    alpha,
  });
  return (
    <p aria-live="polite" className={className}>
      {text}
    </p>
  );
}
