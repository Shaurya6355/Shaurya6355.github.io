"use client";

import { copy } from "@/content/copy";
import { CRITICAL_Z, normalPdf } from "@/lib/hypothesis";

import { useHypothesis } from "./HypothesisProvider";

const Z_MIN = -3.5;
const Z_MAX = 4.5;
const W = 600;
const H = 300;
const BASE = 250; // baseline y
const TOP = 30; // y of the density peak
const PEAK = normalPdf(0);

const xOf = (z: number) => ((z - Z_MIN) / (Z_MAX - Z_MIN)) * W;
const yOf = (z: number) => BASE - (normalPdf(z) / PEAK) * (BASE - TOP);
const pctX = (z: number) => `${(xOf(z) / W) * 100}%`;
const pctY = (y: number) => `${(y / H) * 100}%`;

function area(z0: number, z1: number) {
  const steps = 80;
  let d = `M${xOf(z0).toFixed(1)} ${BASE}`;
  for (let i = 0; i <= steps; i++) {
    const z = z0 + ((z1 - z0) * i) / steps;
    d += `L${xOf(z).toFixed(1)} ${yOf(z).toFixed(1)}`;
  }
  return `${d}L${xOf(z1).toFixed(1)} ${BASE}Z`;
}

const curve = (() => {
  const steps = 160;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const z = Z_MIN + ((Z_MAX - Z_MIN) * i) / steps;
    d += `${i === 0 ? "M" : "L"}${xOf(z).toFixed(1)} ${yOf(z).toFixed(1)}`;
  }
  return d;
})();

const TICKS = [-3, -2, -1, 0, 1, 2, 3, 4];

/** The null distribution of the test statistic, its rejection region, and where the visitor is. */
export function NullChart() {
  const { z, alpha, rejected } = useHypothesis();
  const c = copy.hypothesis;
  const crit = CRITICAL_Z[alpha];
  const shown = Math.min(Math.max(z, Z_MIN + 0.1), Z_MAX - 0.15);
  const markerTop = yOf(shown);
  const labelLeft = shown > 2.6; // flip the label to the left near the right edge

  return (
    <div className="relative w-full select-none" role="img" aria-label={c.chartLabel}>
      <div className="relative aspect-[2/1] w-full">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={area(Z_MIN, Z_MAX)} fill="var(--ink)" fillOpacity="0.04" />
          <path
            d={area(crit, Z_MAX)}
            fill="var(--accent)"
            fillOpacity={rejected ? 0.42 : 0.22}
            className="transition-[fill-opacity] duration-[var(--dur-slow)]"
          />
          <path d={curve} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <line x1={0} x2={W} y1={BASE} y2={BASE} stroke="var(--line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line
            x1={xOf(crit)}
            x2={xOf(crit)}
            y1={BASE}
            y2={yOf(crit) - 72}
            stroke="var(--accent)"
            strokeOpacity="0.7"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* labels */}
        <span
          aria-hidden
          className="absolute -translate-x-1/2 text-[0.75rem] text-ink-3 sm:text-[0.8125rem]"
          style={{ left: pctX(-1.05), top: pctY(BASE - 46) }}
        >
          {c.chartRetain}
        </span>
        <span
          aria-hidden
          className="absolute whitespace-nowrap pl-1.5 text-[0.75rem] font-medium text-accent sm:text-[0.8125rem]"
          style={{ left: pctX(crit + 0.05), top: pctY(yOf(crit) - 92) }}
        >
          {c.chartReject} · α = {alpha}
        </span>

        {/* axis ticks, just under the baseline */}
        {TICKS.map((t) => (
          <span
            key={t}
            aria-hidden
            className="absolute -translate-x-1/2 text-[0.6875rem] tabular-nums text-ink-3"
            style={{ left: pctX(t), top: pctY(BASE + 8) }}
          >
            {t}
          </span>
        ))}

        {/* observed statistic */}
        <div
          aria-hidden
          className="absolute w-0 transition-[left,top,height] duration-700 ease-[var(--ease-out)]"
          style={{ left: pctX(shown), top: pctY(markerTop), height: pctY(BASE - markerTop) }}
        >
          <div className="absolute inset-y-0 -left-px w-[2px] bg-accent" />
          <div
            className={`absolute -left-[6px] -top-[6px] h-3 w-3 rounded-full ${rejected ? "bg-accent" : "bg-ink"}`}
            style={{ boxShadow: "0 0 0 3px var(--bg)" }}
          />
          <div
            className={`absolute -top-[2.7rem] whitespace-nowrap rounded bg-[rgb(11_10_16/0.72)] px-1 text-[0.75rem] leading-tight sm:text-[0.8125rem] ${
              labelLeft ? "right-2 text-right" : "left-2"
            }`}
          >
            <span className="block text-ink-3">{c.chartObserved}</span>
            <span className="block font-medium tabular-nums text-ink">z = {z.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
