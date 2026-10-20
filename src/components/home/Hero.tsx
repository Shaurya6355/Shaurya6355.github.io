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
          className="absolute inset-0 -z-10 bg-[radial-gradient(48rem_30rem_at_78%_22%,rgb(124_92_214/0.22),transparent_70%)]"
        />
        <svg aria-hidden className="absolute inset-0 -z-10 h-full w-full opacity-50" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0H0V64" fill="none" stroke="rgb(243 240 248 / 0.045)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        <div className="container-page relative flex min-h-[min(88svh,52rem)] flex-col justify-end gap-10 pb-14 pt-[calc(var(--nav-h)+2.5rem)] md:gap-6 md:pb-20">
          <div className="hero-rise w-full md:ml-auto md:w-[min(54%,36rem)]">
            <NullChart />
          </div>
          <div>
            <p className="label hero-rise text-accent">
              {copy.hero.hypothesisSymbol}
              <sub>{copy.hero.hypothesisSubscript}</sub>: {copy.hero.eyebrow}
            </p>
            <h1
              id="hero-name"
              className="hero-rise mt-4 text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink"
            >
              {site.name}
            </h1>
            <p className="hero-rise mt-6 max-w-2xl text-[clamp(1.15rem,2vw,1.45rem)] leading-snug tracking-[-0.01em] text-ink-2">
              {copy.hero.tagline}
            </p>
            <div className="hero-rise mt-7 max-w-2xl space-y-3">
              <AlphaPicker />
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
