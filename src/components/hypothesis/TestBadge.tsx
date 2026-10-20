"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import { CloseIcon } from "@/components/ui/Icons";
import { copy } from "@/content/copy";
import { fill } from "@/lib/fill";
import { formatP } from "@/lib/hypothesis";

import { useHypothesis } from "./HypothesisProvider";
import { AlphaPicker, Readout } from "./TestControls";
import { useAnimatedNumber } from "./useAnimatedNumber";

const BURST = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 46 + (i % 3) * 14;
  return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist * 0.75, size: 4 + (i % 3) * 2 };
});

/**
 * The live test, always within reach: a small card in the corner with a progress bar
 * toward the rejection threshold. It shows a toast when evidence comes in, a one-time
 * hint explaining itself, a celebration when H₀ is rejected, and a details panel.
 * On the homepage it waits until the hero (which shows the full chart) scrolls away.
 */
export function TestBadge() {
  const {
    z,
    p,
    alpha,
    critical,
    rejected,
    evidence,
    collected,
    notice,
    nudgeSeen,
    reset,
    dismissNudge,
    clearNotice,
  } = useHypothesis();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [heroVisible, setHeroVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const c = copy.hypothesis;
  const progress = useAnimatedNumber(Math.min(1, Math.max(0, z / critical)), 900);

  useEffect(() => {
    const hero = onHome ? document.getElementById("hero") : null;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [onHome]);

  const hidden = onHome && heroVisible && !open && !notice;
  const showNudge = !hidden && !open && !nudgeSeen && !notice;

  // The hint explains itself once, then gets out of the way.
  useEffect(() => {
    if (!showNudge) return;
    const t = window.setTimeout(dismissNudge, 9000);
    return () => window.clearTimeout(t);
  }, [showNudge, dismissNudge]);

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

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 transition-[opacity,transform] duration-[var(--dur-slow)] sm:bottom-6 sm:right-6 ${
        hidden ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
      }`}
      aria-hidden={hidden || undefined}
    >
      {/* details panel */}
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={c.panelTitle}
          className="toast-in w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line-strong bg-surface/95 p-5 text-[0.875rem] shadow-2xl backdrop-blur-xl"
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

      {/* transient messages: verdict, evidence toast, or the one-time hint */}
      <div role="status" aria-live="polite" className="flex flex-col items-end">
        {!open && notice?.kind === "rejected" ? (
          <div
            key={notice.seq}
            className="toast-in w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-[var(--accent-line)] bg-[rgb(36_26_64/0.95)] p-3.5 shadow-2xl backdrop-blur-xl sm:p-4"
          >
            <p className="label text-accent">{c.verdictTitle}</p>
            <p className="mt-1.5 text-[0.875rem] leading-snug text-ink sm:text-[0.9375rem]">
              {fill(c.verdictText, { alpha: notice.alpha ?? alpha })}
            </p>
          </div>
        ) : null}
        {!open && notice?.kind === "evidence" ? (
          <p
            key={notice.seq}
            className="toast-in max-w-[min(20rem,calc(100vw-2rem))] rounded-full border border-line-strong bg-surface/95 px-3 py-1 text-[0.75rem] text-ink shadow-lg backdrop-blur-xl sm:px-3.5 sm:py-1.5 sm:text-[0.8125rem]"
          >
            <span className="font-mono text-accent">+{notice.weight?.toFixed(2)}</span>{" "}
            <span className="text-ink-2">{notice.label}</span>
          </p>
        ) : null}
        {showNudge ? (
          <div className="toast-in relative w-[min(17rem,calc(100vw-2rem))] rounded-2xl border border-[var(--accent-line)] bg-surface/95 p-3.5 text-[0.8125rem] leading-snug text-ink-2 shadow-2xl backdrop-blur-xl">
            {c.nudge}
            <button
              type="button"
              onClick={dismissNudge}
              className="mt-2 block text-[0.8125rem] font-medium text-accent hover:text-ink"
            >
              {c.nudgeDismiss}
            </button>
            <span
              aria-hidden
              className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b border-r border-[var(--accent-line)] bg-surface"
            />
          </div>
        ) : null}
      </div>

      {/* the badge */}
      <div className="relative">
        {notice?.kind === "rejected" ? (
          <span key={notice.seq} aria-hidden className="pointer-events-none absolute inset-0">
            <span className="verdict-ripple absolute inset-0 rounded-2xl border-2 border-accent" />
            {BURST.map((b, i) => (
              <span
                key={i}
                className="burst-dot absolute left-1/2 top-1/2 rounded-full bg-accent"
                style={
                  {
                    width: b.size,
                    height: b.size,
                    "--dx": `${b.dx}px`,
                    "--dy": `${b.dy}px`,
                    animationDelay: `${(i % 4) * 40}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
        ) : null}
        {notice?.kind === "evidence" ? (
          <span
            key={notice.seq}
            aria-hidden
            className="badge-ripple pointer-events-none absolute inset-0 rounded-2xl border border-accent"
          />
        ) : null}

        <button
          ref={buttonRef}
          type="button"
          tabIndex={hidden ? -1 : undefined}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => {
            dismissNudge();
            clearNotice();
            setOpen((v) => !v);
          }}
          className={`relative block w-auto rounded-2xl border px-3 py-2 text-left shadow-xl sm:w-[16.5rem] sm:px-4 sm:py-3 backdrop-blur-xl transition-colors duration-500 ${
            rejected
              ? "border-[var(--accent-line)] bg-[rgb(52_36_96/0.9)]"
              : "border-line-strong bg-surface/90 hover:border-[var(--accent-line)]"
          }`}
        >
          <span className="hidden items-center justify-between gap-3 sm:flex">
            <span className="label inline-flex items-center gap-2 text-accent">
              <span aria-hidden className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
              {c.badgeTitle}
            </span>
          </span>
          <span className="flex items-center gap-2 font-mono text-[0.75rem] tabular-nums text-ink sm:mt-1.5 sm:text-[0.8125rem]">
            <span aria-hidden className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent sm:hidden" />
            <span className="sr-only sm:hidden">{c.badgeTitle}: </span>
            {status}
          </span>
          <span aria-hidden className="mt-1.5 block h-1 overflow-hidden rounded-full bg-[var(--line-strong)] sm:mt-2.5 sm:h-1.5">
            <span
              className={`block h-full rounded-full ${rejected ? "bg-accent" : "bg-[var(--accent-strong)]"}`}
              style={{ width: `${progress * 100}%` }}
            />
          </span>
          <span className="mt-1.5 hidden text-[0.6875rem] tabular-nums text-ink-3 sm:block">
            {rejected
              ? fill(c.badgeProgressRejected, { alpha })
              : fill(c.badgeProgress, { z: z.toFixed(2), critical: critical.toFixed(2), alpha })}
          </span>
          <span className="sr-only">. {c.badgeDetails}</span>
        </button>
      </div>
    </div>
  );
}
