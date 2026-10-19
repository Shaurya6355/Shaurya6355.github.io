import { Fragment, type ReactNode } from "react";

import { ExternalLink } from "./ExternalLink";

/**
 * Renders the small inline markup used in content files:
 * **bold**, *italic* and [label](https://url). Nothing else is interpreted.
 */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

export function RichText({ text }: { text: string }): ReactNode {
  const parts = text.split(TOKEN).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      return (
        <ExternalLink key={i} href={link[2]} className="prose-link">
          {link[1]}
        </ExternalLink>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
