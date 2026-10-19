import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against the production static export (npm run build first),
// or against a deployed site with BASE_URL=https://shaurya6355.github.io npm run test:e2e
// They use the locally installed Google Chrome; in CI, run `npx playwright install chromium`
// and drop the `channel` setting.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  // System Chrome occasionally stalls creating a context under heavy parallelism (seen ~1 in 7 runs,
  // always before any page code runs). Fewer workers + one retry; retried passes are reported as "flaky".
  workers: 3,
  retries: 1,
  reporter: "list",
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3100", channel: process.env.CI ? undefined : "chrome" },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "node scripts/serve-out.mjs 3100", url: "http://localhost:3100", reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
