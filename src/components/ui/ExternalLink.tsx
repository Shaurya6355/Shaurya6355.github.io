import type { AnchorHTMLAttributes } from "react";

/** Links that leave the site, or open a file such as the résumé PDF: new tab, without leaking the opener. */
export function ExternalLink({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = typeof href === "string" && (/^https?:\/\//.test(href) || /\.pdf$/i.test(href));
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
