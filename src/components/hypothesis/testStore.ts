import type { Alpha } from "@/lib/hypothesis";

/**
 * Tiny external store for the live hypothesis test, read with useSyncExternalStore.
 * State lives in memory and is mirrored to sessionStorage (this tab only), so it
 * survives navigation between pages. Storage failures never break the page.
 */
export interface TestSnapshot {
  collected: ReadonlySet<string>;
  alpha: Alpha | null; // null → use the default
}

const KEY = "h0-test";
const SERVER: TestSnapshot = { collected: new Set(), alpha: null };
let snapshot: TestSnapshot | null = null;
const listeners = new Set<() => void>();

function read(): TestSnapshot {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { collected?: string[]; alpha?: Alpha };
      return { collected: new Set(parsed.collected ?? []), alpha: parsed.alpha ?? null };
    }
  } catch {
    /* unavailable or malformed: start fresh */
  }
  return { collected: new Set(), alpha: null };
}

function write(next: TestSnapshot) {
  snapshot = next;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify({ collected: [...next.collected], alpha: next.alpha }));
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
  collect(id: string) {
    const current = testStore.getSnapshot();
    if (current.collected.has(id)) return;
    write({ ...current, collected: new Set(current.collected).add(id) });
  },
  setAlpha(alpha: Alpha) {
    write({ ...testStore.getSnapshot(), alpha });
  },
  reset() {
    write({ ...testStore.getSnapshot(), collected: new Set() });
  },
};
