import { expect, test, type Page } from "@playwright/test";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768;

test.describe("homepage", () => {
  test("renders the main sections and no review markers in production", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Shaurya Agarwal" })).toBeVisible();
    for (const id of ["work", "methods", "experiment", "experience", "about", "contact"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.locator("[data-review-note]")).toHaveCount(0);
    await expect(page.getByText("TO ADD", { exact: false })).toHaveCount(0);
  });

  test("has no broken or empty links", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    for (const href of hrefs) {
      expect(href, "anchor without href").toBeTruthy();
      expect(href).not.toBe("#");
      if (href!.startsWith("#")) await expect(page.locator(href!)).toHaveCount(1);
    }
  });

  test("lists the three projects in order and each card opens its case study", async ({ page }) => {
    await page.goto("/");
    const titles = page.locator("#work h3");
    await expect(titles).toHaveText(["Research Navigator", "Branch Closure Analysis", "Movie Recommender"]);
    for (const [title, slug] of [
      ["Research Navigator", "research-navigator"],
      ["Branch Closure Analysis", "branch-closure-analysis"],
      ["Movie Recommender", "movie-recommender"],
    ]) {
      await page.goto("/");
      await page.locator("#work").getByRole("link", { name: title }).click();
      await expect(page).toHaveURL(new RegExp(`/projects/${slug}/$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    }
  });

  test("navigation reaches every section", async ({ page }) => {
    await page.goto("/");
    if (isMobile(page)) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.locator("#mobile-menu").getByRole("link", { name: "Experience" }).click();
      await expect(page.locator("#mobile-menu")).toBeHidden();
    } else {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Experience" }).click();
    }
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.locator("#experience-heading")).toBeInViewport();
  });

  test("mobile menu closes with Escape", async ({ page }) => {
    test.skip(!isMobile(page), "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });
});

test.describe("skill map", () => {
  test("selecting a method shows only the projects it supports", async ({ page }) => {
    await page.goto("/");
    const map = page.locator("#methods");
    await map.getByRole("button", { name: "Causal inference" }).locator("visible=true").click();
    const detail = map.locator("[aria-live=polite]");
    await expect(detail.getByRole("heading")).toHaveText("Causal inference");
    await expect(detail.getByRole("link")).toHaveText(["Branch Closure Analysis", "Movie Recommender"]);
    await expect(map.getByRole("button", { name: "Causal inference" }).locator("visible=true")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("selecting a project lists its methods, and Clear resets", async ({ page }) => {
    await page.goto("/");
    const map = page.locator("#methods");
    await map.getByRole("button", { name: /Branch Closure Analysis/ }).locator("visible=true").click();
    const detail = map.locator("[aria-live=polite]");
    await expect(detail.locator("li")).toHaveCount(2);
    await detail.getByRole("button", { name: "Clear" }).click();
    await expect(detail.getByRole("heading")).toHaveText("Select a method or a project");
  });

  test("is keyboard operable", async ({ page }) => {
    test.skip(isMobile(page), "desktop graph only");
    await page.goto("/");
    const first = page.locator("#methods").getByRole("button", { name: "Causal inference" }).locator("visible=true");
    await first.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#methods").getByRole("button", { name: "Decision-focused analysis" }).locator("visible=true")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#methods [aria-live=polite]").getByRole("heading")).toHaveText("Decision-focused analysis");
  });
});

test.describe("threshold explorer", () => {
  test("starts at 0.50 with hand-checked metrics", async ({ page }) => {
    await page.goto("/");
    const ex = page.locator("#experiment");
    await expect(ex.locator("output")).toHaveText("0.50");
    await expect(ex.getByText("72%", { exact: true })).toBeVisible();
    await expect(ex.getByText("81%", { exact: true })).toBeVisible();
    await expect(ex.getByText("flags 18 of 40 emails")).toBeVisible();
  });

  test("responds to the keyboard and presets, and resets", async ({ page }) => {
    await page.goto("/");
    const ex = page.locator("#experiment");
    const slider = ex.getByRole("slider");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(ex.locator("output")).toHaveText("0.51");
    await page.keyboard.press("ArrowRight");
    await expect(ex.locator("output")).toHaveText("0.52");
    await expect(ex.getByText("catches 12 of 16 spam emails")).toBeVisible();

    await ex.getByRole("button", { name: /Favor protecting real email/ }).click();
    await expect(ex.locator("output")).toHaveText("0.80");
    await expect(ex.getByText("86%", { exact: true })).toBeVisible(); // 6 / 7
    await expect(ex.getByText("38%", { exact: true })).toBeVisible(); // 6 / 16

    await ex.getByRole("button", { name: "Reset" }).click();
    await expect(ex.locator("output")).toHaveText("0.50");
  });

  test("shows precision as undefined when nothing is flagged", async ({ page }) => {
    await page.goto("/");
    const ex = page.locator("#experiment");
    await ex.getByRole("slider").fill("100");
    await expect(ex.locator("output")).toHaveText("1.00");
    await expect(ex.getByText("nothing is flagged").first()).toBeVisible();
    await expect(ex.getByText("—", { exact: true })).toBeVisible();
    await expect(ex.getByText("NaN")).toHaveCount(0);
  });
});

test.describe("case studies", () => {
  test("movie recommender links to its public repository and shows real figures", async ({ page }) => {
    await page.goto("/projects/movie-recommender/");
    await expect(page.getByRole("link", { name: /Repository/ })).toHaveAttribute(
      "href",
      "https://github.com/Shaurya6355/movielens-recommender",
    );
    await expect(page.getByText("+0.026 [0.022, 0.030]").first()).toBeVisible();
  });

  test("branch closure hides placeholder-only sections in production", async ({ page }) => {
    await page.goto("/projects/branch-closure-analysis/");
    await expect(page.locator("#approach")).toHaveCount(0);
    await expect(page.locator("#limits")).toHaveCount(0);
    await expect(page.getByText(/anonymized/).first()).toBeVisible();
  });

  test("research navigator is labelled as in development, with no repo link by default", async ({ page }) => {
    await page.goto("/projects/research-navigator/");
    await expect(page.getByText("In development").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Repository/ })).toHaveCount(0);
  });

  test("unknown routes show the 404 page", async ({ page }) => {
    const res = await page.goto("/projects/nope/");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("This page doesn't exist.")).toBeVisible();
  });
});

test("layout has no horizontal overflow", async ({ page }) => {
  for (const path of ["/", "/projects/research-navigator/", "/projects/branch-closure-analysis/", "/projects/movie-recommender/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("disables entrance animation", async ({ page }) => {
    await page.goto("/");
    const duration = await page.locator("#hero-name").evaluate((el) => getComputedStyle(el).animationDuration);
    expect(parseFloat(duration)).toBeLessThan(0.01);
    await expect(page.locator("#hero-name")).toBeVisible();
  });
});
