// Lists every placeholder (pending(...)) still in the content files, so you know
// what to fill in before publishing. Exits 0 either way; it is a to-do list, not a gate.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src", "content");
let count = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
  const lines = readFileSync(join(dir, file), "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/pending\((["'`])(.*?)\1\)/g)) {
      count++;
      console.log(`src/content/${file}:${i + 1}  ${m[2].replace(/\\"/g, '"')}`);
    }
    const note = line.match(/kind: "pending", note: "(.*)" \}/);
    if (note) {
      count++;
      console.log(`src/content/${file}:${i + 1}  ${note[1].replace(/\\"/g, "\"")}`);
    }
  });
}
console.log(count ? `\n${count} item(s) still need your input. They are hidden on the live site until filled in.` : "No placeholders left.");
