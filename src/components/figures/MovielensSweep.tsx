"use client";

import { useState } from "react";

import sweep from "@/content/data/movielens/sweep.json";

type Entry = (typeof sweep.entries)[number];

const alphaColor: Record<number, string> = {
  10: "var(--chart-ord-1)",
  40: "var(--chart-ord-2)",
  80: "var(--chart-ord-3)",
};

const X = { min: 0, max: 0.06, ticks: [0, 0.02, 0.04, 0.06] };
const Y = { min: 0.05, max: 0.08, ticks: [0.05, 0.06, 0.07, 0.08] };

const sx = (v: number) => ((v - X.min) / (X.max - X.min)) * 100;
const sy = (v: number) => ((v - Y.min) / (Y.max - Y.min)) * 100;

const describe = (e: Entry) =>
  `${e.factors} factors · reg ${e.regularization} · α ${e.alpha} — NDCG@10 ${e["ndcg@10"].toFixed(3)}, coverage ${(e["coverage@10"] * 100).toFixed(1)}%`;

const isBest = (e: Entry) =>
  e.factors === sweep.best.factors && e.regularization === sweep.best.regularization && e.alpha === sweep.best.alpha;

/** The 27-run tuning grid: coverage vs. ranking quality, colored by confidence weight α. */
export function MovielensSweep() {
  const [hover, setHover] = useState<number | null>(null);
  const entries = sweep.entries;
  const best = sweep.best;

  return (
    <div className="rounded-xl border border-line bg-surface/60 p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-ink">Coverage vs. ranking quality</p>
        <ul className="flex flex-wrap gap-4 text-[0.8125rem] text-ink-2" aria-label="Legend">
          {[10, 40, 80].map((a) => (
            <li key={a} className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: alphaColor[a] }} />α = {a}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid grid-cols-[2.75rem_minmax(0,1fr)]">
        {/* y axis */}
        <div className="relative h-64 md:h-72">
          {Y.ticks.map((t) => (
            <span
              key={t}
              className="absolute right-2 translate-y-1/2 text-[0.75rem] tabular-nums text-ink-3"
              style={{ bottom: `${sy(t)}%` }}
            >
              {t.toFixed(2)}
            </span>
          ))}
        </div>
        {/* plot */}
        <div className="relative h-64 border-b border-l border-line-strong md:h-72" onMouseLeave={() => setHover(null)}>
          {Y.ticks.slice(1).map((t) => (
            <div key={t} className="absolute inset-x-0 h-px bg-[var(--chart-grid)]" style={{ bottom: `${sy(t)}%` }} />
          ))}
          {entries
            .map((e, i) => ({ e, i }))
            .sort((a, b) => Number(isBest(a.e)) - Number(isBest(b.e)))
            .map(({ e, i }) => {
            const bestPoint = isBest(e);
            return (
              <span
                key={i}
                onMouseEnter={() => setHover(i)}
                className="absolute flex h-5 w-5 -translate-x-1/2 translate-y-1/2 items-center justify-center"
                style={{ left: `${sx(e["coverage@10"])}%`, bottom: `${sy(e["ndcg@10"])}%` }}
              >
                <span
                  className="block h-2.5 w-2.5 rounded-full transition-transform"
                  style={{
                    background: alphaColor[e.alpha],
                    boxShadow: bestPoint ? "0 0 0 2px var(--surface), 0 0 0 3.5px var(--ink)" : "0 0 0 2px var(--surface)",
                    transform: hover === i ? "scale(1.4)" : undefined,
                  }}
                />
              </span>
            );
            })}
          {/* direct label for the selected configuration */}
          <span
            className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap pt-3 text-[0.75rem] text-ink"
            style={{ left: `${sx(best["coverage@10"])}%`, top: `calc(${100 - sy(best["ndcg@10"])}% + 6px)` }}
          >
            selected · 64 factors, α = 10
          </span>
          {hover !== null ? (
            <span
              className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-line-strong bg-surface-2 px-2 py-1 text-[0.75rem] text-ink shadow-lg"
              style={{
                left: `${Math.min(Math.max(sx(entries[hover]["coverage@10"]), 22), 78)}%`,
                bottom: `calc(${sy(entries[hover]["ndcg@10"])}% + 16px)`,
              }}
            >
              {describe(entries[hover])}
            </span>
          ) : null}
        </div>
        <div />
        <div className="relative h-6">
          {X.ticks.map((t, i) => (
            <span
              key={t}
              className={`absolute top-1.5 text-[0.75rem] tabular-nums text-ink-3 ${i === 0 ? "" : i === X.ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`}
              style={{ left: `${sx(t)}%` }}
            >
              {Math.round(t * 100)}%
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-between pl-[2.75rem] text-[0.75rem] text-ink-3">
        <span>↑ NDCG@10 (validation)</span>
        <span>Coverage@10 →</span>
      </div>

      <details className="mt-4 text-[0.8125rem]">
        <summary className="cursor-pointer text-ink-3 hover:text-ink">Show all 27 runs as a table</summary>
        <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-line">
          <table className="w-full tabular-nums">
            <thead className="sticky top-0 bg-surface text-left text-ink-3">
              <tr>
                {["Factors", "Reg.", "α", "NDCG@10", "Recall@10", "Coverage@10"].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-ink-2">
              {[...entries]
                .sort((a, b) => b["ndcg@10"] - a["ndcg@10"])
                .map((e, i) => (
                  <tr key={i} className={`border-t border-line ${isBest(e) ? "text-ink" : ""}`}>
                    <td className="px-3 py-1.5">{e.factors}</td>
                    <td className="px-3 py-1.5">{e.regularization}</td>
                    <td className="px-3 py-1.5">{e.alpha}</td>
                    <td className="px-3 py-1.5">{e["ndcg@10"].toFixed(4)}</td>
                    <td className="px-3 py-1.5">{e["recall@10"].toFixed(4)}</td>
                    <td className="px-3 py-1.5">{(e["coverage@10"] * 100).toFixed(2)}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
