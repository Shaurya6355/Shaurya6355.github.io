# Shaurya Agarwal — portfolio

Personal site: an editorial homepage with a live (playful) hypothesis test, three
project case studies, and an interactive methods-to-projects map. Built with
Next.js (App Router, static export), TypeScript and Tailwind CSS v4. No backend,
no database, no paid services.

## Run locally

Requires Node 20.9+ (developed on Node 26) and npm.

```bash
npm install
npm run dev          # http://localhost:3000 — shows yellow "To add" markers for missing content
```

Production build and preview (exactly what gets deployed):

```bash
npm run build        # static site in out/
npm run preview      # serves out/ on http://localhost:3100
```

## Checks

```bash
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest: hypothesis-test math + content integrity
npm run build
npm run check:links  # every internal link/anchor in out/ resolves; add -- --external to fetch external URLs
npm run test:e2e     # Playwright against out/: navigation, map, hypothesis test, 404, overflow, axe accessibility
npm run check        # lint + typecheck + unit tests + build + link check

npm run check:content                       # lists the placeholders you still need to fill in
npm run export:text                         # all site text with IDs → content-export/website-text.md
npm run apply:text -- <file.md> [--dry-run]  # apply edited text back by ID (all or only changed items)
node scripts/screenshots.mjs <url> <dir>    # full-page screenshots at desktop / tablet / mobile
```

Playwright uses your installed Google Chrome. Without Chrome, run
`npx playwright install chromium` and set `CI=1`.

## Editing content

Everything personal lives in `src/content/`:

| File | What it holds |
|---|---|
| `site.ts` | Name, tagline, **email, LinkedIn, GitHub, résumé** |
| `copy.ts` | Interface copy: hero, section intros, buttons, hypothesis-test text, figure labels, 404 |
| `hypothesis.ts` | The live hypothesis test: baseline, default α, evidence items and their weights |
| `projects.ts` | The three case studies (sections, figures, links, status) |
| `experience.ts` | Wells Fargo, Morgan Stanley, education |
| `about.ts` | "What I do" and "About" copy, interests |
| `skills.ts` | Methods and the method → project links in the map |
| `data/movielens/` | Result files copied from the recommender repo (see its README) |

Unknown facts are written as `pending("what to add")`. They show as yellow
markers in `npm run dev` and are **hidden in production builds**, so nothing
invented or broken is ever published. `npm run check:content` lists them.

To add the résumé: put the PDF at `public/resume.pdf` and set
`resume: "/resume.pdf"` in `src/content/site.ts`.

## Deploy (free)

The build output is plain static files, so any static host works. Two free options:

**Vercel (Hobby plan — free, personal non-commercial use only)**
1. Push this folder to a GitHub repository.
2. On vercel.com, sign in with GitHub → *Add New… → Project* → import the repository.
   Framework preset: Next.js. No other settings needed.
3. Optional environment variable: `NEXT_PUBLIC_SITE_URL=https://<project>.vercel.app`, then redeploy.

**GitHub Pages (free for public repositories)**
1. Push to a public repository. Naming it `Shaurya6355.github.io` serves the site at
   `https://shaurya6355.github.io/`; any other name serves it at `/<repo>/`.
2. *Settings → Pages → Source: GitHub Actions*. The included workflow
   (`.github/workflows/deploy-pages.yml`) tests, builds and publishes on every push to `main`
   and sets the base path and site URL automatically.

Optional analytics: create a free GoatCounter site and set
`NEXT_PUBLIC_GOATCOUNTER_URL=https://<code>.goatcounter.com/count`
(on Pages: a repository *variable* named `GOATCOUNTER_URL`). Without it, no analytics
script is loaded. See `.env.example`.
