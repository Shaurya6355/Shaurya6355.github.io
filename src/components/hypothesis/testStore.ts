import type { Alpha } from "@/lib/hypothesis";

/**
 * Tiny external store for the live hypothesis test, read with useSyncExternalStore.
 * Collected evidence, α and whether the visitor has seen the badge hint are mirrored to
 * sessionStorage (this tab only). Notices (evidence toasts, the verdict) live in memory
 * and clear themselves. Storage failures never break the page.
 */
export interface Notice {
  seq: number;
  kind: "evidence" | "rejected";
  label?: string;
  weight?: number;
  alpha?: Alpha;
}

export interface TestSnapshot {
  collected: ReadonlySet<string>;
  alpha: Alpha | null; // null → use the default
  nudgeSeen: boolean;
  notice: Notice | null;
}

const KEY = "h0-test";
const SERVER: TestSnapshot = { collected: new Set(), alpha: null, nudgeSeen: false, notice: null };
let snapshot: TestSnapshot | null = null;
let seq = 0;
const listeners = new Set<() => void>();

function read(): TestSnapshot {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { collected?: string[]; alpha?: Alpha; nudgeSeen?: boolean };
      return {
        collected: new Set(parsed.collected ?? []),
        alpha: parsed.alpha ?? null,
        nudgeSeen: Boolean(parsed.nudgeSeen),
        notice: null,
      };
    }
  } catch {
    /* unavailable or malformed: start fresh */
  }
  return { collected: new Set(), alpha: null, nudgeSeen: false, notice: null };
}

function write(next: TestSnapshot) {
  snapshot = next;
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ collected: [...next.collected], alpha: next.alpha, nudgeSeen: next.nudgeSeen }),
    );
  } catch {
    /* storage unavailable: keep the in-memory state */
  }
  listeners.forEach((l) => l());
}

export const testStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): TestSnapshot {
    if (!snapshot) snapshot = read();
    return snapshot;
  },
  getServerSnapshot(): TestSnapshot {
    return SERVER;
  },
  /** Adds a piece of evidence. Returns false if it was already collected. */
  collect(id: string): boolean {
    const current = testStore.getSnapshot();
    if (current.collected.has(id)) return false;
    write({ ...current, collected: new Set(current.collected).add(id) });
    return true;
  },
  setAlpha(alpha: Alpha) {
    write({ ...testStore.getSnapshot(), alpha });
  },
  reset() {
    write({ ...testStore.getSnapshot(), collected: new Set(), notice: null });
  },
  dismissNudge() {
    const current = testStore.getSnapshot();
    if (!current.nudgeSeen) write({ ...current, nudgeSeen: true });
  },
  /** Show a transient notice; it clears itself after `ttl` ms unless replaced. */
  notify(notice: Omit<Notice, "seq">, ttl: number) {
    // The verdict outranks evidence toasts: don't cover it while it's showing.
    if (notice.kind === "evidence" && testStore.getSnapshot().notice?.kind === "rejected") return;
    const id = ++seq;
    write({ ...testStore.getSnapshot(), notice: { ...notice, seq: id } });
    window.setTimeout(() => {
      const current = testStore.getSnapshot();
      if (current.notice?.seq === id) write({ ...current, notice: null });
    }, ttl);
  },
  clearNotice() {
    const current = testStore.getSnapshot();
    if (current.notice) write({ ...current, notice: null });
  },
};
