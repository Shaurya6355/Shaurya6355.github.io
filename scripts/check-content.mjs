// Lists what still needs the owner's input before publishing. Exits 0 either way;
// it is a to-do list, not a gate.
//  1. Every pending("…") placeholder and pending block in src/content.
//  2. Experience, education and teaching entries missing an optional field that the
//     other entries carry (period, location): absent fields render nothing, so they
//     would otherwise never show up anywhere. A field set to null is a deliberate omission.
import { readdirSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const src = join(process.cwd(), "src");
const dir = join(src, "content");
let count = 0;

console.log("Placeholders:");
for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
  const lines = readFileSync(join(dir, file), "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/pending\((["'`])(.*?)\1\)/g)) {
      count++;
      console.log(`  src/content/${file}:${i + 1}  ${m[2].replace(/\\"/g, '"')}`);
    }
    const note = line.match(/kind: "pending", note: "(.*)" \}/);
    if (note) {
      count++;
      console.log(`  src/content/${file}:${i + 1}  ${note[1].replace(/\\"/g, '"')}`);
    }
  });
}

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
const { experience, education, teaching } = await import(pathToFileURL(join(dir, "experience.ts")).href);
const isPending = (v) => typeof v === "object" && v !== null && "pending" in v;
console.log("\nEntries missing fields the others have:");
const before = count;
for (const [group, entries] of [["experience", experience], ["education", education], ["teaching", teaching]]) {
  for (const e of entries) {
    const missing = ["period", "location"].filter((k) => e[k] === undefined || isPending(e[k]));
    if (missing.length) {
      count++;
      console.log(`  ${group} / ${e.id}: no ${missing.join(", no ")}`);
    }
  }
}
if (count === before) console.log("  none");
console.log(count ? `\n${count} item(s) to review. Placeholders are hidden on the live site until filled in.` : "\nNothing left to fill in.");
