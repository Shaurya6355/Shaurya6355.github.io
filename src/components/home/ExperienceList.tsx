import { ReviewNote } from "@/components/ui/ReviewNote";
import type { ExperienceEntry } from "@/content/experience";
import { isPending, known, showReviewNotes, type Maybe } from "@/lib/pending";

/** Renders a value, or its review marker in development, or nothing in production. */
function Field<T extends string>({ value, children }: { value: Maybe<T> | undefined; children: (v: T) => React.ReactNode }) {
  if (value === undefined) return null;
  if (isPending(value)) return <ReviewNote note={value.pending} inline />;
  return <>{children(value)}</>;
}

/** Experience rows in the style of the reference's "Where I trained" list. */
export function ExperienceList({ entries, heading }: { entries: ExperienceEntry[]; heading: string }) {
  const visible = entries.filter((e) => showReviewNotes || known(e.organization) !== undefined);
  if (visible.length === 0) return null;

  return (
    <div>
      <h3 className="label text-ink-3">{heading}</h3>
      <ul className="mt-4 border-t border-line">
        {visible.map((entry) => {
          const highlights = entry.highlights;
          return (
            <li key={entry.id} className="border-b border-line py-7">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <p className="text-[1.25rem] font-semibold tracking-[-0.015em] text-ink">
                  <Field value={entry.organization}>{(v) => v}</Field>
                </p>
                {entry.period !== undefined && (showReviewNotes || known(entry.period) !== undefined) ? (
                  <p className="shrink-0 text-[0.9375rem] tabular-nums text-ink-3">
                    <Field value={entry.period}>{(v) => v}</Field>
                  </p>
                ) : null}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem]">
                <Field value={entry.title}>{(v) => <span className="font-medium text-ink-2">{v}</span>}</Field>
                <Field value={entry.location}>{(v) => <span className="text-ink-3">· {v}</span>}</Field>
              </div>
              {entry.note ? <p className="mt-1 text-[0.8125rem] text-ink-3">{entry.note}</p> : null}
              {entry.summary !== undefined ? (
                <div className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
                  <Field value={entry.summary}>{(v) => <p>{v}</p>}</Field>
                </div>
              ) : null}
              {highlights !== undefined ? (
                isPending(highlights) ? (
                  <div className="mt-3">
                    <ReviewNote note={highlights.pending} />
                  </div>
                ) : (
                  <ul className="prose-body mt-3 max-w-2xl text-[0.9375rem]">
                    {highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
