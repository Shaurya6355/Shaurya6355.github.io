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

## Phase 7 — Analytics (optional) `[!]`
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

## Phase 10 — Deployment `[!]`
- Ready: static export, `.gitignore`, `.env.example`, README deploy steps (Vercel Hobby or GitHub Pages),
  `.github/workflows/deploy-pages.yml`. Local git repo initialised with one commit (not pushed).
- Terms checked 2026-10-19: Vercel Hobby free for personal non-commercial use; GitHub Pages free for public
  repos (1 GB site, ~100 GB/mo soft bandwidth); GoatCounter free for personal sites.
- **Blocked on owner:** Vercel CLI isn't installed/logged in; publishing to GitHub Pages would create a public
  repository and a public site, which needs explicit approval. Not live yet.

## Phase 11 — Handoff `[x]`
- Remaining owner input: `npm run check:content` (27 items: contact links, résumé, experience details,
  education, roles, branch-closure method/findings, interests). Decide on Research Navigator framing.
