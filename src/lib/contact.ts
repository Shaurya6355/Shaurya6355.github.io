import { site } from "@/content/site";
import { isPending } from "@/lib/pending";

export type ContactKind = "email" | "linkedin" | "github" | "resume";

export interface ContactLink {
  kind: ContactKind;
  label: string;
  href: string;
  /** Visible text for the link, e.g. the email address. */
  display: string;
}

export interface MissingContact {
  kind: ContactKind;
  note: string;
}

const labels: Record<ContactKind, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
  resume: "Résumé",
};

/** Prefix a root-relative asset path with the configured base path (sub-path hosting). */
export function withBase(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return path.startsWith("/") ? `${base}${path}` : path;
}

/** Contact links that have actually been supplied, plus the ones still missing. */
export function getContactLinks(): { links: ContactLink[]; missing: MissingContact[] } {
  const links: ContactLink[] = [];
  const missing: MissingContact[] = [];
  const order: ContactKind[] = ["email", "linkedin", "github", "resume"];

  for (const kind of order) {
    const value = site.links[kind];
    if (isPending(value)) {
      missing.push({ kind, note: `${labels[kind]}: ${value.pending}` });
      continue;
    }
    if (kind === "email") {
      links.push({ kind, label: labels[kind], href: `mailto:${value}`, display: value });
    } else if (kind === "resume") {
      links.push({ kind, label: labels[kind], href: withBase(value), display: "Résumé (PDF)" });
    } else {
      links.push({ kind, label: labels[kind], href: value, display: value.replace(/^https?:\/\/(www\.)?/, "") });
    }
  }
  return { links, missing };
}

export function getContact(kind: ContactKind): ContactLink | undefined {
  return getContactLinks().links.find((l) => l.kind === kind);
}
