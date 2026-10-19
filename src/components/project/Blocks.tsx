import type { ReactNode } from "react";

import { BranchDag } from "@/components/figures/BranchDag";
import { MovielensHeadline } from "@/components/figures/MovielensHeadline";
import { MovielensSplit } from "@/components/figures/MovielensSplit";
import { MovielensSweep } from "@/components/figures/MovielensSweep";
import { RnWorkflow } from "@/components/figures/RnWorkflow";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { RichText } from "@/components/ui/RichText";
import type { Block, FigureId } from "@/content/projects";

const figures: Record<FigureId, () => ReactNode> = {
  "rn-workflow": () => <RnWorkflow />,
  "branch-dag": () => <BranchDag />,
  "movielens-headline": () => <MovielensHeadline />,
  "movielens-sweep": () => <MovielensSweep />,
  "movielens-split": () => <MovielensSplit />,
};

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return (
        <p className="text-[clamp(1.2rem,2vw,1.4rem)] leading-[1.5] tracking-[-0.01em] text-ink">
          <RichText text={block.text} />
        </p>
      );
    case "p":
      return (
        <p className="prose-body">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="prose-body">
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "grid":
      return (
        <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-[var(--line)] sm:grid-cols-2">
          {block.items.map((item) => (
            <li key={item.title} className="bg-surface p-5">
              <p className="font-semibold tracking-[-0.01em] text-ink">{item.title}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">
                <RichText text={item.text} />
              </p>
            </li>
          ))}
        </ul>
      );
    case "stats":
      return (
        <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-[var(--line)] sm:grid-cols-3">
          {block.items.map((s) => (
            <div key={s.label} className="flex flex-col bg-surface p-5">
              <dt className="order-2 mt-2 text-[0.875rem] text-ink-2">{s.label}</dt>
              <dd className="order-1 text-[2rem] font-semibold leading-none tracking-[-0.03em] hue-text">{s.value}</dd>
              {s.note ? <dd className="order-3 mt-1 text-[0.8125rem] tabular-nums text-ink-3">{s.note}</dd> : null}
            </div>
          ))}
        </dl>
      );
    case "figure":
      return (
        <figure>
          {figures[block.figure]()}
          <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-ink-3">{block.caption}</figcaption>
        </figure>
      );
    case "callout":
      return (
        <aside className="hue-border rounded-xl border border-l-2 bg-surface/60 p-5">
          <p className="label hue-text">{block.title}</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
            <RichText text={block.text} />
          </p>
        </aside>
      );
    case "status":
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          {block.built ? (
            <div>
              <p className="label hue-text">{block.builtLabel ?? "Built"}</p>
              <ul className="prose-body mt-3 text-[0.9375rem]">
                {block.built.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div>
            <p className="label text-ink-3">{block.nextLabel ?? "Next"}</p>
            <ul className="prose-body mt-3 text-[0.9375rem]">
              {block.next.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "pending":
      return <ReviewNote note={block.note} />;
  }
}
