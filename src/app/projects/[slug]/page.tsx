import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { EvidenceTag } from "@/components/hypothesis/EvidenceTag";
import { Blocks } from "@/components/project/Blocks";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitHubIcon } from "@/components/ui/Icons";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { copy } from "@/content/copy";
import { getProject, projects, type CaseSection } from "@/content/projects";
import { isPending, known, showReviewNotes } from "@/lib/pending";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}/` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}/`,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}

/** Sections whose only content is placeholders disappear in production. */
function visibleSections(sections: CaseSection[]) {
  return sections
    .map((s) => ({ ...s, blocks: s.blocks.filter((b) => b.kind !== "pending" || showReviewNotes) }))
    .filter((s) => s.blocks.length > 0);
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const sections = visibleSections(project.sections);
  const year = known(project.year);

  return (
    <article style={{ "--hue": project.hue } as CSSProperties}>
      <header className="hue-wash border-b border-line">
        <div className="container-page pb-14 pt-[calc(var(--nav-h)+3.5rem)] md:pb-20 md:pt-[calc(var(--nav-h)+5rem)]">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-1.5 text-[0.875rem] text-ink-3 transition-colors hover:text-ink"
          >
            <ArrowLeft width={14} height={14} className="transition-transform group-hover:-translate-x-0.5" />
            {copy.caseStudy.back}
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.875rem]">
            <span className="tabular-nums text-ink-3">{project.number}</span>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <span className="label hue-text">{project.status}</span>
            {year ? (
              <>
                <span aria-hidden className="h-3 w-px bg-line-strong" />
                <span className="tabular-nums text-ink-3">{year}</span>
              </>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-[clamp(1.1rem,1.8vw,1.3rem)] leading-relaxed text-ink-2">{project.summary}</p>
          <div className="mt-6">
            <EvidenceTag id={`case:${project.slug}`} pending={copy.hypothesis.tagCasePending} />
          </div>

          <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-6 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-4">
            {project.role !== undefined && (showReviewNotes || !isPending(project.role)) ? (
              <div>
                <dt className="label text-ink-3">{copy.caseStudy.role}</dt>
                <dd className="mt-2 text-ink-2">
                  {isPending(project.role) ? <ReviewNote note={project.role.pending} inline /> : project.role}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="label text-ink-3">{copy.caseStudy.themes}</dt>
              <dd className="mt-2 text-ink-2">{project.themes.join(" · ")}</dd>
            </div>
            {project.stack ? (
              <div className="lg:col-span-1">
                <dt className="label text-ink-3">{copy.caseStudy.stack}</dt>
                <dd className="mt-2 text-ink-2">{project.stack.join(" · ")}</dd>
              </div>
            ) : null}
            {project.links.length > 0 ? (
              <div>
                <dt className="label text-ink-3">{copy.caseStudy.links}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.links.map((l) => (
                    <ExternalLink
                      key={l.href}
                      href={l.href}
                      className="hue-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.875rem] text-ink transition-colors hover:bg-surface-2"
                    >
                      {l.href.includes("github.com") ? <GitHubIcon width={14} height={14} /> : null}
                      {l.label}
                      <ArrowUpRight width={13} height={13} />
                    </ExternalLink>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      <div className="container-page">
        {sections.map((section, i) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="grid gap-6 border-b border-line py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-16 md:py-20"
          >
            <div>
              <div className="md:sticky md:top-[calc(var(--nav-h)+2.5rem)]">
                <span className="text-[0.8125rem] tabular-nums hue-text">{String(i + 1).padStart(2, "0")}</span>
                <h2
                  id={`${section.id}-heading`}
                  className="mt-1.5 text-[1.625rem] font-semibold leading-tight tracking-[-0.025em] text-ink md:text-[1.875rem]"
                >
                  {section.title}
                </h2>
              </div>
            </div>
            <div className="min-w-0 max-w-3xl">
              <Blocks blocks={section.blocks} />
            </div>
          </section>
        ))}
      </div>

      <nav aria-label="More projects" className="container-page grid gap-4 py-14 sm:grid-cols-2 md:py-20">
        {[
          { p: prev, dir: "Previous" as const },
          { p: next, dir: "Next" as const },
        ].map(({ p, dir }) => (
          <Link
            key={dir}
            href={`/projects/${p.slug}/`}
            style={{ "--hue": p.hue } as CSSProperties}
            className={`group rounded-2xl border border-line bg-surface/50 p-6 transition-colors hover:hue-border hover:bg-surface ${dir === "Next" ? "sm:text-right" : ""}`}
          >
            <span className={`flex items-center gap-1.5 text-[0.8125rem] text-ink-3 ${dir === "Next" ? "sm:justify-end" : ""}`}>
              {dir === "Previous" ? <ArrowLeft width={13} height={13} /> : null}
              {dir === "Previous" ? copy.caseStudy.previous : copy.caseStudy.next}
              {dir === "Next" ? <ArrowRight width={13} height={13} /> : null}
            </span>
            <span className="mt-2 block text-[1.375rem] font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:hue-text">
              {p.title}
            </span>
            <span className="mt-1 block text-[0.875rem] text-ink-3">{p.status}</span>
          </Link>
        ))}
      </nav>
    </article>
  );
}
