// Exports every piece of readable website copy into one Markdown file with stable IDs,
// for editing outside the codebase (e.g. rewriting the tone with another tool) and
// applying back. Usage: npm run export:text [-- <output path>]
//
// Facts that must not be reworded (names, organizations, job titles, dates, URLs,
// metric values) are deliberately left out.
import { mkdirSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const src = join(root, "src");

// Resolve the "@/..." alias and extensionless .ts imports used by the content files.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) specifier = pathToFileURL(join(src, specifier.slice(2))).href;
    try {
      return next(specifier, context);
    } catch (error) {
      if (/^(file:|\.)/.test(specifier) && !/\.\w+$/.test(specifier)) return next(`${specifier}.ts`, context);
      throw error;
    }
  },
});

const load = (p) => import(pathToFileURL(join(src, "content", p)).href);
const { copy } = await load("copy.ts");
const { site } = await load("site.ts");
const { intro, about } = await load("about.ts");
const { projects } = await load("projects.ts");
const { experience, education, teaching } = await load("experience.ts");
const { methods, methodLinks } = await load("skills.ts");
const { thresholdPresets } = await load("data/spam-sample.ts");

const isPending = (v) => typeof v === "object" && v !== null && "pending" in v;
const lines = [];
let count = 0;
const heading = (text, level = 2) => lines.push("", `${"#".repeat(level)} ${text}`, "");
const item = (id, text) => {
  if (typeof text !== "string" || isPending(text) || !text.trim()) return;
  count++;
  lines.push(`[${id}]`, text, "");
};
/** Every string leaf of a copy object, with its dotted path as the id. */
const walk = (prefix, value) => {
  if (typeof value === "string") return item(prefix, value);
  if (Array.isArray(value)) return value.forEach((v, i) => walk(`${prefix}.${i + 1}`, v));
  if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) walk(`${prefix}.${k}`, v);
};

// ---------------------------------------------------------------- header
lines.push(
  `# Website text — ${site.name}`,
  "",
  `Exported ${new Date().toISOString().slice(0, 10)} from the live site's source. ${"{COUNT}"} text items.`,
  "",
  "## Instructions for rewriting (keep this block when pasting)",
  "",
  "Rewrite the text items below so they read naturally — like a thoughtful person wrote them, not a template.",
  "",
  "1. Keep every `[id]` line exactly as it is, each directly above its text. Don't add, remove or reorder items.",
  "2. Keep every fact: numbers, names, organizations, tools, methods and technical terms stay accurate. Don't add achievements, numbers, opinions or claims that aren't already there.",
  "3. Keep `{placeholders}` (like `{count}` or `{threshold}`) exactly — the site fills them in.",
  "4. Keep the markup: `**bold**`, `*italic*`, and `[link text](url)` (the url must stay the same).",
  "5. Keep each item roughly the same length. Short labels (buttons, menu items) must stay short.",
  "6. First person (\"I\") where the original uses it. American spelling. No exclamation marks or buzzwords.",
  "7. If an item already sounds right, leave it unchanged.",
  "8. Return the complete document in the same format.",
);

// ---------------------------------------------------------------- site-wide
heading("Site-wide");
item("site.description", site.description);
walk("copy.meta", copy.meta);
walk("copy.nav", copy.nav);

// ---------------------------------------------------------------- homepage
heading("Homepage");
heading("Hero", 3);
walk("copy.hero", copy.hero);

heading("What I do", 3);
walk("copy.sections.approach", copy.sections.approach);
intro.forEach((p, i) => item(`about.intro.${i + 1}`, p));

heading("Selected work", 3);
walk("copy.sections.work", copy.sections.work);
item("copy.projectList.cta", copy.projectList.cta);
for (const p of projects) {
  item(`projects.${p.slug}.status`, p.status);
  item(`projects.${p.slug}.summary`, p.summary);
  p.themes.forEach((t, i) => item(`projects.${p.slug}.themes.${i + 1}`, t));
}

heading("Approach band", 3);
walk("copy.approachBand", copy.approachBand);

heading("Methods in practice (map)", 3);
walk("copy.sections.methods", copy.sections.methods);
walk("copy.skillMap", copy.skillMap);
for (const m of methods) item(`skills.method.${m.id}`, m.label);
for (const l of methodLinks) item(`skills.link.${l.method}.${l.project}`, l.how);

heading("A small experiment (threshold explorer)", 3);
walk("copy.sections.experiment", copy.sections.experiment);
thresholdPresets.forEach((p, i) => item(`explorer.preset.${i + 1}`, p.label));
walk("copy.explorer", copy.explorer);

heading("Experience", 3);
walk("copy.sections.experience", copy.sections.experience);
for (const entry of [...experience, ...education, ...teaching]) {
  if (entry.note) item(`experience.${entry.id}.note`, entry.note);
  if (!isPending(entry.summary)) item(`experience.${entry.id}.summary`, entry.summary);
  if (Array.isArray(entry.highlights)) entry.highlights.forEach((h, i) => item(`experience.${entry.id}.highlight.${i + 1}`, h));
}

heading("About", 3);
walk("copy.sections.about", copy.sections.about);
about.paragraphs.forEach((p, i) => item(`about.paragraph.${i + 1}`, p));

heading("Contact", 3);
walk("copy.sections.contact", copy.sections.contact);

// ---------------------------------------------------------------- case studies
heading("Case study pages (shared labels)");
walk("copy.caseStudy", copy.caseStudy);

for (const p of projects) {
  heading(`Case study — ${p.title}`);
  if (!isPending(p.role)) item(`projects.${p.slug}.role`, p.role);
  for (const section of p.sections) {
    const base = `projects.${p.slug}.${section.id}`;
    item(`${base}.title`, section.title);
    section.blocks.forEach((b, i) => {
      const id = `${base}.${i + 1}`;
      switch (b.kind) {
        case "p":
        case "lead":
          return item(id, b.text);
        case "list":
          return b.items.forEach((t, j) => item(`${id}.${j + 1}`, t));
        case "grid":
          return b.items.forEach((g, j) => {
            item(`${id}.${j + 1}.title`, g.title);
            item(`${id}.${j + 1}.text`, g.text);
          });
        case "stats":
          return b.items.forEach((s, j) => {
            item(`${id}.${j + 1}.label`, s.label);
            if (s.note) item(`${id}.${j + 1}.note`, s.note);
          });
        case "figure":
          return item(`${id}.caption`, b.caption);
        case "callout":
          item(`${id}.title`, b.title);
          return item(`${id}.text`, b.text);
        case "status":
          item(`${id}.builtLabel`, b.builtLabel);
          b.built?.forEach((t, j) => item(`${id}.built.${j + 1}`, t));
          item(`${id}.nextLabel`, b.nextLabel);
          return b.next.forEach((t, j) => item(`${id}.next.${j + 1}`, t));
      }
    });
  }
}

// ---------------------------------------------------------------- figures + 404
heading("Figures and diagrams");
walk("copy.figures", copy.figures);

heading("404 page");
walk("copy.notFound", copy.notFound);

const outPath = process.argv[2] ?? join(root, "content-export", "website-text.md");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n").replace("{COUNT}", String(count)).trimStart() + "\n");
console.log(`exported ${count} text items → ${outPath}`);
