import evaluation from "@/content/data/movielens/evaluation.json";

const arms = [
  { key: "popularity", label: "Popularity", color: "var(--chart-neutral)" },
  { key: "als", label: "Implicit ALS", color: "var(--chart-accent)" },
] as const;

const NDCG_MAX = 0.09;
const COV_MAX = 0.03;

const fmt3 = (v: number) => v.toFixed(3);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/**
 * Two small panels with independent axes (never a dual axis):
 * NDCG@10 with 95% bootstrap intervals, and catalog coverage@10.
 */
export function MovielensHeadline() {
  const warm = evaluation.warm;
  const rows = arms.map((a) => {
    const m = warm.arms[a.key];
    return {
      ...a,
      ndcg: m.per_metric["ndcg@10"],
      coverage: m.scalars["coverage@10"],
    };
  });
  const diff = warm.paired_diff_vs_popularity.als;

  return (
    <div className="rounded-xl border border-line bg-surface/60 p-5 md:p-7">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-12">
        <Panel title="NDCG@10" subtitle="ranking quality, 95% bootstrap interval" ticks={[0, 0.03, 0.06, 0.09]} max={NDCG_MAX} format={(v) => v.toFixed(2)}>
          {rows.map((r) => (
            <Row key={r.key} label={r.label}>
              <div
                className="absolute top-1/2 h-px -translate-y-1/2"
                style={{
                  left: `${(r.ndcg.ci_lo / NDCG_MAX) * 100}%`,
                  width: `${((r.ndcg.ci_hi - r.ndcg.ci_lo) / NDCG_MAX) * 100}%`,
                  background: r.color,
                  height: 2,
                }}
              />
              {[r.ndcg.ci_lo, r.ndcg.ci_hi].map((v) => (
                <div
                  key={v}
                  className="absolute top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(v / NDCG_MAX) * 100}%`, background: r.color }}
                />
              ))}
              <div
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${(r.ndcg.mean / NDCG_MAX) * 100}%`, background: r.color, boxShadow: "0 0 0 2px var(--surface)" }}
                title={`${r.label}: ${fmt3(r.ndcg.mean)} [${fmt3(r.ndcg.ci_lo)}, ${fmt3(r.ndcg.ci_hi)}]`}
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 pl-3 text-[0.8125rem] tabular-nums text-ink-2"
                style={{ left: `${(r.ndcg.ci_hi / NDCG_MAX) * 100}%` }}
              >
                {fmt3(r.ndcg.mean)}
              </span>
            </Row>
          ))}
        </Panel>

        <Panel title="Coverage@10" subtitle="share of catalog in anyone's top 10" ticks={[0, 0.01, 0.02, 0.03]} max={COV_MAX} format={(v) => `${Math.round(v * 100)}%`}>
          {rows.map((r) => (
            <Row key={r.key} label={r.label}>
              <div
                className="absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-r-[4px]"
                style={{ width: `${(r.coverage / COV_MAX) * 100}%`, minWidth: 2, background: r.color }}
                title={`${r.label}: ${pct(r.coverage)}`}
              />
              {r.coverage / COV_MAX > 0.6 ? (
                <span
                  className="absolute top-1/2 -translate-x-full -translate-y-1/2 pr-2 text-[0.75rem] font-semibold tabular-nums text-[var(--bg)]"
                  style={{ left: `${(r.coverage / COV_MAX) * 100}%` }}
                >
                  {pct(r.coverage)}
                </span>
              ) : (
                <span
                  className="absolute top-1/2 -translate-y-1/2 pl-2 text-[0.8125rem] tabular-nums text-ink-2"
                  style={{ left: `${(r.coverage / COV_MAX) * 100}%` }}
                >
                  {pct(r.coverage)}
                </span>
              )}
            </Row>
          ))}
        </Panel>
      </div>

      <p className="mt-8 border-t border-line pt-4 text-[0.875rem] text-ink-2">
        Paired difference, ALS − popularity, NDCG@10:{" "}
        <span className="font-semibold text-ink tabular-nums">
          +{fmt3(diff.mean_diff)} [{fmt3(diff.ci_lo)}, {fmt3(diff.ci_hi)}]
        </span>{" "}
        · {warm.n_users.toLocaleString("en-US")} users · {evaluation.bootstrap.n_resamples.toLocaleString("en-US")} paired
        resamples
      </p>

      <details className="mt-3 text-[0.8125rem]">
        <summary className="cursor-pointer text-ink-3 hover:text-ink">Show as a table</summary>
        <table className="mt-3 w-full max-w-xl tabular-nums">
          <thead className="text-left text-ink-3">
            <tr>
              <th scope="col" className="py-1.5 pr-4 font-medium">Model</th>
              <th scope="col" className="py-1.5 pr-4 font-medium">NDCG@10</th>
              <th scope="col" className="py-1.5 pr-4 font-medium">95% CI</th>
              <th scope="col" className="py-1.5 font-medium">Coverage@10</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-line">
                <td className="py-1.5 pr-4">{r.label}</td>
                <td className="py-1.5 pr-4">{fmt3(r.ndcg.mean)}</td>
                <td className="py-1.5 pr-4">
                  [{fmt3(r.ndcg.ci_lo)}, {fmt3(r.ndcg.ci_hi)}]
                </td>
                <td className="py-1.5">{pct(r.coverage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  ticks,
  max,
  format,
  children,
}: {
  title: string;
  subtitle: string;
  ticks: number[];
  max: number;
  format: (v: number) => string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-semibold text-ink">{title}</p>
      <p className="text-[0.8125rem] text-ink-3">{subtitle}</p>
      <div className="mt-5 grid grid-cols-[6.5rem_minmax(0,1fr)]">
        <div />
        <div className="relative">
          {ticks.map((t) => (
            <div key={t} className="absolute inset-y-0 w-px bg-[var(--chart-grid)]" style={{ left: `${(t / max) * 100}%`, height: "6rem" }} />
          ))}
        </div>
        {children}
        <div />
        <div className="relative mt-1 h-5 border-t border-line-strong">
          {ticks.map((t, i) => (
            <span
              key={t}
              className={`absolute top-1 text-[0.75rem] tabular-nums text-ink-3 ${i === 0 ? "" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`}
              style={{ left: `${(t / max) * 100}%` }}
            >
              {format(t)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-12 items-center pr-3 text-[0.875rem] text-ink-2">{label}</div>
      <div className="relative h-12">{children}</div>
    </>
  );
}
