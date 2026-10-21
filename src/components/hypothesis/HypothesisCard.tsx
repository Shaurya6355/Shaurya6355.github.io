"use client";

import { copy } from "@/content/copy";
import { fill } from "@/lib/fill";
import { formatP } from "@/lib/hypothesis";

import { useHypothesis } from "./HypothesisProvider";

/**
 * H₀ / H₁ card in the hero. Once H₀ is rejected, H₀ is struck through (drawn left to
 * right), a "rejected" stamp lands on the card, and H₁ is marked as supported.
 */
export function HypothesisCard() {
  const { rejected, alpha, p } = useHypothesis();
  const h = copy.hero;
  const t = copy.hypothesis;

  return (
    <div
      role="group"
      aria-label="Hypotheses"
      data-rejected={rejected ? "true" : "false"}
      className={`hypothesis-card relative max-w-xl rounded-2xl border transition-[background-color,border-color] duration-700 ${
        rejected ? "border-accent bg-[var(--success-bg)]" : "border-[var(--accent-line)] bg-accent-soft"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
        <div className="flex min-w-0 flex-1 basis-64 items-baseline gap-4">
          <span className={`shrink-0 font-mono text-[1.25rem] font-semibold transition-colors duration-700 ${rejected ? "text-ink-3" : "text-accent"}`}>
            {h.hypothesisSymbol}
            <sub>0</sub>
          </span>
          <p className="text-[clamp(1.1rem,1.8vw,1.375rem)] font-medium leading-snug tracking-[-0.01em] text-ink">
            <span className="h0-text">{h.nullHypothesis}</span>
            {rejected ? <span className="sr-only"> ({t.cardStamp})</span> : null}
          </p>
        </div>
        {rejected ? (
          <div
            key="stamp"
            aria-hidden
            className="stamp ml-auto shrink-0 rounded-md border-2 border-accent bg-[var(--surface)] px-2.5 py-1 text-center leading-none text-accent shadow-sm"
          >
            <span className="label block text-[0.75rem] tracking-[0.18em]">{t.cardStamp}</span>
            <span className="mt-1 block font-mono text-[0.6875rem] tabular-nums">
              {fill(t.cardStampDetail, { p: formatP(p), alpha })}
            </span>
          </div>
        ) : null}
      </div>

      <div
        className={`flex items-baseline gap-4 border-t px-5 py-3 transition-colors duration-700 ${
          rejected ? "border-accent bg-accent-soft" : "border-[var(--accent-line)]"
        }`}
      >
        <span className={`shrink-0 font-mono text-[1rem] transition-colors duration-700 ${rejected ? "font-semibold text-accent" : "text-ink-3"}`}>
          {h.hypothesisSymbol}
          <sub>1</sub>
        </span>
        <p className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 transition-colors duration-700 ${rejected ? "text-[1rem] font-medium text-ink" : "text-[0.9375rem] text-ink-2"}`}>
          <span>{h.alternative}</span>
          {rejected ? (
            <span key="supported" className="evidence-pop inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-accent">
              <span aria-hidden>✓</span>
              {t.cardSupported}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
