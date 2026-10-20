"use client";

import { useRef, useState, type ReactNode } from "react";

import { HeroField } from "./HeroField";

/** Hero section shell: hosts the interactive field and the small "you're the classifier" hint. */
export function HeroStage({ hint, children }: { hint: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [interactive, setInteractive] = useState(false);
  return (
    <section ref={ref} aria-labelledby="hero-name" className="relative isolate overflow-hidden border-b border-line">
      <HeroField hostRef={ref} onInteractiveChange={setInteractive} />
      {children}
      {interactive ? (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-6 hidden md:block">
          <p className="hero-hint container-page text-right font-mono text-[0.75rem] tracking-tight text-ink-3">{hint}</p>
        </div>
      ) : null}
    </section>
  );
}
