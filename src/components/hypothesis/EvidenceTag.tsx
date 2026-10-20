"use client";

import { copy } from "@/content/copy";
import { fill } from "@/lib/fill";

import { useHypothesis } from "./HypothesisProvider";

/**
 * Small tag next to a section heading that tells visitors the section counts as
 * evidence, and flips (with a short pop) once it has been counted.
 */
export function EvidenceTag({ id, pending = copy.hypothesis.tagPending }: { id: string; pending?: string }) {
  const { collected, evidenceById } = useHypothesis();
  const item = evidenceById.get(id);
  if (!item) return null;
  const has = collected.has(id);

  return (
    <p
      data-evidence-tag={id}
      data-collected={has ? "true" : "false"}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.75rem] leading-5 transition-colors duration-500 ${
        has ? "border-[var(--accent-line)] bg-accent-soft text-ink" : "border-line text-ink-3"
      }`}
    >
      {has ? (
        <span key="done" className="evidence-pop inline-flex items-center gap-2">
          <span aria-hidden className="text-accent">
            ✓
          </span>
          {fill(copy.hypothesis.tagCollected, { weight: item.weight.toFixed(2) })}
        </span>
      ) : (
        <span key="todo" className="inline-flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink-3" />
          {pending}
        </span>
      )}
    </p>
  );
}
