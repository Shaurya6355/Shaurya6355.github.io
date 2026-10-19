import { ContactIcon } from "@/components/site/ContactIcon";
import { SectionHeading } from "@/components/site/Section";
import { Pill } from "@/components/ui/Pill";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { getContactLinks } from "@/lib/contact";

/** Closing call to action, after the reference's "See the work in depth." band. */
export function ContactBand() {
  const { links, missing } = getContactLinks();
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_26rem_at_20%_100%,rgb(124_92_214/0.2),transparent_70%),var(--bg-band)]"
      />
      <div className="container-page py-20 md:py-28">
        <SectionHeading id="contact-heading" accent="Get" rest="in touch." />
        <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-2">
          If you&apos;re working on a problem like these — or want to talk about one of the projects — I&apos;d be glad
          to hear from you.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {links.map((link, i) => (
            <li key={link.kind}>
              <Pill
                href={link.href}
                variant={i === 0 ? "primary" : "secondary"}
                icon={<ContactIcon kind={link.kind} size={15} />}
              >
                {link.kind === "email" ? link.display : link.label}
              </Pill>
            </li>
          ))}
        </ul>
        {missing.length > 0 ? (
          <div className="mt-6 flex flex-col items-start gap-2">
            {missing.map((m) => (
              <ReviewNote key={m.kind} note={m.note} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
