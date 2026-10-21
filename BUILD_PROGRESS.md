# Build progress

Status key: `[ ]` not started · `[~]` in progress · `[x]` completed · `[!]` blocked (reason recorded)

## Phase 1 — Inspect and plan `[x]`

**Findings**
- `Portfolio/` was empty — new project initialised here. Nothing overwritten.
- Reference (boussioux.com) inspected via scrape + screenshots + its CSS:
  light "paper" background `#fcfaf6`, ink `#0b0917`, deep purple primary `#3a1c6c`,
  Inter Tight for everything, `max-w-6xl` container, translucent sticky nav with a
  tiny purple underline on the active link, full-bleed hero with the name overlaid,
  a contact/CV pill strip under the hero, two-column sections (large two-tone heading
  left, justified body right), numbered editorial lists (`01` grey numerals, small
  coloured type labels, tag pills, ↗), alternating section bands, full-bleed image
  bands with an overlaid statement, a CTA band with pill buttons, minimal footer.
- Identity: `git config` → Shaurya Agarwal; GitHub account `Shaurya6355` (authenticated `gh`).
- `../Movie_Recommender_System` → public repo `Shaurya6355/movielens-recommender`.
  Results JSON, sweep JSON, latency JSON, experiment-design doc. 77 tests pass locally (verified 2026-10-19).
- `../LLM` is **Research Navigator** → public repo `Shaurya6355/research-navigator`.
  Roadmap marks phases 0–12 complete, phase 13 (evaluation) in progress, not deployed.
  The brief calls it "concept and planning stage" — public page uses the conservative
  framing; implementation progress is behind a content flag (see CLAUDE.md).
- No résumé (`recruiting-copilot/master_resume/` is empty), no Wells Fargo / Morgan Stanley
  details, no education details, no branch-closure materials found anywhere in the workspace.

**Plan**
- Next.js (App Router) + TypeScript + Tailwind v4, **static export** (`output: "export"`):
  no server, free on Vercel Hobby or GitHub Pages.
- All personal facts in `src/content/*`; anything unverified uses `pending(...)` placeholders
  that render as visible review markers in development and are hidden in production.

## Phase 2 — Design system `[x]`
- Tokens in `src/app/globals.css` (`:root` + Tailwind v4 `@theme`): surfaces, ink ×3, lines, purple accent,
  chart palette (validated with the dataviz palette script against the dark surface), motion, layout, type scale.
- Inter Tight via `next/font` (self-hosted at build). Two-tone section headings, numbered editorial lists,
  pill buttons, translucent sticky nav with active underline, alternating bands — all from the reference.
- Per-project identity via an OKLCH `--hue` and `hue-*` utilities. Reduced-motion disables all animation.

## Phase 3 — Homepage `[x]`
- Hero (generated data-field backdrop instead of a photo), contact strip, What I do, Selected work (01–03),
  approach band, Methods map, Experiment, Experience, About, Get in touch, footer.
- Missing contact details / résumé / experience fields are `pending(...)` → hidden in production.

## Phase 4 — Skill-to-project map `[x]`
- `src/components/home/SkillMap.tsx`: HTML buttons + SVG links (no graph library); every link has a "how" sentence
  from `src/content/skills.ts`. Hover/focus/selected states, arrow-key movement, list layout on mobile.

## Phase 5 — Threshold explorer `[x]`
- `src/components/home/ThresholdExplorer.tsx` + pure `src/lib/metrics.ts`. 40 hand-written synthetic scores
  (`src/content/data/spam-sample.ts`), labelled synthetic. Undefined precision shown as "—" with explanation.
  Slider, ±0.01 buttons, presets, reset, data table.

## Phase 6 — Case studies `[x]`
- Template `src/app/projects/[slug]/page.tsx`; content in `src/content/projects.ts`; figures in `src/components/figures/`.
- Movie Recommender: numbers read from copied repo result files (`src/content/data/movielens/`, provenance README).
- Branch Closure: anonymized framing only; method/findings/limitations are placeholders (sections hidden in prod).
- Research Navigator: "In development"; progress list + repo link behind `SHOW_RESEARCH_NAVIGATOR_PROGRESS`.

## Phase 7 — Analytics (optional) `[!]` (optional; owner account needed)
- Implemented `src/components/site/Analytics.tsx`: GoatCounter (free for personal sites, cookie-free),
  loads only when `NEXT_PUBLIC_GOATCOUNTER_URL` is set. **Blocked on owner:** needs a GoatCounter account.
  No visitor stats are displayed anywhere on the site.

## Phase 8 — Engineering & performance `[x]`
- Static export, metadata + OG card (`/og.png`), sitemap, robots, favicon (original SVG), 404, skip link.
- Deps: next, react, react-dom only at runtime. Dev: tailwind, eslint, typescript, vitest, playwright, axe.

