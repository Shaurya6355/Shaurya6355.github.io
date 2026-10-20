import { ArrowRight } from "@/components/ui/Icons";
import { RichText } from "@/components/ui/RichText";
import { copy } from "@/content/copy";

/** Full-bleed statement band — the reference's photo bands, rendered as type over a quiet field. */
export function ApproachBand() {
  return (
    <section aria-label="Approach" className="relative isolate overflow-hidden border-y border-line">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70rem_28rem_at_75%_50%,rgb(124_92_214/0.22),transparent_70%),linear-gradient(180deg,var(--bg-band),var(--bg))]"
      />
      <svg aria-hidden className="absolute inset-0 -z-10 h-full w-full opacity-60" preserveAspectRatio="none">
        <defs>
          <pattern id="band-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0H0V56" fill="none" stroke="rgb(243 240 248 / 0.05)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#band-grid)" />
      </svg>
      <div className="container-page py-20 md:py-28">
        <p className="max-w-4xl text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.18] tracking-[-0.025em] text-ink-2 [&_strong]:font-semibold [&_strong]:text-ink">
          <RichText text={copy.approachBand.statement} />
        </p>
        <a
          href="#methods"
          className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink"
        >
          {copy.approachBand.link}
          <ArrowRight width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
