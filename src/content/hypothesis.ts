import { fill } from "@/lib/fill";
import type { Alpha, EvidenceItem } from "@/lib/hypothesis";

import { copy } from "./copy";
import { projects } from "./projects";

/**
 * The live hypothesis test that runs across the site (hero chart + floating badge).
 * Evidence ids:
 *  - homepage section ids (counted when the section scrolls through the middle of the screen)
 *  - "case:<slug>" (counted when a case study page is opened)
 *  - "map" (an interaction with the methods map) and "resume" (opening the résumé)
 */
export const hypothesisTest = {
  baseline: 0.4,
  defaultAlpha: 0.05 as Alpha,
  evidence: [
    { id: "approach", label: "Read what I do", weight: 0.3 },
    { id: "work", label: "Looked through the selected work", weight: 0.35 },
    ...projects.map((p) => ({
      id: `case:${p.slug}`,
      label: fill(copy.hypothesis.caseEvidence, { title: p.title }),
      weight: 0.6,
    })),
    { id: "methods", label: "Visited the methods map", weight: 0.2 },
    { id: "map", label: "Clicked around the methods map", weight: 0.3 },
    { id: "experience", label: "Checked my experience", weight: 0.45 },
    { id: "about", label: "Read the about section", weight: 0.2 },
    { id: "resume", label: "Opened my résumé", weight: 0.6 },
  ] satisfies EvidenceItem[],
};

/** Homepage sections that count as evidence when viewed. */
export const sectionEvidenceIds = ["approach", "work", "methods", "experience", "about"];
