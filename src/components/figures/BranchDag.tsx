/**
 * Conceptual causal diagram (not a result): shared causes drive both the closure
 * decision and customer behavior, confounding a naive comparison.
 * Two layouts so labels stay legible: wide (md+) and tall (mobile).
 */
type Node = { x: number; y: number; w: number; title: string; sub: string; focus?: boolean };
type Layout = { w: number; h: number; nodes: [Node, Node, Node] };

const wide: Layout = {
  w: 640,
  h: 300,
  nodes: [
    { x: 320, y: 52, w: 300, title: "Branch & local conditions", sub: "performance, neighborhood trends" },
    { x: 130, y: 240, w: 210, title: "Closure decision", sub: "chosen, not random" },
    { x: 510, y: 240, w: 210, title: "Customer behavior", sub: "channels, activity, attrition", focus: true },
  ],
};

const tall: Layout = {
  w: 340,
  h: 430,
  nodes: [
    { x: 170, y: 50, w: 280, title: "Branch & local conditions", sub: "performance, neighborhood trends" },
    { x: 90, y: 230, w: 160, title: "Closure decision", sub: "chosen, not random" },
    { x: 170, y: 380, w: 220, title: "Customer behavior", sub: "channels, activity, attrition", focus: true },
  ],
};

function Diagram({ layout, className }: { layout: Layout; className: string }) {
  const [c, t, y] = layout.nodes;
  const H = 30; // half node height
  const edge = (a: Node, b: Node, inset = 8) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    // start/end at the node box edges (approx.) along the line
    const sa = Math.min(Math.abs((a.w / 2 + inset) / (dx || 1e-6)), Math.abs((H + inset) / (dy || 1e-6))) * len;
    const sb = Math.min(Math.abs((b.w / 2 + inset) / (dx || 1e-6)), Math.abs((H + inset) / (dy || 1e-6))) * len;
    return {
      x1: a.x + (dx / len) * sa,
      y1: a.y + (dy / len) * sa,
      x2: b.x - (dx / len) * sb,
      y2: b.y - (dy / len) * sb,
    };
  };
  const e1 = edge(c, t);
  const e2 = edge(c, y);
  const e3 = edge(t, y);
  const midE3 = { x: (e3.x1 + e3.x2) / 2, y: (e3.y1 + e3.y2) / 2 };

  return (
    <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className={className} role="img" aria-labelledby="dag-title dag-desc">
      <title id="dag-title">Why a naive comparison misleads</title>
      <desc id="dag-desc">
        Branch and local conditions influence both the closure decision and customer behavior. The effect of interest
        is the arrow from the closure decision to customer behavior.
      </desc>
      <defs>
        <marker id="arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="var(--ink-3)" />
        </marker>
        <marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" className="hue-fill" />
        </marker>
      </defs>
      <line {...e1} stroke="var(--ink-3)" strokeWidth="1.25" markerEnd="url(#arrow-muted)" />
      <line {...e2} stroke="var(--ink-3)" strokeWidth="1.25" markerEnd="url(#arrow-muted)" />
      <line {...e3} className="hue-stroke" strokeWidth="2" markerEnd="url(#arrow-accent)" />
      <g transform={`translate(${midE3.x} ${midE3.y - 12})`}>
        <text textAnchor="middle" className="hue-fill" fontSize="13" fontWeight="600">
          effect of interest
        </text>
      </g>
      {layout.nodes.map((n) => (
        <g key={n.title} transform={`translate(${n.x - n.w / 2} ${n.y - H})`}>
          <rect
            width={n.w}
            height={H * 2}
            rx="10"
            fill="var(--surface-2)"
            stroke={n.focus ? undefined : "var(--line-strong)"}
            className={n.focus ? "hue-stroke" : undefined}
          />
          <text x={n.w / 2} y={H - 3} textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--ink)">
            {n.title}
          </text>
          <text x={n.w / 2} y={H + 16} textAnchor="middle" fontSize="12.5" fill="var(--ink-3)">
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function BranchDag() {
  return (
    <div className="rounded-xl border border-line bg-surface/60 p-4 md:p-8">
      <Diagram layout={wide} className="mx-auto hidden w-full max-w-2xl sm:block" />
      <Diagram layout={tall} className="mx-auto block w-full max-w-sm sm:hidden" />
    </div>
  );
}
