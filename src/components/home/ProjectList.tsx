import Link from "next/link";
import type { CSSProperties } from "react";

import { ProjectMotif } from "@/components/project/ProjectMotif";
import { ArrowUpRight } from "@/components/ui/Icons";
import { projects } from "@/content/projects";
import { known } from "@/lib/pending";

/** Numbered editorial list of projects, modeled on the reference's "Selected papers". */
export function ProjectList() {
  return (
    <ol className="border-t border-line">
      {projects.map((project) => {
        const year = known(project.year);
        return (
          <li
            key={project.slug}
            style={{ "--hue": project.hue } as CSSProperties}
            className="group relative border-b border-line"
          >
            <div className="grid gap-x-8 gap-y-5 py-8 transition-colors duration-[var(--dur)] md:grid-cols-[4.5rem_minmax(0,1fr)_13rem] md:py-10">
              <span
                aria-hidden
                className="text-[2rem] font-light leading-none tracking-[-0.02em] text-ink-3/70 tabular-nums transition-colors duration-[var(--dur)] group-hover:hue-text md:text-[2.5rem]"
              >
                {project.number}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8125rem]">
                  <span className="label hue-text">{project.status}</span>
                  {year ? (
                    <>
                      <span aria-hidden className="h-3 w-px bg-line-strong" />
                      <span className="tabular-nums text-ink-3">{year}</span>
                    </>
                  ) : null}
                  <span aria-hidden className="h-3 w-px bg-line-strong" />
                  <ul className="flex flex-wrap gap-1.5" aria-label="Themes">
                    {project.themes.map((theme) => (
                      <li
                        key={theme}
                        className="hue-border rounded-full border px-2.5 py-0.5 text-[0.75rem] leading-5 text-ink-2"
                      >
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-0.025em] text-ink">
                  <Link
                    href={`/projects/${project.slug}/`}
                    className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-lg focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-[var(--accent)]"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-ink-2">{project.summary}</p>
                <p className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-ink transition-colors group-hover:hue-text">
                  Read the case study
                  <ArrowUpRight
                    width={15}
                    height={15}
                    className="transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </p>
              </div>

              <div
                aria-hidden
                className="hidden h-[7.5rem] self-center rounded-xl border border-line bg-surface/60 p-3 transition-[border-color,background-color] duration-[var(--dur)] group-hover:hue-border group-hover:bg-surface md:block"
              >
                <ProjectMotif slug={project.slug} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
