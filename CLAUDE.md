# Portfolio — project notes

@AGENTS.md (Next.js 16: read `node_modules/next/dist/docs/` before using unfamiliar APIs)

Shaurya Agarwal's personal portfolio. Design reference: boussioux.com (editorial layout,
Inter Tight, two-tone section headings, numbered lists, pill buttons). Light only, never dark mode. Palette (owner's choice): Aesop-inspired cream and olive, with
terracotta (`--bold`) reserved for primary actions and the live hypothesis test, and deep-olive
`.surface-deep` bands (approach + contact). No blue. Build status: `BUILD_PROGRESS.md`.

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
- All visitor-facing wording lives in src/content/ — interface copy in `copy.ts` ({placeholders} filled
  with `fill()` from src/lib/fill.ts). `npm run export:text` writes every item with a stable ID to
  content-export/website-text.md (gitignored) for offline rewriting; IDs map back to the source fields.
- Colors are tokens in `src/app/globals.css` (`:root` + `@theme`). Per-project identity = OKLCH `--hue`
  + `hue-*` utilities (defined with `@utility` so variants like `group-hover:` work).
- Chart colors were validated with the dataviz palette script against the light surfaces; the gray is a
  deliberate de-emphasis neutral. Every chart has a table view; tooltips never gate values.
- Live hypothesis test (hero chart + floating badge): H₀ "just another data scientist". Evidence =
  homepage sections viewed, case studies opened, methods-map use, résumé opened (src/content/hypothesis.ts).
  State is a tiny external store (components/hypothesis/testStore.ts) mirrored to sessionStorage only;
  math in src/lib/hypothesis.ts. It is explicitly labeled as a joke, not real statistics.
- `/og.png` is a static route handler (`src/app/og.png/route.tsx`) so the file has a real extension.

## Content rules (important)
- Never invent facts, metrics, dates, titles, links or anecdotes. Unknowns use `pending("…")`
  (src/lib/pending.ts): visible in dev, omitted in production. Sections containing only pending
  blocks disappear in production.
- Movie Recommender numbers come from `src/content/data/movielens/*.json` (copied from
  ../Movie_Recommender_System, commit 06fde5b). Unit tests assert the prose matches those files.
- Source of truth for experience, education, contact and résumé-level figures: the owner's résumé
  (public/resume.pdf, Oct 2026). Internal product/team names from it are genericized on the site.
- Owner's decision: employer figures (percentages, counts, volumes from Wells Fargo / Morgan Stanley work)
  appear ONLY in the résumé PDF, never on the website. A unit test enforces this for experience bullets,
  the Branch Closure case study and its map links. The case study never names the employer.
- The phone number must never appear on the site or in the published résumé. public/resume.pdf is the
  owner's résumé with the phone line removed; if replacing it, use a version without the phone number.
- Research Navigator (../LLM, public repo Shaurya6355/research-navigator) is shown with progress, repo
  link and first eval baseline (`SHOW_RESEARCH_NAVIGATOR_PROGRESS = true`). It is NOT deployed — never
  say otherwise. Eval numbers come from ../LLM/evals (LLM judge, abstracts only, small n).
- No chatbot, LLM API, database or paid service. Analytics (GoatCounter) only when its env var is set.
- American spelling. Visitor-facing prose follows the owner's writing style: natural, plain, contractions,
  no buzzwords or formulaic contrasts/triplets, and **no em or en dashes** in visible text (dates use "to").
  Edit wording via `npm run apply:text`, which matches items by ID and refuses ambiguous replacements.
