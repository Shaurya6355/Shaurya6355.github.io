"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { CRITICAL_Z, isRejected, pValue, statistic, type Alpha, type EvidenceItem } from "@/lib/hypothesis";

import { testStore, type Notice } from "./testStore";

interface HypothesisState {
  evidence: readonly EvidenceItem[];
  evidenceById: ReadonlyMap<string, EvidenceItem>;
  collected: ReadonlySet<string>;
  alpha: Alpha;
  z: number;
  p: number;
  critical: number;
  rejected: boolean;
  notice: Notice | null;
  nudgeSeen: boolean;
  collect: (id: string) => void;
  setAlpha: (alpha: Alpha) => void;
  reset: () => void;
  dismissNudge: () => void;
  clearNotice: () => void;
}

const Ctx = createContext<HypothesisState | null>(null);

const EVIDENCE_TOAST_MS = 2800;
const VERDICT_MS = 6500;

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
  const evidenceById = useMemo(() => new Map(evidence.map((e) => [e.id, e])), [evidence]);

  const rejectedFor = useCallback(
    (collected: ReadonlySet<string>, alpha: Alpha) => isRejected(statistic(baseline, evidence, collected), alpha),
    [baseline, evidence],
  );

  /** Adds evidence and announces it: a toast, or the verdict if this tipped the test. */
  const collect = useCallback(
    (id: string) => {
      const item = evidenceById.get(id);
      if (!item) return;
      const before = testStore.getSnapshot();
      const alpha = before.alpha ?? defaultAlpha;
      const wasRejected = rejectedFor(before.collected, alpha);
      if (!testStore.collect(id)) return;
      if (!wasRejected && rejectedFor(testStore.getSnapshot().collected, alpha)) {
        testStore.notify({ kind: "rejected", alpha }, VERDICT_MS);
      } else {
        testStore.notify({ kind: "evidence", label: item.label, weight: item.weight }, EVIDENCE_TOAST_MS);
      }
    },
    [evidenceById, defaultAlpha, rejectedFor],
  );

  const setAlpha = useCallback(
    (alpha: Alpha) => {
      const before = testStore.getSnapshot();
      const wasRejected = rejectedFor(before.collected, before.alpha ?? defaultAlpha);
      testStore.setAlpha(alpha);
      if (!wasRejected && rejectedFor(before.collected, alpha)) testStore.notify({ kind: "rejected", alpha }, VERDICT_MS);
    },
    [defaultAlpha, rejectedFor],
  );

  // Evidence: opening a case study.
  useEffect(() => {
    const match = /^\/projects\/([^/]+)\/?$/.exec(pathname ?? "");
    if (match) collect(`case:${match[1]}`);
  }, [pathname, collect]);

  // Evidence: homepage sections that scroll through the middle of the screen.
  useEffect(() => {
    if (pathname !== "/") return;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && collect(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, sectionIds, collect]);

  // Evidence: opening the résumé from anywhere.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (link && /\/resume\.pdf$/.test(link.getAttribute("href") ?? "")) collect("resume");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [collect]);

  const value = useMemo<HypothesisState>(() => {
    const collected = new Set([...snap.collected].filter((id) => evidenceById.has(id)));
    const alpha = snap.alpha ?? defaultAlpha;
    const z = statistic(baseline, evidence, collected);
    return {
      evidence,
      evidenceById,
      collected,
      alpha,
      z,
      p: pValue(z),
      critical: CRITICAL_Z[alpha],
      rejected: isRejected(z, alpha),
      notice: snap.notice,
      nudgeSeen: snap.nudgeSeen,
      collect,
      setAlpha,
      reset: testStore.reset,
      dismissNudge: testStore.dismissNudge,
      clearNotice: testStore.clearNotice,
    };
  }, [snap, baseline, evidence, evidenceById, defaultAlpha, collect, setAlpha]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHypothesis(): HypothesisState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHypothesis must be used inside HypothesisProvider");
  return ctx;
}
