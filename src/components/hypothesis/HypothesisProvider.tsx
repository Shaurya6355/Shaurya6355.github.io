"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

import { isRejected, pValue, statistic, type Alpha, type EvidenceItem } from "@/lib/hypothesis";

import { testStore } from "./testStore";

interface HypothesisState {
  evidence: readonly EvidenceItem[];
  collected: ReadonlySet<string>;
  alpha: Alpha;
  z: number;
  p: number;
  rejected: boolean;
  collect: (id: string) => void;
  setAlpha: (alpha: Alpha) => void;
  reset: () => void;
}

const Ctx = createContext<HypothesisState | null>(null);

export function HypothesisProvider({
  evidence,
  baseline,
  defaultAlpha,
  sectionIds,
  children,
}: {
  evidence: readonly EvidenceItem[];
  baseline: number;
  defaultAlpha: Alpha;
  sectionIds: readonly string[];
  children: ReactNode;
}) {
  const snap = useSyncExternalStore(testStore.subscribe, testStore.getSnapshot, testStore.getServerSnapshot);
  const pathname = usePathname();

  // Evidence: opening a case study.
  useEffect(() => {
    const match = /^\/projects\/([^/]+)\/?$/.exec(pathname ?? "");
    if (match) testStore.collect(`case:${match[1]}`);
  }, [pathname]);

  // Evidence: homepage sections that scroll through the middle of the screen.
  useEffect(() => {
    if (pathname !== "/") return;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && testStore.collect(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, sectionIds]);

  // Evidence: opening the résumé from anywhere.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (link && /\/resume\.pdf$/.test(link.getAttribute("href") ?? "")) testStore.collect("resume");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const value = useMemo<HypothesisState>(() => {
    const known = new Set(evidence.map((e) => e.id));
    const collected = new Set([...snap.collected].filter((id) => known.has(id)));
    const alpha = snap.alpha ?? defaultAlpha;
    const z = statistic(baseline, evidence, collected);
    return {
      evidence,
      collected,
      alpha,
      z,
      p: pValue(z),
      rejected: isRejected(z, alpha),
      collect: testStore.collect,
      setAlpha: testStore.setAlpha,
      reset: testStore.reset,
    };
  }, [snap, baseline, evidence, defaultAlpha]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHypothesis(): HypothesisState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHypothesis must be used inside HypothesisProvider");
  return ctx;
}
