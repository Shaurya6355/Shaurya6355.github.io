// Applies edited website text back to the source, matched by ID.
// Usage: npm run apply:text -- <edited.md> [--dry-run]
//
// <edited.md> uses the export format ([id] line, then the text); it may contain all
// items or only the ones you changed. For each changed item, the current text (from a
// fresh export) is located as a string literal in src/content/*.ts and replaced.
// Items whose current text can't be found exactly once are reported, not guessed.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [file, ...flags] = process.argv.slice(2);
const dryRun = flags.includes("--dry-run");
if (!file) {
  console.error("usage: npm run apply:text -- <edited.md> [--dry-run]");
  process.exit(1);
}

/** Parse "[id]\ntext\n\n" blocks. */
function parse(md) {
  const items = new Map();
  const re = /^\[([\w.@-]+)\]\n([\s\S]*?)(?=\n\[[\w.@-]+\]\n|\n#{1,3} |\s*$)/gm;
  for (const m of md.matchAll(re)) items.set(m[1], m[2].trim());
  return items;
}

const tmp = join(mkdtempSync(join(tmpdir(), "text-")), "current.md");
execFileSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "scripts/export-text.mjs", tmp], {
  stdio: "ignore",
});
const current = parse(readFileSync(tmp, "utf8"));
const edited = parse(readFileSync(file, "utf8"));

const contentDir = join(process.cwd(), "src", "content");
const files = readdirSync(contentDir, { recursive: true })
  .filter((f) => f.endsWith(".ts"))
  .map((f) => join(contentDir, f));
const sources = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));

const changed = [];
const problems = [];
for (const [id, text] of edited) {
  if (!current.has(id)) {
    problems.push(`unknown id [${id}]`);
    continue;
  }
  const before = current.get(id);
  if (before === text) continue;
  const needle = JSON.stringify(before);
  const hits = [...sources].filter(([, s]) => s.includes(needle));
  const occurrences = hits.reduce((n, [, s]) => n + s.split(needle).length - 1, 0);
  // Identical text used by several ids (e.g. a repeated label) is only safe to replace
  // if every one of those ids received the same new text.
  const siblings = [...current].filter(([, t]) => t === before).map(([k]) => k);
  if (occurrences === 0) {
    problems.push(`[${id}] current text not found as a literal in src/content`);
    continue;
  }
  if (siblings.some((k) => edited.has(k) && edited.get(k) !== text)) {
    problems.push(`[${id}] shares its text with ${siblings.join(", ")} but they were edited differently`);
    continue;
  }
  for (const [f, s] of hits) sources.set(f, s.split(needle).join(JSON.stringify(text)));
  changed.push(id);
}

if (!dryRun) for (const [f, s] of sources) if (s !== readFileSync(f, "utf8")) writeFileSync(f, s);
console.log(`${dryRun ? "[dry run] would change" : "changed"} ${changed.length} item(s)`);
for (const id of changed) console.log(`  ✓ ${id}`);
if (problems.length) {
  console.log(`\n${problems.length} item(s) need manual attention:`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exitCode = 1;
}
