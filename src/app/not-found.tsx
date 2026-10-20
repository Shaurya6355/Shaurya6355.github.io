import { Pill } from "@/components/ui/Pill";
import { copy } from "@/content/copy";

export default function NotFound() {
  const c = copy.notFound;
  return (
    <section className="container-page flex min-h-[70vh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="label text-accent">{c.eyebrow}</p>
      <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-[-0.035em] text-ink">{c.heading}</h1>
      <p className="mt-4 max-w-md text-ink-2">{c.text}</p>
      <div className="mt-8">
        <Pill href="/" variant="primary">
          {c.action}
        </Pill>
      </div>
    </section>
  );
}
