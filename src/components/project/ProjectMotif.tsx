import sweep from "@/content/data/movielens/sweep.json";
import type { ProjectSlug } from "@/content/projects";

/**
 * Small line-drawn motif that gives each project card its own identity.
 * Colors come from the card's --hue. Decorative only.
 */
export function ProjectMotif({ slug }: { slug: ProjectSlug }) {
  return (
    <svg aria-hidden viewBox="0 0 200 120" className="h-full w-full" fill="none">
      {slug === "research-navigator" ? <Workflow /> : null}
      {slug === "branch-closure-analysis" ? <Dag /> : null}
      {slug === "movie-recommender" ? <Sweep /> : null}
    </svg>
  );
}

function Workflow() {
  const xs = [22, 62, 102, 142, 178];
  return (
    <g strokeWidth="1.25">
      <line x1="22" x2="178" y1="62" y2="62" className="hue-stroke" strokeOpacity="0.5" />
      <path d="M142 54 C 142 22, 62 22, 62 54" className="hue-stroke" strokeOpacity="0.45" />
      <path d="M66 50 l-4 4 l-4 -4" className="hue-stroke" strokeOpacity="0.6" />
      {xs.map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={62}
          r={i === xs.length - 1 ? 7 : 5}
          className={i === xs.length - 1 ? "hue-fill" : "hue-stroke"}
          fill={i === xs.length - 1 ? undefined : "var(--bg)"}
        />
      ))}
    </g>
  );
}

function Dag() {
  return (
    <g strokeWidth="1.25">
      <path d="M100 24 L46 92" className="hue-stroke" strokeOpacity="0.4" />
      <path d="M100 24 L154 92" className="hue-stroke" strokeOpacity="0.4" />
      <path d="M58 96 L142 96" className="hue-stroke" />
      <path d="M136 91 l6 5 l-6 5" className="hue-stroke" />
      <circle cx="100" cy="22" r="7" className="hue-stroke" fill="var(--bg)" strokeDasharray="2 2.5" />
      <circle cx="46" cy="96" r="7" className="hue-stroke" fill="var(--bg)" />
      <circle cx="154" cy="96" r="7" className="hue-fill" />
    </g>
  );
}

function Sweep() {
  const entries = sweep.entries;
  const xs = entries.map((e) => e["coverage@10"]);
  const ys = entries.map((e) => e["ndcg@10"]);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const sx = (v: number) => 20 + ((v - x0) / (x1 - x0)) * 160;
  const sy = (v: number) => 102 - ((v - y0) / (y1 - y0)) * 84;
  const best = sweep.best;
  return (
    <g>
      <line x1="16" x2="186" y1="108" y2="108" stroke="var(--line-strong)" />
      <line x1="16" x2="16" y1="12" y2="108" stroke="var(--line-strong)" />
      {entries.map((e, i) => (
        <circle
          key={i}
          cx={sx(e["coverage@10"])}
          cy={sy(e["ndcg@10"])}
          r="3"
          className="hue-fill"
          fillOpacity={e.alpha === 10 ? 0.95 : e.alpha === 40 ? 0.55 : 0.25}
        />
      ))}
      <circle
        cx={sx(best["coverage@10"])}
        cy={sy(best["ndcg@10"])}
        r="7"
        className="hue-stroke"
        strokeWidth="1.25"
      />
    </g>
  );
}
