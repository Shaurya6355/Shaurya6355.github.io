# Portfolio — project notes

@AGENTS.md (Next.js 16: read `node_modules/next/dist/docs/` before using unfamiliar APIs)

Shaurya Agarwal's personal portfolio. Design reference: boussioux.com (editorial layout,
Inter Tight, two-tone section headings, numbered lists, pill buttons) translated to a
near-black theme with a restrained purple accent. Build status: `BUILD_PROGRESS.md`.

## Commands
- `npm run dev` (port 3000, shows review markers) · `npm run build` → `out/` · `npm run preview` (port 3100)
- `npm run check` = lint + typecheck + vitest + build + link check · `npm run test:e2e` (needs a fresh build)
- `npm run check:content` lists remaining placeholders

## Architecture
- Static export only (`output: "export"`, `trailingSlash: true`). No server features: no route handlers
  that read requests, no server actions, no image optimization. `NEXT_PUBLIC_BASE_PATH` for sub-path hosting;
  use `withBase()` (src/lib/contact.ts) for raw asset hrefs.
- Content is separate from presentation: everything personal is in `src/content/`. Components never
  hard-code facts.
- Colors are tokens in `src/app/globals.css` (`:root` + `@theme`). Per-project identity = OKLCH `--hue`
  + `hue-*` utilities (defined with `@utility` so variants like `group-hover:` work).
- Chart colors were validated with the dataviz palette script against the dark surface; the gray is a
  deliberate de-emphasis neutral. Every chart has a table view; tooltips never gate values.
- `/og.png` is a static route handler (`src/app/og.png/route.tsx`) so the file has a real extension.

## Content rules (important)
- Never invent facts, metrics, dates, titles, links or anecdotes. Unknowns use `pending("…")`
  (src/lib/pending.ts): visible in dev, omitted in production. Sections containing only pending
  blocks disappear in production.
- Movie Recommender numbers come from `src/content/data/movielens/*.json` (copied from
  ../Movie_Recommender_System, commit 06fde5b). Unit tests assert the prose matches those files.
- Source of truth for experience, education, contact and résumé-level figures: the owner's résumé
  (public/resume.pdf, Oct 2026). Internal product/team names from it are genericized on the site.
- Branch Closure Analysis is professional work: the case study never names the employer and uses only
  figures stated on the résumé (a unit test allows only 36% and 25% as percentages there).
- Research Navigator (../LLM, public repo Shaurya6355/research-navigator) is shown with progress, repo
  link and first eval baseline (`SHOW_RESEARCH_NAVIGATOR_PROGRESS = true`). It is NOT deployed — never
  say otherwise. Eval numbers come from ../LLM/evals (LLM judge, abstracts only, small n).
- No chatbot, LLM API, database or paid service. Analytics (GoatCounter) only when its env var is set.
- American spelling.