## Phase 9 — QA & visual refinement `[x]`
- lint ✓, typecheck ✓, build ✓, 22 unit tests ✓, 32 e2e + 8 axe (WCAG A/AA, 0 violations) on desktop & mobile ✓,
  link check incl. 3 external URLs fetched ✓. Screenshots at 1440/834/390 (dev and prod) reviewed; fixed mobile
  chips, dot overlap, sweep label collision, hero/nav contrast, tablet label wrap, stale intro.
- Known: system Chrome occasionally stalls creating a browser context under 5 workers (harness, not site);
  config now uses 3 workers + 1 retry; 4 consecutive clean runs afterwards.
- JS ≈189 KB gzip across all chunks, CSS 9 KB gzip, no raster images except the 1200×630 social card.

## Phase 10 — Deployment `[x]`
- **Live: https://shaurya6355.github.io/** (GitHub Pages, free; repo Shaurya6355/Shaurya6355.github.io, public).
  Deployed by `.github/workflows/deploy-pages.yml` on every push to `main` (lint, typecheck, tests, build,
  link check, publish).
- Verified 2026-10-19: all routes 200, unknown route 404, résumé PDF byte-identical to the supplied file,
  canonical/OG/sitemap URLs correct, and the full Playwright + axe suite (40 tests) passes against the live URL.
- First CI run failed (route types not generated before `tsc`); fixed with `next typegen && tsc --noEmit`.
- Terms checked 2026-10-19: GitHub Pages free for public repos (1 GB site, ~100 GB/mo soft bandwidth);
  Vercel Hobby (alternative) free for personal non-commercial use; GoatCounter free for personal sites.

## Phase 11 — Handoff `[x]`
- Remaining owner input: `npm run check:content` (27 items: contact links, résumé, experience details,
  education, roles, branch-closure method/findings, interests). Decide on Research Navigator framing.

## Update — résumé content and deployment (2026-10-19)
- Owner supplied résumé (`public/resume.pdf`). Filled: email, LinkedIn, résumé link, Wells Fargo and
  Morgan Stanley roles/dates/bullets, UW + BITS education, teaching, location. Internal names genericized.
- Branch Closure case study: method (ATT via T-learner uplift vs. comparable open branches), résumé figures,
  assumptions, simulator, limitations. Research Navigator: progress, repo link, evaluation baseline.
- Remaining optional placeholders (hidden in production): interests/hobbies, how branch assumptions were
  checked, a "what I'd do differently" note for the recommender.
- Owner approved deployment → GitHub Pages (see Phase 10).

## Update — hypothesis-test hero (2026-10-20)
- Removed the classification-threshold (spam) experiment, its data, metrics lib and tests, and the
  "you're the classifier" hero field, at the owner's request.
- New hero: "H₀: just another data scientist". A live null-distribution chart (rejection region for the
  chosen α, marker at the current z), α picker and readout; a floating badge on every page with the
  evidence list. Evidence accrues from sections viewed, case studies opened, map use and résumé opens.
  sessionStorage only, labeled as just for fun. Unit-tested math (Φ, p-values, critical values, weights).

## Update — hypothesis test made more visible (2026-10-20)
- Hero: two-column on large screens; H₀/H₁ card under the name; "live" indicator; guidance text and a
  "Start collecting evidence" button. Chart animates z and the critical value frame by frame (marker stays
  on the curve; the rejection region sweeps when α changes).
- Section headings and case-study headers carry evidence tags that flip when counted; the methods map says
  clicks count. Badge: card with progress toward the critical value, evidence toasts, a one-time hint, and a
  verdict card with a particle burst when H₀ is first rejected (verdict outranks toasts). Compact on phones.
- All motion respects reduced motion. Badge accessible name = its visible text (WCAG 2.5.3).

## Update — light theme (2026-10-20)
- Owner asked for no dark mode. All colors are tokens; two light palettes share them: default "paper"
  (reference: #fcfaf6 / #0b0917 / #3a1c6c) and Apple-style (#fff / #f5f5f7 / #1d1d1f / #0071e3) via
  `?palette=apple` (inline pre-paint script, remembered per tab). Favicon and social card are light.
  Chart palettes re-validated for light surfaces; axe passes on every page in both palettes.

## Update — palette options and rejected-state card (2026-10-20)
- Apple (blue) palette removed at the owner's request; Branch Closure's project hue moved off blue (245 → 150).
- Five light palettes to preview with ?palette=: clay (Anthropic), notion, aesop, muji, medium. Default stays
  "paper". Chart colors validated per palette; axe passes on every page in every palette.
- Hypothesis card: when H₀ is rejected, H₀ is struck through (animated), a "Rejected · p < α" stamp lands,
  and H₁ is marked "Supported by the evidence". Card uses plain elements (role=group), not a <dl>.
