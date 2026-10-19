import { gaussian, mulberry32 } from "@/lib/random";

/**
 * Decorative backdrop for the hero: two seeded point clouds separated by a smooth
 * decision boundary. Computed at build time; purely decorative (aria-hidden).
 */
const W = 1200;
const H = 800;

function boundaryY(x: number) {
  return 430 + 120 * Math.sin((x - 250) / 260) - 0.08 * (x - 600);
}

function buildPoints() {
  const rand = mulberry32(20261019);
  const points: { x: number; y: number; r: number; cls: 0 | 1 }[] = [];
  const clusters = [
    { cx: 820, cy: 250, sx: 210, sy: 120, cls: 1 as const, n: 170 },
    { cx: 700, cy: 600, sx: 260, sy: 120, cls: 0 as const, n: 190 },
  ];
  for (const c of clusters) {
    for (let i = 0; i < c.n; i++) {
      const x = c.cx + gaussian(rand) * c.sx;
      const y = c.cy + gaussian(rand) * c.sy;
      if (x < 0 || x > W || y < 0 || y > H) continue;
      points.push({ x, y, r: 1.4 + rand() * 1.4, cls: c.cls });
    }
  }
  return points;
}

const points = buildPoints();

const boundaryPath = (() => {
  const steps = 48;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (W * i) / steps;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${boundaryY(x).toFixed(1)}`;
  }
  return d;
})();

export function HeroField() {
  return (
    <svg
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
        {/* faint grid */}
        <g stroke="rgb(243 240 248 / 0.05)" strokeWidth="1">
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={i * 100} x2={i * 100} y1={0} y2={H} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1={0} x2={W} y1={i * 100} y2={i * 100} />
          ))}
        </g>
        <path d={boundaryPath} fill="none" stroke="#b39cf5" strokeOpacity="0.55" strokeWidth="1.25" />
        <path
          d={boundaryPath}
          fill="none"
          stroke="#b39cf5"
          strokeOpacity="0.07"
          strokeWidth="56"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r={p.r.toFixed(2)}
            fill={p.cls === 1 ? "#b39cf5" : "#8f899e"}
            fillOpacity={p.cls === 1 ? 0.8 : 0.45}
          />
        ))}
      </g>
    </svg>
  );
}
