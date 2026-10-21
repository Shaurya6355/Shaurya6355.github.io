import { HypothesisCard } from "@/components/hypothesis/HypothesisCard";
import { NullChart } from "@/components/hypothesis/NullChart";
import { AlphaPicker, Readout } from "@/components/hypothesis/TestControls";
import { ContactIcon } from "@/components/site/ContactIcon";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowRight, FileIcon } from "@/components/ui/Icons";
import { Pill } from "@/components/ui/Pill";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import { getContactLinks } from "@/lib/contact";

export function Hero() {
  const { links, missing } = getContactLinks();
  const resume = links.find((l) => l.kind === "resume");
  const email = links.find((l) => l.kind === "email");
  const profiles = links.filter((l) => l.kind === "github" || l.kind === "linkedin");

  return (
    <>
      <section id="hero" aria-labelledby="hero-name" className="relative isolate overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(48rem_30rem_at_78%_22%,var(--glow),transparent_70%)]"
        />
        <svg aria-hidden className="absolute inset-0 -z-10 h-full w-full opacity-50" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0H0V64" fill="none" stroke="var(--grid-line)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        <div className="container-page relative grid min-h-[min(92svh,54rem)] items-center gap-10 pb-14 pt-[calc(var(--nav-h)+2.5rem)] md:pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          {/* live chart: first on small screens, right column on large ones */}
          <div className="hero-rise lg:order-last">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="label inline-flex items-center gap-2 text-bold">
                <span aria-hidden className="live-dot h-2 w-2 rounded-full bg-bold" />
                {copy.hero.liveLabel}
              </span>
              <span className="text-[0.75rem] text-ink-3">{copy.hero.liveCaption}</span>
            </div>
            <NullChart />
          </div>

          <div>
            <h1
              id="hero-name"
              className="hero-rise text-[clamp(2.75rem,6.4vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink"
            >
              {site.name}
            </h1>

            <div className="hero-rise mt-7">
              <HypothesisCard />
            </div>

            <p className="hero-rise mt-6 max-w-xl text-[clamp(1.05rem,1.6vw,1.2rem)] leading-relaxed text-ink-2">
              {copy.hero.tagline}
            </p>

            <div className="hero-rise mt-6 max-w-xl space-y-4">
              <AlphaPicker />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Pill href="#approach" variant="primary" icon={<ArrowRight className="rotate-90" width={14} height={14} />}>
                  {copy.hero.cta}
                </Pill>
              </div>
              <Readout className="text-[0.9375rem] leading-relaxed text-ink-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact strip, as under the reference's hero */}
      <div className="border-b border-line">
        <div className="container-page flex flex-col gap-5 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Pill href="#work" variant="secondary" icon={<ArrowRight className="rotate-90" width={14} height={14} />}>
              {copy.hero.actionWork}
            </Pill>
            <Pill href="#experience" variant="ghost">
              {copy.hero.actionExperience}
            </Pill>
            <Pill href="#contact" variant="ghost">
              {copy.hero.actionContact}
            </Pill>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[0.9375rem] text-ink-3">{site.location}</span>
            <span aria-hidden className="hidden h-4 w-px bg-line-strong sm:block" />
            {email ? (
              <a href={email.href} className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-2 hover:text-ink">
                <ContactIcon kind="email" size={15} />
                {email.display}
              </a>
            ) : null}
            {profiles.map((link) => (
              <ExternalLink
                key={link.kind}
                href={link.href}
                aria-label={link.label}
                title={link.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink-2 transition-colors hover:border-[var(--accent-line)] hover:text-ink"
              >
                <ContactIcon kind={link.kind} />
              </ExternalLink>
            ))}
            {resume ? (
              <Pill href={resume.href} variant="primary" icon={<FileIcon width={15} height={15} />}>
                {copy.nav.resume}
              </Pill>
            ) : null}
          </div>
        </div>
        {missing.length > 0 ? (
          <div className="container-page flex flex-wrap gap-2 pb-4">
            {missing.map((m) => (
              <ReviewNote key={m.kind} note={m.note} inline />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
