// Full-page screenshots of every route at desktop, tablet and mobile widths.
// Usage: node scripts/screenshots.mjs [baseUrl] [outDir]
// Requires a running server (npm run dev, or npm run preview after a build).
// Uses the locally installed Google Chrome, so no browser download is needed.
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "screenshots";
const routes = [
  ["home", "/"],
  ["research-navigator", "/projects/research-navigator/"],
  ["branch-closure-analysis", "/projects/branch-closure-analysis/"],
  ["movie-recommender", "/projects/movie-recommender/"],
  ["404", "/does-not-exist/"],
];
const widths = { desktop: [1440, 900], tablet: [834, 1112], mobile: [390, 844] };

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const [device, [width, height]] of Object.entries(widths)) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  for (const [name, path] of routes) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) console.warn(`horizontal overflow ${overflow}px on ${name} @ ${device}`);
    await page.screenshot({ path: `${outDir}/${name}-${device}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log(`saved to ${outDir}/`);
