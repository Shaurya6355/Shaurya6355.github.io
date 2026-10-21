import Link from "next/link";
import type { ReactNode } from "react";

import { ExternalLink } from "./ExternalLink";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-bold text-[var(--bold-ink)] hover:bg-[var(--bold-hover)] border border-transparent",
  secondary:
    "border border-line-strong text-ink hover:border-[var(--accent-line)] hover:bg-accent-soft",
  ghost: "border border-transparent text-ink-2 hover:text-ink hover:bg-surface-2",
};

const shape =
  "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.9375rem] font-medium leading-none transition-[background-color,border-color,color] duration-[var(--dur-fast)]";

interface PillProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  download?: boolean;
}

/** Rounded action link. Internal routes and #anchors use next/link; everything else is a plain anchor. */
export function Pill({ href, children, variant = "secondary", icon, className = "", download }: PillProps) {
  const cls = `${shape} ${variants[variant]} ${className}`;
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );
  if (href.startsWith("/") && !download && !/\.[a-z0-9]+$/i.test(href)) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <ExternalLink href={href} className={cls} download={download || undefined}>
      {content}
    </ExternalLink>
  );
}
