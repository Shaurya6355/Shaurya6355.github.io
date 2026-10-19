import { ContactIcon } from "@/components/site/ContactIcon";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { site } from "@/content/site";
import { getContactLinks } from "@/lib/contact";

export function Footer() {
  const { links } = getContactLinks();
  const email = links.find((l) => l.kind === "email");
  const icons = links.filter((l) => l.kind !== "email");

  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-4 py-8 text-[0.875rem] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-ink-2">{site.name}</span> © {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-4">
          {email ? (
            <a href={email.href} className="transition-colors hover:text-ink">
              {email.display}
            </a>
          ) : null}
          {icons.map((link) => (
            <ExternalLink
              key={link.kind}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className="text-ink-3 transition-colors hover:text-ink"
            >
              <ContactIcon kind={link.kind} />
            </ExternalLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
