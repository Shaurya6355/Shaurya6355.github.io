"use client";

import { useId, useMemo, useState } from "react";

import { copy } from "@/content/copy";
import { DEFAULT_THRESHOLD, spamSample, thresholdPresets } from "@/content/data/spam-sample";
import { fill } from "@/lib/fill";
import { RichText } from "@/components/ui/RichText";
import { formatRate, metricsAt, outcomeOf, type Outcome, type ScoredExample } from "@/lib/metrics";

const t = copy.explorer;

const outcomeText: Record<Outcome, string> = {
  tp: t.outcomeTp,
  fp: t.outcomeFp,
  fn: t.outcomeFn,
  tn: t.outcomeTn,
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
  const [pos, setPos] = useState(Math.round(DEFAULT_THRESHOLD * 100));
  const [hover, setHover] = useState<string | null>(null);
  const threshold = pos / 100;
  const m = useMemo(() => metricsAt(spamSample, threshold), [threshold]);
  const sliderId = useId();

  const spam = useMemo(() => stack(spamSample.filter((e) => e.positive)), []);
  const real = useMemo(() => stack(spamSample.filter((e) => !e.positive)), []);

  const set = (value: number) => setPos(Math.max(0, Math.min(100, Math.round(value))));

  const vars = {
    threshold: threshold.toFixed(2),
    flagged: m.predictedPositive,
    total: m.total,
    tp: m.tp,
    fp: m.fp,
    fn: m.fn,
    tn: m.tn,
    spam: m.actualPositive,
    fpNoun: m.fp === 1 ? t.emailSingular : t.emailPlural,
  };
  const summary = fill(m.predictedPositive === 0 ? t.summaryNothingFlagged : t.summary, vars);

  return (
    <div className="rounded-2xl border border-line bg-surface/50">
      {/* Controls */}
      <div className="flex flex-col gap-5 border-b border-line p-5 md:flex-row md:items-end md:justify-between md:p-7">
        <div className="min-w-0 flex-1">
          <label htmlFor={sliderId} className="label text-ink-3">
            {t.thresholdLabel}
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
              onClick={() => set(pos - 1)}
              disabled={pos === 0}
              aria-label={t.lower}
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
              value={pos}
              onChange={(e) => set(Number(e.target.value))}
              aria-valuetext={`Threshold ${threshold.toFixed(2)}`}
              className="threshold-range min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={() => set(pos + 1)}
              disabled={pos === 100}
              aria-label={t.raise}
              className="h-8 w-8 shrink-0 rounded-full border border-line-strong text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.presetsLabel}>
          {thresholdPresets.map((p) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={pos === Math.round(p.threshold * 100)}
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
            {t.reset}
          </button>
        </div>
      </div>

      {/* Plot */}
      <div className="p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-ink-2">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-[11px] w-[11px] rounded-full bg-[var(--chart-accent)]" />
            {t.legendFlagged}
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-[11px] w-[11px] rounded-full border-[1.5px] border-[var(--chart-neutral)]"
            />
            {t.legendNotFlagged}
          </span>
        </div>

        <div className="relative mt-6" aria-hidden>
          <Row
            title={t.rowSpam}
            stacked={spam}
            threshold={threshold}
            hover={hover}
            onHover={setHover}
            note={fill(t.rowSpamNote, vars)}
          />
          <Row
            title={t.rowReal}
            stacked={real}
            threshold={threshold}
            hover={hover}
            onHover={setHover}
            note={fill(t.rowRealNote, vars)}
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
          <p className="mt-1 text-[0.75rem] text-ink-3 md:ml-[10.5rem]">{t.axisLabel}</p>
        </div>

        <p aria-live="polite" className="mt-6 max-w-3xl text-[0.9375rem] leading-relaxed text-ink-2">{summary}</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-px border-t border-line bg-[var(--line)] md:grid-cols-[1fr_1fr_1.4fr]">
        <Metric
          name={t.precision}
          value={formatRate(m.precision)}
          detail={
            m.precision === null
              ? t.precisionUndefined
              : fill(t.precisionDetail, vars)
          }
          question={t.precisionQuestion}
        />
        <Metric
          name={t.recall}
          value={formatRate(m.recall)}
          detail={fill(t.recallDetail, vars)}
          question={t.recallQuestion}
        />
        <div className="bg-[var(--bg-band)] p-5 md:p-7">
          <p className="label text-ink-3">{t.matrixTitle}</p>
          <table className="mt-3 w-full border-collapse text-[0.875rem]">
            <caption className="sr-only">{fill(t.matrixCaption, vars)}</caption>
            <thead>
              <tr className="text-left text-[0.75rem] text-ink-3">
                <th scope="col" className="pb-2 font-normal">
                  <span className="sr-only">Actual</span>
                </th>
                <th scope="col" className="pb-2 font-normal">
                  {t.matrixFlagged}
                </th>
                <th scope="col" className="pb-2 font-normal">
                  {t.matrixNotFlagged}
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <tr className="border-t border-line">
                <th scope="row" className="py-2 pr-3 text-left font-normal text-ink-3">
                  {t.matrixSpam}
                </th>
                <Cell count={m.tp} label={t.cellCaught} />
                <Cell count={m.fn} label={t.cellMissed} warn />
              </tr>
              <tr className="border-t border-line">
                <th scope="row" className="py-2 pr-3 text-left font-normal text-ink-3">
                  {t.matrixReal}
                </th>
                <Cell count={m.fp} label={t.cellWronglyFlagged} warn />
                <Cell count={m.tn} label={t.cellDelivered} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation + data */}
      <div className="grid gap-8 border-t border-line p-5 text-[0.9375rem] leading-relaxed text-ink-2 md:grid-cols-2 md:p-7">
        <div className="space-y-3">
          <p className="[&_strong]:text-ink">
            <RichText text={t.explanation1} />
          </p>
          <p>
            <RichText text={t.explanation2} />
          </p>
        </div>
        <div className="space-y-3">
          <p className="rounded-lg border border-line bg-bg/60 px-3 py-2 text-[0.8125rem] text-ink-3">
            <span className="label mr-2 text-accent">{t.syntheticLabel}</span>
            {t.syntheticNote}
          </p>
          <details className="group">
            <summary className="cursor-pointer text-[0.875rem] text-ink-2 hover:text-ink">
              {t.showTable}
            </summary>
            <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-line">
              <table className="w-full text-[0.8125rem] tabular-nums">
                <thead className="sticky top-0 bg-surface text-left text-ink-3">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">{t.tableEmail}</th>
                    <th scope="col" className="px-3 py-2 font-medium">{t.tableScore}</th>
                    <th scope="col" className="px-3 py-2 font-medium">{fill(t.tableOutcome, vars)}</th>
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
