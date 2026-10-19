"use client";

import { useId, useMemo, useState } from "react";

import { DEFAULT_THRESHOLD, spamSample, thresholdPresets } from "@/content/data/spam-sample";
import { formatRate, metricsAt, outcomeOf, type Outcome, type ScoredExample } from "@/lib/metrics";

const outcomeText: Record<Outcome, string> = {
  tp: "Spam, caught",
  fp: "Real email, wrongly flagged",
  fn: "Spam, missed",
  tn: "Real email, delivered",
};

const MIN_GAP = 0.04; // minimum score distance before dots stack (keeps 11px dots apart down to ~300px plots)
const DOT = 11; // px
const LEVEL = 13; // px between stacked dots

/** Assign each example a stacking level so nearby scores don't overlap. */
function stack(rows: readonly ScoredExample[]) {
  const sorted = [...rows].sort((a, b) => a.score - b.score);
  const levels: number[][] = [];
  const out: { example: ScoredExample; level: number }[] = [];
  for (const example of sorted) {
    let level = 0;
    while ((levels[level] ?? []).some((s) => Math.abs(s - example.score) < MIN_GAP)) level++;
    (levels[level] ??= []).push(example.score);
    out.push({ example, level });
  }
  return { dots: out, depth: levels.length };
}

export function ThresholdExplorer() {
  const [t, setT] = useState(Math.round(DEFAULT_THRESHOLD * 100));
  const [hover, setHover] = useState<string | null>(null);
  const threshold = t / 100;
  const m = useMemo(() => metricsAt(spamSample, threshold), [threshold]);
  const sliderId = useId();

  const spam = useMemo(() => stack(spamSample.filter((e) => e.positive)), []);
  const real = useMemo(() => stack(spamSample.filter((e) => !e.positive)), []);

  const set = (value: number) => setT(Math.max(0, Math.min(100, Math.round(value))));

  const summary =
    m.predictedPositive === 0
      ? `At ${threshold.toFixed(2)}, nothing is flagged. Every spam email reaches the inbox, and precision is undefined because there are no flagged emails to be right or wrong about.`
      : `At ${threshold.toFixed(2)}, the filter flags ${m.predictedPositive} of ${m.total} emails. It catches ${m.tp} of ${m.actualPositive} spam emails and sends ${m.fp} real ${m.fp === 1 ? "email" : "emails"} to the spam folder.`;

  return (
    <div className="rounded-2xl border border-line bg-surface/50">
      {/* Controls */}
      <div className="flex flex-col gap-5 border-b border-line p-5 md:flex-row md:items-end md:justify-between md:p-7">
        <div className="min-w-0 flex-1">
          <label htmlFor={sliderId} className="label text-ink-3">
            Decision threshold
          </label>
          <div className="mt-2 flex items-center gap-4">
            <output
              htmlFor={sliderId}
              className="w-[4.5ch] text-[2.25rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums"
            >
              {threshold.toFixed(2)}
            </output>
            <button
              type="button"
              onClick={() => set(t - 1)}
              disabled={t === 0}
              aria-label="Lower threshold by 0.01"
              className="h-8 w-8 shrink-0 rounded-full border border-line-strong text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
            >
              −
            </button>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={t}
              onChange={(e) => set(Number(e.target.value))}
              aria-valuetext={`Threshold ${threshold.toFixed(2)}`}
              className="threshold-range min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={() => set(t + 1)}
              disabled={t === 100}
              aria-label="Raise threshold by 0.01"
              className="h-8 w-8 shrink-0 rounded-full border border-line-strong text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Presets">
          {thresholdPresets.map((p) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={t === Math.round(p.threshold * 100)}
              onClick={() => set(p.threshold * 100)}
              className="rounded-full border border-line-strong px-3 py-1.5 text-[0.8125rem] text-ink-2 transition-colors hover:text-ink aria-pressed:border-[var(--accent-line)] aria-pressed:bg-accent-soft aria-pressed:text-ink"
            >
              {p.label} · {p.threshold.toFixed(2)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => set(DEFAULT_THRESHOLD * 100)}
            className="rounded-full px-3 py-1.5 text-[0.8125rem] text-ink-3 underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Plot */}
      <div className="p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-ink-2">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-[11px] w-[11px] rounded-full bg-[var(--chart-accent)]" />
            Flagged as spam (score ≥ threshold)
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-[11px] w-[11px] rounded-full border-[1.5px] border-[var(--chart-neutral)]"
            />
            Not flagged
          </span>
        </div>

        <div className="relative mt-6" aria-hidden>
          <Row
            title="Actually spam"
            stacked={spam}
            threshold={threshold}
            hover={hover}
            onHover={setHover}
            note={`${m.tp} caught · ${m.fn} missed`}
          />
          <Row
            title="Actually real email"
            stacked={real}
            threshold={threshold}
            hover={hover}
            onHover={setHover}
            note={`${m.fp} wrongly flagged · ${m.tn} delivered`}
          />
          {/* Axis */}
          <div className="relative ml-0 h-6 border-t border-line md:ml-[10.5rem]">
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <span
                key={v}
                className="absolute top-1.5 -translate-x-1/2 text-[0.75rem] tabular-nums text-ink-3 first:translate-x-0 last:-translate-x-full"
                style={{ left: `${v * 100}%` }}
              >
                {v.toFixed(2)}
              </span>
            ))}
          </div>
          <p className="mt-1 text-[0.75rem] text-ink-3 md:ml-[10.5rem]">Spam score assigned by the (synthetic) model</p>
        </div>

        <p aria-live="polite" className="mt-6 max-w-3xl text-[0.9375rem] leading-relaxed text-ink-2">{summary}</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-px border-t border-line bg-[var(--line)] md:grid-cols-[1fr_1fr_1.4fr]">
        <Metric
          name="Precision"
          value={formatRate(m.precision)}
          detail={
            m.precision === null
              ? "Undefined — nothing is flagged, so there is nothing to be right or wrong about."
              : `Of the ${m.predictedPositive} flagged, ${m.tp} are really spam.`
          }
          question="When it flags an email, how often is it right?"
        />
        <Metric
          name="Recall"
          value={formatRate(m.recall)}
          detail={`Of the ${m.actualPositive} spam emails, ${m.tp} are caught.`}
          question="Of all the spam, how much does it catch?"
        />
        <div className="bg-[var(--bg-band)] p-5 md:p-7">
          <p className="label text-ink-3">Confusion matrix</p>
          <table className="mt-3 w-full border-collapse text-[0.875rem]">
            <caption className="sr-only">Counts of each outcome at threshold {threshold.toFixed(2)}</caption>
            <thead>
              <tr className="text-left text-[0.75rem] text-ink-3">
                <th scope="col" className="pb-2 font-normal">
                  <span className="sr-only">Actual</span>
                </th>
                <th scope="col" className="pb-2 font-normal">
                  Flagged
                </th>
                <th scope="col" className="pb-2 font-normal">
                  Not flagged
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <tr className="border-t border-line">
                <th scope="row" className="py-2 pr-3 text-left font-normal text-ink-3">
                  Spam
                </th>
                <Cell count={m.tp} label="caught" />
                <Cell count={m.fn} label="missed" warn />
              </tr>
              <tr className="border-t border-line">
                <th scope="row" className="py-2 pr-3 text-left font-normal text-ink-3">
                  Real
                </th>
                <Cell count={m.fp} label="wrongly flagged" warn />
                <Cell count={m.tn} label="delivered" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation + data */}
      <div className="grid gap-8 border-t border-line p-5 text-[0.9375rem] leading-relaxed text-ink-2 md:grid-cols-2 md:p-7">
        <div className="space-y-3">
          <p>
            <strong className="text-ink">The model gives scores; the threshold makes decisions.</strong> Raising the
            threshold flags fewer emails: precision tends to rise, recall falls, and more spam slips through. Lowering it
            catches more spam at the cost of burying real email.
          </p>
          <p>
            Neither direction is “correct”. The right threshold depends on which mistake is more expensive — for most
            people a lost real email is worse than one more spam message, which argues for a higher threshold.
          </p>
        </div>
        <div className="space-y-3">
          <p className="rounded-lg border border-line bg-bg/60 px-3 py-2 text-[0.8125rem] text-ink-3">
            <span className="label mr-2 text-accent">Synthetic data</span>
            40 hand-written example scores (16 spam, 24 real). Illustrative only — not output from a real model and
            unrelated to any professional work.
          </p>
          <details className="group">
            <summary className="cursor-pointer text-[0.875rem] text-ink-2 hover:text-ink">
              Show the data as a table
            </summary>
            <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-line">
              <table className="w-full text-[0.8125rem] tabular-nums">
                <thead className="sticky top-0 bg-surface text-left text-ink-3">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">Email</th>
                    <th scope="col" className="px-3 py-2 font-medium">Score</th>
                    <th scope="col" className="px-3 py-2 font-medium">Outcome at {threshold.toFixed(2)}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...spamSample]
                    .sort((a, b) => b.score - a.score)
                    .map((e) => (
                      <tr key={e.id} className="border-t border-line">
                        <td className="px-3 py-1.5">{e.id}</td>
                        <td className="px-3 py-1.5">{e.score.toFixed(2)}</td>
                        <td className="px-3 py-1.5">{outcomeText[outcomeOf(e, threshold)]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function Row({
  title,
  stacked,
  threshold,
  note,
  hover,
  onHover,
}: {
  title: string;
  stacked: ReturnType<typeof stack>;
  threshold: number;
  note: string;
  hover: string | null;
  onHover: (id: string | null) => void;
}) {
  const height = Math.max(stacked.depth, 1) * LEVEL + 22;
  return (
    <div className="mb-3 md:grid md:grid-cols-[10.5rem_minmax(0,1fr)] md:items-end">
      <div className="mb-2 md:mb-3 md:pr-4">
        <p className="text-[0.875rem] font-medium text-ink">{title}</p>
        <p className="text-[0.75rem] tabular-nums text-ink-3">{note}</p>
      </div>
      <div className="relative" style={{ height }}>
        {/* flagged region */}
        <div
          className="absolute inset-y-0 right-0 bg-accent-soft transition-[left] duration-[var(--dur-fast)]"
          style={{ left: `${threshold * 100}%` }}
        />
        <div
          className="absolute inset-y-[-6px] w-px bg-accent transition-[left] duration-[var(--dur-fast)]"
          style={{ left: `${threshold * 100}%` }}
        />
        {stacked.dots.map(({ example, level }) => {
          const flagged = example.score >= threshold;
          const active = hover === example.id;
          return (
            <span
              key={example.id}
              onMouseEnter={() => onHover(example.id)}
              onMouseLeave={() => onHover(null)}
              className="absolute -translate-x-1/2 rounded-full transition-colors duration-[var(--dur-fast)]"
              style={{
                left: `${example.score * 100}%`,
                bottom: 6 + level * LEVEL,
                width: DOT,
                height: DOT,
                background: flagged ? "var(--chart-accent)" : "var(--bg-band)",
                border: flagged ? "none" : "1.5px solid var(--chart-neutral)",
                boxShadow: "0 0 0 2px var(--bg-band)",
              }}
            >
              {active ? (
                <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-line-strong bg-surface-2 px-2 py-1 text-[0.75rem] text-ink shadow-lg">
                  {example.id} · score {example.score.toFixed(2)} · {outcomeText[outcomeOf(example, threshold)]}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ name, value, detail, question }: { name: string; value: string; detail: string; question: string }) {
  return (
    <div className="bg-[var(--bg-band)] p-5 md:p-7">
      <p className="label text-ink-3">{name}</p>
      <p className="mt-2 text-[2.75rem] font-semibold leading-none tracking-[-0.03em] text-ink">{value}</p>
      <p className="mt-3 text-[0.8125rem] text-ink-3">{question}</p>
      <p className="mt-1 text-[0.875rem] leading-snug text-ink-2">{detail}</p>
    </div>
  );
}

function Cell({ count, label, warn = false }: { count: number; label: string; warn?: boolean }) {
  return (
    <td className="py-2 pr-3">
      <span className={`text-[1.125rem] font-semibold ${warn && count > 0 ? "text-accent" : "text-ink"}`}>{count}</span>{" "}
      <span className="text-[0.75rem] text-ink-3">{label}</span>
    </td>
  );
}
