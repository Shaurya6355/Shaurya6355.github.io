/**
 * Placeholders for facts that only the site owner can supply.
 *
 * A `Pending` value is rendered as a visible yellow review marker in development
 * (or when NEXT_PUBLIC_SHOW_REVIEW_NOTES=1) and is omitted entirely from a normal
 * production build. That way nothing invented ever ships, and nothing missing
 * turns into a broken link. `npm run check:content` lists every remaining one.
 */
export type Pending = { readonly pending: string };

export type Maybe<T> = T | Pending;

export function pending(note: string): Pending {
  return { pending: note };
}

export function isPending(value: unknown): value is Pending {
  return typeof value === "object" && value !== null && "pending" in value;
}

/** The value if it has been supplied, otherwise undefined. */
export function known<T>(value: Maybe<T> | undefined | null): T | undefined {
  if (value === undefined || value === null || isPending(value)) return undefined;
  return value;
}

export const showReviewNotes =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_REVIEW_NOTES === "1";
