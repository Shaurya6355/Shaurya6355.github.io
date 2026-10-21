"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ExternalLink } from "@/components/ui/ExternalLink";
import { CloseIcon, FileIcon, MenuIcon } from "@/components/ui/Icons";
import { copy } from "@/content/copy";

export interface NavItem {
  id: string;
  label: string;
}

interface NavProps {
  name: string;
  items: NavItem[];
  resumeHref?: string;
}

export function Nav({ name, items, resumeHref }: NavProps) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Highlight the section currently in view (homepage only).
  useEffect(() => {
    if (!onHome) return;
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items, onHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, focus the first link, close on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const shownActive = onHome ? active : null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-[var(--dur)] ${
        scrolled || open || !onHome
          ? "border-line bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Main" className="container-page flex h-[var(--nav-h)] items-center justify-between gap-4">
        <Link
          href="/"
          className="text-[1.0625rem] font-medium tracking-[-0.01em] text-ink"
          onClick={() => setOpen(false)}
        >
          {name}
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center">
            {items.map((item) => {
              const isActive = shownActive === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={hrefFor(item.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative block rounded-full px-3 py-1.5 text-[0.9375rem] transition-colors duration-[var(--dur-fast)] ${
                      isActive ? "text-ink" : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute bottom-0.5 left-1/2 h-px w-4 -translate-x-1/2 bg-accent transition-opacity duration-[var(--dur)] ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          {resumeHref ? (
            <ExternalLink
              href={resumeHref}
              className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-bold px-3.5 py-1.5 text-[0.875rem] font-medium text-[var(--bold-ink)] transition-colors hover:bg-[var(--bold-hover)]"
            >
              <FileIcon width={14} height={14} />
              {copy.nav.resume}
            </ExternalLink>
          ) : null}
        </div>

        <button
          ref={menuButton}
          type="button"
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? copy.nav.closeMenu : copy.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-t border-line bg-bg md:hidden"
      >
        <ul className="container-page flex flex-col py-6">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                ref={i === 0 ? firstLink : undefined}
                href={hrefFor(item.id)}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-3"
              >
                <span className="w-7 text-sm tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-3xl font-medium tracking-[-0.02em] text-ink transition-colors group-hover:text-accent">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
          {resumeHref ? (
            <li className="mt-6">
              <ExternalLink
                href={resumeHref}
                className="inline-flex items-center gap-2 rounded-full bg-bold px-4 py-2 font-medium text-[var(--bold-ink)]"
              >
                <FileIcon /> {copy.nav.resume}
              </ExternalLink>
            </li>
          ) : null}
        </ul>
      </div>
    </header>
  );
}
