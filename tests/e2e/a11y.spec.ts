import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/projects/research-navigator/", "/projects/branch-closure-analysis/", "/projects/movie-recommender/"];

const palettes = ["", "?palette=apple"];

for (const path of pages) for (const palette of palettes) {
  test(`no WCAG A/AA violations on ${path}${palette}`, async ({ page }) => {
    await page.goto(path + palette);
    await page.waitForTimeout(700); // let entrance animations finish so contrast is measured at rest
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    expect(summary).toEqual([]);
  });
}
