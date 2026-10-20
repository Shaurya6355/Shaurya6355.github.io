"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { CloseIcon } from "@/components/ui/Icons";
import { copy } from "@/content/copy";
import { fill } from "@/lib/fill";
import { formatP } from "@/lib/hypothesis";

import { useHypothesis } from "./HypothesisProvider";
import { AlphaPicker, Readout } from "./TestControls";

/**
 * Small floating badge that keeps the live test visible on every page, and opens a
 * panel listing the evidence collected so far. On the homepage it appears once the
 * hero (which shows the full chart) has scrolled away.
 */
export function TestBadge() {
  const { p, rejected, evidence, collected, reset, alpha } = useHypothesis();
  const pathname = usePathname();
  const onHome = pathname === "/";
  // Only meaningful on the homepage, where the hero already shows the full test.
  const [heroVisible, setHeroVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const c = copy.hypothesis;

  useEffect(() => {
    const hero = onHome ? document.getElementById("hero") : null;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const status = fill(rejected ? c.badgeRejected : c.badgeHolds, { p: formatP(p) });
  const hidden = onHome && heroVisible && !open;

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 transition-[opacity,transform] duration-[var(--dur)] sm:bottom-6 sm:right-6 ${
        hidden ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
      }`}
      aria-hidden={hidden || undefined}
    >
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={c.panelTitle}
          className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line-strong bg-surface/95 p-5 text-[0.875rem] shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="label text-accent">{c.panelTitle}</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label={c.close}
              className="-mr-1 -mt-1 rounded-full p-1 text-ink-3 hover:text-ink"
            >
              <CloseIcon width={16} height={16} />
            </button>
          </div>
          <p className="mt-2 font-medium text-ink">{c.panelHypothesis}</p>
          <p className="mt-1 leading-snug text-ink-2">{c.panelIntro}</p>
          <div className="mt-3">
            <AlphaPicker compact />
          </div>
          <Readout className="mt-3 leading-snug text-ink-2" />
          <p className="label mt-4 text-ink-3">{c.evidenceHeading}</p>
          <ul className="mt-2 space-y-1.5">
            {evidence.map((e) => {
              const has = collected.has(e.id);
              return (
                <li key={e.id} className="flex items-baseline justify-between gap-3">
                  <span className={has ? "text-ink" : "text-ink-3"}>
                    <span aria-hidden className={`mr-2 ${has ? "text-accent" : ""}`}>
                      {has ? "✓" : "○"}
                    </span>
                    {e.label}
                    {has ? null : <span className="sr-only"> ({c.evidenceMissing})</span>}
                  </span>
                  <span className={`shrink-0 font-mono text-[0.75rem] tabular-nums ${has ? "text-accent" : "text-ink-3"}`}>
                    +{e.weight.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[0.75rem] leading-snug text-ink-3">{c.disclaimer}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-[0.8125rem] text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            {c.reset}
          </button>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        tabIndex={hidden ? -1 : undefined}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={fill(c.badgeLabel, { status })}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[0.75rem] tabular-nums shadow-lg backdrop-blur-xl transition-colors ${
          rejected
            ? "border-[var(--accent-line)] bg-[rgb(124_92_214/0.25)] text-ink"
            : "border-line-strong bg-surface/90 text-ink-2 hover:text-ink"
        }`}
      >
        <span aria-hidden className={`h-2 w-2 rounded-full ${rejected ? "bg-accent" : "bg-ink-3"}`} />
        {status}
      </button>

      <span className="sr-only" aria-live="polite">
        {rejected ? fill(c.announceRejected, { alpha }) : ""}
      </span>
    </div>
  );
}
