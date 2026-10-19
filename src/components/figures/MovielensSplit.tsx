import manifest from "@/content/data/movielens/split_manifest.json";

const day = (epochSeconds: number) => new Date(epochSeconds * 1000).toISOString().slice(0, 10);

/** Time-proportional bar of the temporal split, read from the repository's split manifest. */
export function MovielensSplit() {
  const start = manifest.train.ts_min;
  const end = manifest.test.ts_max;
  const span = end - start;
  const parts = [
    { key: "train", label: "Train", from: start, to: manifest.val_cutoff, rows: manifest.train.n_rows, color: "var(--chart-neutral)" },
    { key: "val", label: "Validation (tuning only)", from: manifest.val_cutoff, to: manifest.test_cutoff, rows: manifest.val.n_rows, color: "var(--chart-ord-1)" },
    { key: "test", label: "Test (final comparison)", from: manifest.test_cutoff, to: end, rows: manifest.test.n_rows, color: "var(--chart-ord-3)" },
  ];

  return (
    <div className="rounded-xl border border-line bg-surface/60 p-5 md:p-7">
      <div className="flex h-5 w-full gap-[2px]" role="img" aria-label="Timeline of the train, validation and test windows">
        {parts.map((p, i) => (
          <div
            key={p.key}
            className={i === parts.length - 1 ? "rounded-r-[4px]" : i === 0 ? "rounded-l-[4px]" : ""}
            style={{ flexGrow: (p.to - p.from) / span, flexBasis: 0, minWidth: 6, background: p.color }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[0.75rem] tabular-nums text-ink-3">
        <span>{day(start).slice(0, 4)}</span>
        <span>{day(end).slice(0, 4)}</span>
      </div>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {parts.map((p) => (
          <li key={p.key} className="flex gap-3">
            <span aria-hidden className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
            <div>
              <p className="text-[0.9375rem] font-medium text-ink">{p.label}</p>
              <p className="text-[0.8125rem] tabular-nums text-ink-3">
                {day(p.from)} → {day(p.to)}
              </p>
              <p className="text-[0.8125rem] tabular-nums text-ink-3">{(p.rows / 1e6).toFixed(2)}M ratings</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
