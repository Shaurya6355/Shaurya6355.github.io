import type { NavItem } from "@/components/site/Nav";
import { copy } from "@/content/copy";

/** Homepage sections, in page order. Ids must match the section elements. */
export const navItems: NavItem[] = [
  { id: "work", label: copy.nav.work },
  { id: "methods", label: copy.nav.methods },
  { id: "experience", label: copy.nav.experience },
  { id: "about", label: copy.nav.about },
  { id: "contact", label: copy.nav.contact },
];
