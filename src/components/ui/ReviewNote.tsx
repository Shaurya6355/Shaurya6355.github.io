import { showReviewNotes } from "@/lib/pending";

/**
 * A visible "needs your input" marker. Rendered only in development (or with
 * NEXT_PUBLIC_SHOW_REVIEW_NOTES=1); production builds render nothing.
 */
export function ReviewNote({ note, inline = false }: { note: string; inline?: boolean }) {
  if (!showReviewNotes) return null;
  const Tag = inline ? "span" : "div";
  return (
    <Tag
      data-review-note
      className={`${inline ? "inline-flex" : "flex"} items-start gap-2 rounded-md border border-dashed border-review/60 bg-review/5 px-2.5 py-1.5 text-[0.8125rem] leading-snug text-review`}
    >
      <span className="label shrink-0 pt-px">To add</span>
      <span>{note}</span>
    </Tag>
  );
}
