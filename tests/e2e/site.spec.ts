import { expect, test, type Page } from "@playwright/test";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768;

test.describe("homepage", () => {
  test("renders the main sections and no review markers in production", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Shaurya Agarwal" })).toBeVisible();
    for (const id of ["work", "methods", "experience", "about", "contact"]) {
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

test.describe("experience and résumé", () => {
  test("experience entries have no empty lines", async ({ page }) => {
    await page.goto("/");
    const empty = await page.locator("#experience li").evaluateAll((items) =>
      items.flatMap((li) =>
        [...li.querySelectorAll("p, span")]
          .filter((el) => el.children.length === 0 && el.textContent?.trim() === "")
          .map(() => li.textContent?.slice(0, 40)),
      ),
    );
    expect(empty).toEqual([]);
    const teaching = page.locator("#experience li", { hasText: "Teaching Assistant" });
    await expect(teaching.locator("p.tabular-nums")).toHaveCount(0); // no date on the résumé, so no date row
    await expect(teaching).toContainText("Principles of Programming Languages");
  });

  test("every résumé link opens the PDF in a new tab", async ({ page, request }) => {
    for (const path of ["/", "/projects/research-navigator/"]) {
      await page.goto(path);
      const links = page.locator('a[href$="resume.pdf"]');
      expect(await links.count()).toBeGreaterThan(0);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
      }
    }
    const res = await request.get("/resume.pdf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
    const body = await res.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");
  });

  test("clicking Résumé opens the PDF", async ({ page, context }) => {
    test.skip((page.viewportSize()?.width ?? 1440) < 768, "desktop nav button");
    await page.goto("/");
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: /Résumé/ }).click(),
    ]);
    await popup.waitForLoadState();
    expect(popup.url()).toMatch(/\/resume\.pdf$/);
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
    await expect(detail.locator("li")).toHaveCount(4); // causal, decision, ml, evaluation
    await detail.getByRole("button", { name: "Clear" }).click();
    await expect(detail.getByRole("heading")).toHaveText("Pick a method or a project");
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

test.describe("live hypothesis test", () => {
  const readout = (page: Page) => page.locator("#hero p[aria-live=polite]");

  test("starts with H₀ standing at α = 0.05", async ({ page }) => {
    await page.goto("/");
    await expect(readout(page)).toHaveText(/z = 0\.40, p = 0\.34\. Not enough evidence yet/);
    await expect(page.getByRole("button", { name: "α = 0.05" }).first()).toHaveAttribute("aria-pressed", "true");
  });

  test("changing α moves the rejection region", async ({ page }) => {
    await page.goto("/");
    await page.locator("#hero").getByRole("button", { name: "α = 0.001" }).click();
    await expect(page.locator("#hero").getByText("reject H₀ · α = 0.001")).toBeVisible();
  });

  test("exploring the homepage rejects H₀ at α = 0.05", async ({ page }) => {
    await page.goto("/");
    for (const id of ["approach", "work", "methods", "experience", "about"]) {
      await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: "center" }));
      await expect(page.locator(`[data-evidence-tag="${id}"]`)).toHaveAttribute("data-collected", "true");
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(readout(page)).toHaveText(/H₀ rejected/);
  });

  test("opening a case study counts as evidence and persists in the tab", async ({ page }) => {
    await page.goto("/projects/movie-recommender/");
    await page.waitForFunction(() => sessionStorage.getItem("h0-test")?.includes("case:movie-recommender"));
    await page.goto("/");
    await expect(readout(page)).toHaveText(/z = 1\.00/);
  });

  test("section tags flip once a section has been read", async ({ page }) => {
    await page.goto("/");
    const tag = page.locator('[data-evidence-tag="approach"]');
    await expect(tag).toHaveAttribute("data-collected", "false");
    await page.locator("#approach").evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(tag).toHaveAttribute("data-collected", "true");
    await expect(tag).toContainText("+0.30 evidence against H₀");
  });

  test("crossing α shows the verdict, and it isn't covered by later evidence", async ({ page }) => {
    await page.goto("/");
    for (const id of ["approach", "work", "methods", "experience", "about"]) {
      await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: "center" }));
      await expect(page.locator(`[data-evidence-tag="${id}"]`)).toHaveAttribute("data-collected", "true");
    }
    await expect(page.getByRole("status").getByText("H₀ rejected")).toBeVisible();
    await expect(page.getByRole("status")).toContainText("isn't just another data science portfolio");
  });

  test("the hero card marks H₀ rejected and H₁ supported", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(".hypothesis-card");
    await expect(card).toHaveAttribute("data-rejected", "false");
    for (const id of ["approach", "work", "methods", "experience", "about"]) {
      await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: "center" }));
      await expect(page.locator(`[data-evidence-tag="${id}"]`)).toHaveAttribute("data-collected", "true");
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(card).toHaveAttribute("data-rejected", "true");
    await expect(card.getByText("Rejected", { exact: true })).toBeVisible();
    await expect(card.getByText("Supported by the evidence")).toBeVisible();
  });

  test("the badge explains itself once", async ({ page }) => {
    await page.goto("/projects/research-navigator/");
    const nudge = page.getByText("Everything you read here is being counted as evidence against H₀");
    await expect(nudge).toBeVisible({ timeout: 6000 });
    await page.getByRole("button", { name: "Got it" }).click();
    await expect(nudge).toBeHidden();
    await page.goto("/projects/movie-recommender/");
    await page.waitForTimeout(3500);
    await expect(nudge).toBeHidden();
  });

  test("the badge lists evidence, closes with Escape, and resets", async ({ page }) => {
    await page.goto("/projects/branch-closure-analysis/");
    const badge = page.getByRole("button", { name: /Live hypothesis test/ });
    await badge.click();
    const panel = page.getByRole("dialog", { name: "Live hypothesis test" });
    await expect(panel).toBeVisible();
    await expect(panel.getByText("Opened the Branch Closure Analysis case study")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(badge).toBeFocused();
    await badge.click();
    await panel.getByRole("button", { name: "Start over" }).click();
    await expect(panel.getByText(/z = 0\.40/)).toBeVisible();
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

  test("branch closure stays anonymized and shows no review markers", async ({ page }) => {
    await page.goto("/projects/branch-closure-analysis/");
    await expect(page.locator("#approach")).toHaveCount(1);
    await expect(page.getByText("Wells Fargo")).toHaveCount(0);
    await expect(page.locator("[data-review-note]")).toHaveCount(0);
  });

  test("research navigator is labelled as in development and not deployed", async ({ page }) => {
    await page.goto("/projects/research-navigator/");
    await expect(page.getByText("In development").first()).toBeVisible();
    await expect(page.getByText("not deployed").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Repository/ })).toHaveAttribute(
      "href",
      "https://github.com/Shaurya6355/research-navigator",
    );
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
