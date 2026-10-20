import type { ReactNode } from "react";

import { EvidenceTag } from "@/components/hypothesis/EvidenceTag";

/**
 * Two-tone section heading, as in the reference: the first word in the accent,
 * the rest in ink.
 */
export function SectionHeading({
  accent,
  rest,
  as: Tag = "h2",
  id,
}: {
  accent: string;
  rest?: string;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className="text-[clamp(2.25rem,4.6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink"
    >
      <span className="text-accent">{accent}</span>
      {rest ? <> {rest}</> : null}
    </Tag>
  );
}

interface SectionProps {
  id: string;
  accent: string;
  rest?: string;
  /** Short text under the heading. */
  intro?: ReactNode;
  /** Action under the intro, e.g. a pill link. */
  aside?: ReactNode;
  /** "split": heading left, content right. "stacked": heading above full-width content. */
  layout?: "split" | "stacked";
  band?: boolean;
  /** Live-test evidence id this section contributes (shows a tag under the heading). */
  evidenceId?: string;
  children: ReactNode;
}

export function Section({ id, accent, rest, intro, aside, layout = "split", band = false, evidenceId, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={band ? "band" : undefined}>
      {layout === "split" ? (
        <div className="container-page grid gap-10 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:py-28">
          <div>
            <div className="md:sticky md:top-[calc(var(--nav-h)+3rem)]">
              <SectionHeading id={headingId} accent={accent} rest={rest} />
              <div aria-hidden className="mt-6 h-px w-12 bg-line-strong" />
              {intro ? <div className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-ink-3">{intro}</div> : null}
              {evidenceId ? (
                <div className="mt-6">
                  <EvidenceTag id={evidenceId} />
                </div>
              ) : null}
              {aside ? <div className="mt-6">{aside}</div> : null}
            </div>
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      ) : (
        <div className="container-page py-20 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionHeading id={headingId} accent={accent} rest={rest} />
              {intro ? (
                <div className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-ink-3">{intro}</div>
              ) : null}
              {evidenceId ? (
                <div className="mt-5">
                  <EvidenceTag id={evidenceId} />
                </div>
              ) : null}
            </div>
            {aside ? <div className="shrink-0">{aside}</div> : null}
          </div>
          <div className="mt-12 md:mt-14">{children}</div>
        </div>
      )}
    </section>
  );
}
