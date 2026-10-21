import { ContactIcon } from "@/components/site/ContactIcon";
import { SectionHeading } from "@/components/site/Section";
import { Pill } from "@/components/ui/Pill";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { copy } from "@/content/copy";
import { getContactLinks } from "@/lib/contact";

/** Closing call to action, after the reference's "See the work in depth." band. */
export function ContactBand() {
  const { links, missing } = getContactLinks();
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_26rem_at_20%_100%,var(--glow),transparent_70%),var(--bg-band)]"
      />
      <div className="container-page py-20 md:py-28">
        <SectionHeading id="contact-heading" accent={copy.sections.contact.accent} rest={copy.sections.contact.rest} />
        <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-2">
          {copy.sections.contact.text}
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
