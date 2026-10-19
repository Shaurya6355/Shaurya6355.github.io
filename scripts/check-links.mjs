// Validates every link in the static export (out/).
// - Internal href/src values must resolve to a file in out/ (and #fragments to an id on the page).
// - With --external, external URLs are also requested and must answer with a non-error status.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(process.cwd(), "out");
const checkExternal = process.argv.includes("--external");
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) pages.push(p);
  }
})(root);

const errors = [];
const external = new Set();

function resolveInternal(pathname) {
  let p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  p = decodeURIComponent(p);
  const target = join(root, p);
  if (existsSync(target) && statSync(target).isFile()) return target;
  if (existsSync(join(target, "index.html"))) return join(target, "index.html");
  return null;
}

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const pageUrl = "/" + relative(root, page).replace(/index\.html$/, "");
  for (const [, attr, value] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (!value) errors.push(`${pageUrl}: empty ${attr}`);
    else if (value === "#") errors.push(`${pageUrl}: placeholder href="#"`);
    else if (/^(mailto:|tel:|data:)/.test(value)) continue;
    else if (/^https?:\/\//.test(value)) {
      if (!/^https?:\/\/localhost/.test(value)) external.add(value.replace(/&amp;/g, "&"));
    } else {
      const [pathPart, fragment] = value.split("#");
      const targetPath = pathPart === "" ? page : resolveInternal(pathPart.split("?")[0]);
      if (!targetPath) errors.push(`${pageUrl}: ${attr}="${value}" does not resolve`);
      else if (fragment) {
        const targetIds =
          targetPath === page ? ids : new Set([...readFileSync(targetPath, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
        if (!targetIds.has(fragment)) errors.push(`${pageUrl}: ${attr}="${value}" has no #${fragment} target`);
      }
    }
  }
}

if (checkExternal) {
  for (const url of external) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000) });
      if (res.status >= 400) errors.push(`external ${url} → HTTP ${res.status}`);
    } catch (e) {
      errors.push(`external ${url} → ${e.message}`);
    }
  }
}

console.log(`checked ${pages.length} pages; ${external.size} external URLs${checkExternal ? " (fetched)" : " (not fetched; pass --external)"}`);
if (external.size) console.log([...external].map((u) => `  ${u}`).join("\n"));
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("all links resolve ✓");
