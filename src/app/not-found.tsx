import { Pill } from "@/components/ui/Pill";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="label text-accent">404</p>
      <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-[-0.035em] text-ink">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-ink-2">The link may be out of date. Everything on the site starts from the homepage.</p>
      <div className="mt-8">
        <Pill href="/" variant="primary">
          Back to the homepage
        </Pill>
      </div>
    </section>
  );
}
