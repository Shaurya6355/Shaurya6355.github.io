"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { gaussian, mulberry32 } from "@/lib/random";

/**
 * Hero backdrop: two seeded point clouds and a decision boundary.
 * "You're the classifier": on devices with a fine pointer (and without reduced
 * motion), the boundary bends toward the cursor and points recolor by the side of
 * the boundary they fall on. Purely decorative (aria-hidden); points are computed
 * once, deterministically, so server and client render the same baseline.
 */
const W = 1200;
const H = 800;
const BEND_WIDTH = 170; // how far along x the boundary bends around the cursor (SVG units)
const EASE = 0.14; // per-frame easing toward the target bend

function baseBoundary(x: number) {
  return 430 + 120 * Math.sin((x - 250) / 260) - 0.08 * (x - 600);
}

const points = (() => {
  const rand = mulberry32(20261019);
  const out: { x: number; y: number; r: number }[] = [];
  const clusters = [
    { cx: 820, cy: 250, sx: 210, sy: 120, n: 170 },
    { cx: 700, cy: 600, sx: 260, sy: 120, n: 190 },
  ];
  for (const c of clusters) {
    for (let i = 0; i < c.n; i++) {
      const x = c.cx + gaussian(rand) * c.sx;
      const y = c.cy + gaussian(rand) * c.sy;
      if (x < 0 || x > W || y < 0 || y > H) continue;
      out.push({ x, y, r: 1.4 + rand() * 1.4 });
    }
  }
  return out;
})();

interface Bend {
  x: number; // cursor x (SVG units)
  dy: number; // vertical offset applied at the cursor
}

function boundaryAt(x: number, bend: Bend) {
  const g = Math.exp(-((x - bend.x) ** 2) / (2 * BEND_WIDTH ** 2));
  return baseBoundary(x) + bend.dy * g;
}

function pathFor(bend: Bend) {
  const steps = 60;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (W * i) / steps;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${boundaryAt(x, bend).toFixed(1)}`;
  }
  return d;
}

const REST: Bend = { x: 600, dy: 0 };
const restPath = pathFor(REST);
const restSide = points.map((p) => p.y < boundaryAt(p.x, REST));

export function HeroField({
  hostRef,
  onInteractiveChange,
}: {
  /** Element that receives pointer events (the hero section). */
  hostRef: RefObject<HTMLElement | null>;
  onInteractiveChange?: (interactive: boolean) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setInteractive(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => onInteractiveChange?.(interactive), [interactive, onInteractiveChange]);

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    if (!interactive || !host || !svg) return;

    const current: Bend = { ...REST };
    let target: Bend = { ...REST };
    let frame = 0;
    const sides = [...restSide];

    const render = () => {
      current.x += (target.x - current.x) * EASE;
      current.dy += (target.dy - current.dy) * EASE;
      const d = pathFor(current);
      lineRef.current?.setAttribute("d", d);
      glowRef.current?.setAttribute("d", d);
      points.forEach((p, i) => {
        const above = p.y < boundaryAt(p.x, current);
        if (above !== sides[i]) {
          sides[i] = above;
          dotRefs.current[i]?.setAttribute("data-side", above ? "a" : "b");
        }
      });
      const settled = Math.abs(target.x - current.x) < 0.5 && Math.abs(target.dy - current.dy) < 0.5;
      frame = settled ? 0 : requestAnimationFrame(render);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      const x = Math.min(Math.max(pt.x, 0), W);
      target = { x, dy: Math.min(Math.max(pt.y, 0), H) - baseBoundary(x) };
      kick();
    };
    const onLeave = () => {
      target = { x: current.x, dy: 0 };
      kick();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [interactive, hostRef]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="hero-field absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="hero-glow" cx="68%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#7c5cd6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#7c5cd6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.05" />
          <stop offset="45%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="hero-mask">
          <rect width={W} height={H} fill="url(#hero-fade)" />
        </mask>
      </defs>
      <rect width={W} height={H} fill="url(#hero-glow)" />
      <g mask="url(#hero-mask)">
        <g stroke="rgb(243 240 248 / 0.05)" strokeWidth="1">
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={i * 100} x2={i * 100} y1={0} y2={H} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1={0} x2={W} y1={i * 100} y2={i * 100} />
          ))}
        </g>
        <path ref={lineRef} d={restPath} fill="none" stroke="#b39cf5" strokeOpacity="0.55" strokeWidth="1.25" />
        <path
          ref={glowRef}
          d={restPath}
          fill="none"
          stroke="#b39cf5"
          strokeOpacity="0.07"
          strokeWidth="56"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            data-side={restSide[i] ? "a" : "b"}
            className="hero-dot"
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r={p.r.toFixed(2)}
          />
        ))}
      </g>
    </svg>
  );
}
