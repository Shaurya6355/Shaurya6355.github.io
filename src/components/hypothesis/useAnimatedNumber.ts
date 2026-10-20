"use client";

import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Smoothly follows `target` over `duration` ms (ease-out). Values are produced every
 * animation frame, so anything derived from them (a point on a curve, a shaded region)
 * moves continuously instead of jumping. Jumps immediately for reduced motion.
 */
export function useAnimatedNumber(target: number, duration = 800): number {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const span = reduce ? 0 : duration;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = span === 0 ? 1 : Math.min(1, (now - start) / span);
      const next = from + (target - from) * easeOutCubic(t);
      current.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
