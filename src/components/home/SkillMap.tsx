"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { useHypothesis } from "@/components/hypothesis/HypothesisProvider";
import { ArrowUpRight } from "@/components/ui/Icons";
import { copy } from "@/content/copy";
import type { ProjectSlug } from "@/content/projects";
import { methodLinks, methods } from "@/content/skills";
import { fill } from "@/lib/fill";

const c = copy.skillMap;

export interface MapProject {
  slug: ProjectSlug;
  number: string;
  title: string;
  hue: number;
}

type Selection = { kind: "method"; id: string } | { kind: "project"; id: ProjectSlug } | null;

const ROW = 40; // method button height (px)
const GAP = 8;
const HEIGHT = methods.length * ROW + (methods.length - 1) * GAP;
const PROJECT_H = 92;

const methodY = (i: number) => i * (ROW + GAP) + ROW / 2;

export function SkillMap({ projects }: { projects: MapProject[] }) {
  const [selected, setSelected] = useState<Selection>(null);
  const [hovered, setHovered] = useState<Selection>(null);
  const focus = hovered ?? selected;

  const projectY = (i: number) => {
    const span = HEIGHT - PROJECT_H;
    return projects.length === 1 ? HEIGHT / 2 : (span * i) / (projects.length - 1) + PROJECT_H / 2;
  };

  const linkedMethods = useMemo(() => {
    const map = new Map<ProjectSlug, string[]>();
    for (const l of methodLinks) map.set(l.project, [...(map.get(l.project) ?? []), l.method]);
    return map;
  }, []);

  const isEdgeActive = (method: string, project: ProjectSlug) =>
    focus !== null && (focus.kind === "method" ? focus.id === method : focus.id === project);

  const isNodeRelated = (kind: "method" | "project", id: string) => {
    if (!focus) return true;
    if (focus.kind === kind) return focus.id === id;
    return methodLinks.some((l) =>
      focus.kind === "method" ? l.method === focus.id && l.project === id : l.project === focus.id && l.method === id,
    );
  };

  const { collect } = useHypothesis();
  const toggle = (next: NonNullable<Selection>) => {
    collect("map");
    setSelected((cur) => (cur && cur.kind === next.kind && cur.id === next.id ? null : next));
  };

  const isSelected = (kind: "method" | "project", id: string) => selected?.kind === kind && selected.id === id;

  // Up/Down arrows move between buttons in the same column.
  const columnKeys = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (idx === -1) return;
    e.preventDefault();
    const next = e.key === "ArrowDown" ? Math.min(idx + 1, buttons.length - 1) : Math.max(idx - 1, 0);
    buttons[next]?.focus();
  };

  const nodeClass = (kind: "method" | "project", id: string) => {
    const sel = isSelected(kind, id);
    const related = isNodeRelated(kind, id);
    return [
      "border text-left transition-[opacity,border-color,background-color,color] duration-[var(--dur)]",
      sel
        ? "border-[var(--accent-line)] bg-accent-soft text-ink"
        : "border-line bg-surface/60 text-ink-2 hover:border-line-strong hover:text-ink",
      related ? "opacity-100" : "opacity-45",
    ].join(" ");
  };

  const methodButton = (m: (typeof methods)[number], compact = false) => (
    <button
      key={m.id}
      type="button"
      aria-pressed={isSelected("method", m.id)}
      onClick={() => toggle({ kind: "method", id: m.id })}
      onMouseEnter={() => setHovered({ kind: "method", id: m.id })}
      onMouseLeave={() => setHovered(null)}
      className={`${nodeClass("method", m.id)} ${compact ? "rounded-full px-3 py-1.5 text-[0.875rem]" : "flex h-10 w-full items-center rounded-lg px-3.5 text-[0.9375rem]"}`}
    >
      {m.label}
    </button>
  );

  const projectButton = (p: MapProject, compact = false) => (
    <button
      key={p.slug}
      type="button"
      aria-pressed={isSelected("project", p.slug)}
      onClick={() => toggle({ kind: "project", id: p.slug })}
      onMouseEnter={() => setHovered({ kind: "project", id: p.slug })}
      onMouseLeave={() => setHovered(null)}
      style={{ "--hue": p.hue } as CSSProperties}
      className={`${nodeClass("project", p.slug)} ${compact ? "rounded-full px-3 py-1.5 text-[0.875rem]" : "flex w-full flex-col justify-center rounded-lg px-4"}`}
    >
      {compact ? (
        p.title
      ) : (
        <>
          <span className="text-[0.75rem] tabular-nums hue-text">{p.number}</span>
          <span className="mt-1 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">{p.title}</span>
          <span className="mt-0.5 text-[0.8125rem] text-ink-3">
            {fill(c.methodCount, { count: linkedMethods.get(p.slug)?.length ?? 0 })}
          </span>
        </>
      )}
    </button>
  );

  return (
    <div>
      {/* Desktop / tablet: two columns joined by an SVG of links */}
      <div className="hidden md:grid md:grid-cols-[15rem_minmax(4rem,1fr)_16rem] lg:grid-cols-[16rem_minmax(6rem,1fr)_17rem]">
        <div role="group" aria-label={c.methodsLabel} onKeyDown={columnKeys} className="flex flex-col" style={{ gap: GAP }}>
          {methods.map((m) => methodButton(m))}
        </div>

        <svg
          aria-hidden
          className="h-full w-full"
          style={{ height: HEIGHT }}
          viewBox={`0 0 100 ${HEIGHT}`}
          preserveAspectRatio="none"
        >
          {methodLinks.map((l) => {
            const mi = methods.findIndex((m) => m.id === l.method);
            const pi = projects.findIndex((p) => p.slug === l.project);
            if (mi < 0 || pi < 0) return null;
            const y1 = methodY(mi);
            const y2 = projectY(pi);
            const active = isEdgeActive(l.method, l.project);
            return (
              <path
                key={`${l.method}-${l.project}`}
                d={`M0 ${y1} C 50 ${y1}, 50 ${y2}, 100 ${y2}`}
                fill="none"
                vectorEffect="non-scaling-stroke"
                stroke={active ? "var(--accent)" : "var(--ink)"}
                strokeOpacity={active ? 0.95 : focus ? 0.06 : 0.16}
                strokeWidth={active ? 1.75 : 1}
                className="transition-[stroke-opacity,stroke] duration-[var(--dur)]"
              />
            );
          })}
        </svg>

        <div role="group" aria-label={c.projectsLabel} onKeyDown={columnKeys} className="relative" style={{ height: HEIGHT }}>
          {projects.map((p, i) => (
            <div key={p.slug} className="absolute inset-x-0" style={{ top: projectY(i) - PROJECT_H / 2, height: PROJECT_H }}>
              <div className="flex h-full [&>button]:h-full">{projectButton(p)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: list-based alternative with the same state */}
      <div className="space-y-5 md:hidden">
        <div>
          <p className="label text-ink-3">{c.methodsLabel}</p>
          <div role="group" aria-label={c.methodsLabel} className="mt-3 flex flex-wrap gap-2">
            {methods.map((m) => methodButton(m, true))}
          </div>
        </div>
        <div>
          <p className="label text-ink-3">{c.projectsLabel}</p>
          <div role="group" aria-label={c.projectsLabel} className="mt-3 flex flex-wrap gap-2">
            {projects.map((p) => projectButton(p, true))}
          </div>
        </div>
      </div>

      <Detail selected={selected} projects={projects} onClear={() => setSelected(null)} />
    </div>
  );
}

function Detail({
  selected,
  projects,
  onClear,
}: {
  selected: Selection;
  projects: MapProject[];
  onClear: () => void;
}) {
  const { evidenceById, collected } = useHypothesis();
  const mapEvidence = evidenceById.get("map");
  const titleOf = (slug: ProjectSlug) => projects.find((p) => p.slug === slug)?.title ?? slug;
  const labelOf = (id: string) => methods.find((m) => m.id === id)?.label ?? id;
  const ref = useRef<HTMLDivElement>(null);

  let heading: string = c.emptyHeading;
  let rows: { key: string; title: string; how: string; href?: string }[] = [];

  if (selected?.kind === "method") {
    heading = labelOf(selected.id);
    rows = methodLinks
      .filter((l) => l.method === selected.id)
      .map((l) => ({ key: l.project, title: titleOf(l.project), how: l.how, href: `/projects/${l.project}/` }));
  } else if (selected?.kind === "project") {
    heading = titleOf(selected.id);
    rows = methodLinks
      .filter((l) => l.project === selected.id)
      .map((l) => ({ key: l.method, title: labelOf(l.method), how: l.how }));
  }

  return (
    <div ref={ref} aria-live="polite" className="mt-10 rounded-2xl border border-line bg-surface/50 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label text-ink-3">
            {selected?.kind === "method" ? c.methodEyebrow : selected?.kind === "project" ? c.projectEyebrow : c.emptyEyebrow}
          </p>
          <h3 className="mt-2 text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">{heading}</h3>
        </div>
        {selected ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-full border border-line-strong px-3 py-1 text-[0.8125rem] text-ink-2 transition-colors hover:text-ink"
          >
            {c.clear}
          </button>
        ) : null}
      </div>

      {selected === null ? (
        <>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">{c.emptyText}</p>
          {mapEvidence && !collected.has("map") ? (
            <p className="mt-3 inline-flex items-center gap-2 text-[0.8125rem] text-accent">
              <span aria-hidden className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
              {fill(copy.hypothesis.mapHint, { weight: mapEvidence.weight.toFixed(2) })}
            </p>
          ) : null}
        </>
      ) : (
        <ul className="mt-5 divide-y divide-line border-t border-line">
          {rows.map((row) => (
            <li key={row.key} className="grid gap-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
              {row.href ? (
                <Link href={row.href} className="inline-flex items-center gap-1 font-medium text-ink hover:text-accent">
                  {row.title}
                  <ArrowUpRight width={14} height={14} />
                </Link>
              ) : (
                <span className="font-medium text-ink">{row.title}</span>
              )}
              <span className="text-[0.9375rem] leading-relaxed text-ink-2">{row.how}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
