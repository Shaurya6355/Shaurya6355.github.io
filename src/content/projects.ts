import { pending, type Maybe } from "@/lib/pending";

/**
 * Projects and their case studies.
 *
 * Text fields accept two bits of inline markup: **bold** and [label](https://url).
 * Every number on these pages comes from a file in the project's repository;
 * see src/content/data/movielens/README.md for provenance.
 */

export type ProjectSlug = "research-navigator" | "branch-closure-analysis" | "movie-recommender";

export type FigureId =
  | "rn-workflow"
  | "branch-dag"
  | "movielens-headline"
  | "movielens-sweep"
  | "movielens-split";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "lead"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "grid"; items: { title: string; text: string }[] }
  | { kind: "stats"; items: { value: string; label: string; note?: string }[] }
  | { kind: "figure"; figure: FigureId; caption: string }
  | { kind: "callout"; title: string; text: string }
  | { kind: "status"; built?: string[]; next: string[]; builtLabel?: string; nextLabel?: string }
  | { kind: "pending"; note: string };

export interface CaseSection {
  id: string;
  title: string;
  blocks: Block[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: ProjectSlug;
  number: string;
  title: string;
  /** Honest status shown on the card and the case study. */
  status: string;
  /** OKLCH hue that gives each case study its own identity on the shared system. */
  hue: number;
  year: Maybe<string>;
  /** One or two sentences for the homepage card. */
  summary: string;
  themes: string[];
  role: Maybe<string>;
  stack?: string[];
  links: ProjectLink[];
  sections: CaseSection[];
}

/**
 * Research Navigator's repository already contains a substantial implementation,
 * but the owner currently describes the project as concept/planning stage.
 * Leave this false to keep the public page at that framing; set it to true to
 * show the "built so far" list and the repository link.
 */
export const SHOW_RESEARCH_NAVIGATOR_PROGRESS = false;

const researchNavigatorRepo = "https://github.com/Shaurya6355/research-navigator";

const researchNavigator: Project = {
  slug: "research-navigator",
  number: "01",
  title: "Research Navigator",
  status: "In development",
  hue: 295,
  year: "2026",
  summary:
    "A workspace for exploring research literature with an LLM: map a field, follow every claim back to the passage that supports it, and keep a trail of how each research direction was reached.",
  themes: ["LLM systems", "Information retrieval", "Evidence & traceability"],
  role: pending("Your role, e.g. \"Solo project — design and implementation\""),
  stack: SHOW_RESEARCH_NAVIGATOR_PROGRESS
    ? ["Python", "FastAPI", "PostgreSQL + pgvector", "GROBID", "React", "TypeScript"]
    : undefined,
  links: SHOW_RESEARCH_NAVIGATOR_PROGRESS ? [{ label: "Repository", href: researchNavigatorRepo }] : [],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "lead",
          text: "Research Navigator is a workspace for the early, uncertain part of research — when you have a question but don't yet know which areas matter, which papers are central, or where the open problems are.",
        },
        {
          kind: "p",
          text: "It is **in development and has not been released**. This page describes the problem, the design, and what still has to be shown before it is useful to anyone else. It will grow as the work does.",
        },
      ],
    },
    {
      id: "problem",
      title: "Problem",
      blocks: [
        {
          kind: "p",
          text: "Search tools return papers, and language models can summarize them fluently. Neither helps much with the harder task: building a defensible picture of a field — how approaches relate, where results disagree, and which gaps are real rather than artifacts of what you happened to read.",
        },
        {
          kind: "p",
          text: "A fluent summary with no traceable source is a liability in research. So the goal is not a better summarizer. It is an evidence base you can audit, and candidate directions that come with the reasoning and sources that produced them.",
        },
      ],
    },
    {
      id: "principles",
      title: "Design principles",
      blocks: [
        {
          kind: "grid",
          items: [
            {
              title: "Evidence over generation",
              text: "A research direction that can't be traced to evidence doesn't get shown.",
            },
            {
              title: "The model reasons; code does the rest",
              text: "Deduplication, filtering, retries, state and provenance are ordinary, testable code. The LLM is used only where judgment is required.",
            },
            {
              title: "One orchestrator, explicit state",
              text: "A single state machine with a tool layer — no agent swarm, no framework — so every step can be inspected and resumed.",
            },
            {
              title: "Retrieved text is untrusted",
              text: "Paper content can never override instructions, and every structured model output is validated.",
            },
            {
              title: "Missing data stays missing",
              text: "No invented metadata, citations or findings. Gaps in the evidence are reported as gaps.",
            },
          ],
        },
      ],
    },
    {
      id: "workflow",
      title: "Workflow",
      blocks: [
        {
          kind: "figure",
          figure: "rn-workflow",
          caption:
            "The research workflow the system is designed around. Exploration repeats until a coverage check passes; every proposed direction links back through gaps and claims to evidence.",
        },
      ],
    },
    {
      id: "status",
      title: "Status",
      blocks: SHOW_RESEARCH_NAVIGATOR_PROGRESS
        ? [
            {
              kind: "status",
              builtLabel: "Built so far (not yet released)",
              built: [
                "Literature discovery across OpenAlex, Semantic Scholar and arXiv, with deduplication and date filtering",
                "Hybrid ranking (BM25, embeddings, citations, recency) that explains each signal's contribution",
                "PDF ingestion with GROBID and PyMuPDF, keeping page-level provenance",
                "Claim extraction whose quotes are checked verbatim against the source text",
                "A persisted, restartable session state machine with a full event trail",
                "An API and a web workspace for running and inspecting sessions",
              ],
              nextLabel: "Still ahead",
              next: [
                "A full evaluation: human judgments, judge calibration and comparison against existing tools",
                "A public deployment",
              ],
            },
          ]
        : [
            {
              kind: "p",
              text: "Implementation is under way. Nothing has been released or deployed, and the work that decides whether the evidence trail can be trusted — evaluating retrieval and claim extraction — is still in progress.",
            },
            {
              kind: "pending",
              note: "Your repository shows phases 0–12 of 13 complete (retrieval, ingestion, claim extraction, orchestrator, API, web workspace, deployment artifacts) and a first evaluation baseline. Set SHOW_RESEARCH_NAVIGATOR_PROGRESS = true in src/content/projects.ts to show that progress and the repository link.",
            },
          ],
    },
    {
      id: "evaluation",
      title: "How it will be judged",
      blocks: [
        {
          kind: "p",
          text: "Three questions decide whether this is useful, and they are the focus of the remaining work:",
        },
        {
          kind: "list",
          items: [
            "**Retrieval** — does it surface the papers a knowledgeable reader would consider relevant, ranked sensibly?",
            "**Faithfulness** — is each extracted claim actually supported by the passage it cites?",
            "**Directions** — are the proposed directions traceable to evidence, and more than restatements of a single paper?",
          ],
        },
        {
          kind: "p",
          text: "Judging is kept separate from the system being judged, and results will be published with the conditions that produced them.",
        },
      ],
    },
  ],
};

const branchClosure: Project = {
  slug: "branch-closure-analysis",
  number: "02",
  title: "Branch Closure Analysis",
  status: "Completed · professional work",
  hue: 245,
  year: pending("Year (or leave out)"),
  summary:
    "A causal analysis of how bank branch closures change customer behavior — framed around the decision, explicit about its assumptions, and honest about what observational data can and can't show.",
  themes: ["Causal inference", "Observational data", "Decision analysis"],
  role: pending("Your role on the project"),
  links: [],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "lead",
          text: "When a bank closes a branch, what happens to the customers who used it? This project examined that question with causal analysis of customer behavior around closures.",
        },
        {
          kind: "callout",
          title: "About this case study",
          text: "This was professional work. To respect confidentiality it is anonymized: no employer data, internal documents, figures or operational details appear here. The page focuses on how the problem was framed and reasoned about.",
        },
      ],
    },
    {
      id: "decision",
      title: "The decision problem",
      blocks: [
        {
          kind: "p",
          text: "Closing a branch saves cost, but the trade-off only makes sense if you know what it does to customers — whether they shift to other channels or nearby branches, change how they bank, or leave. A naive before-and-after comparison can't answer that, and the answer matters for decisions about future closures.",
        },
        { kind: "pending", note: "Optional: one or two anonymized sentences on who used the analysis and for which decision." },
      ],
    },
    {
      id: "why-causal",
      title: "Why it's a causal question",
      blocks: [
        {
          kind: "p",
          text: "Closures aren't assigned at random. The same conditions that lead to a closure — a branch's performance, the trends in its neighborhood — can also shape how its customers behave. Comparing affected customers with everyone else mixes the effect of the closure with the reasons it was chosen.",
        },
        {
          kind: "figure",
          figure: "branch-dag",
          caption:
            "A conceptual diagram of the identification problem — not a result. The arrow of interest is the closure's effect on behavior; the shared causes on top are what make a simple comparison misleading.",
        },
        {
          kind: "p",
          text: "Any credible answer has to deal with questions like these:",
        },
        {
          kind: "grid",
          items: [
            {
              title: "Selection",
              text: "Which customers form a fair comparison for those whose branch closed?",
            },
            {
              title: "Timing",
              text: "Behavior can change before a closure — once it is announced, or as a branch declines.",
            },
            {
              title: "Spillovers",
              text: "Customers of a closed branch may move to nearby ones, so neighbors aren't untouched.",
            },
            {
              title: "Heterogeneity",
              text: "The effect is unlikely to be the same for every customer or every location.",
            },
          ],
        },
      ],
    },
    {
      id: "approach",
      title: "Approach",
      blocks: [
        { kind: "pending", note: "Method used (e.g. difference-in-differences, matching, synthetic control) and why it fit — anonymized." },
        { kind: "pending", note: "Identification assumptions you relied on and how you checked them (pre-trends, placebo tests, robustness)." },
      ],
    },
    {
      id: "findings",
      title: "Interpretation",
      blocks: [
        {
          kind: "p",
          text: "Methods and findings will be added here once they are cleared for public sharing.",
        },
        { kind: "pending", note: "Only directional, approved findings. No internal metrics, customer counts or branch details." },
      ],
    },
    {
      id: "limits",
      title: "Limitations",
      blocks: [
        { kind: "pending", note: "Limitations and what the analysis could not establish." },
      ],
    },
  ],
};

const movieRecommender: Project = {
  slug: "movie-recommender",
  number: "03",
  title: "Movie Recommender",
  status: "Completed · open source",
  hue: 35,
  year: "2026",
  summary:
    "Implicit-ALS matrix factorization against a popularity baseline on MovieLens 25M, under a strict temporal split with bootstrapped confidence intervals — and a slim API that serves it in about a millisecond.",
  themes: ["Recommender systems", "Model evaluation", "Uncertainty"],
  role: pending("Your role, e.g. \"Solo project\""),
  stack: ["Python", "implicit (ALS)", "NumPy / SciPy", "pandas", "FastAPI", "Docker", "GitHub Actions"],
  links: [{ label: "Repository", href: "https://github.com/Shaurya6355/movielens-recommender" }],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "lead",
          text: "Does a personalized model actually beat recommending what's popular — when it's evaluated the way it would be used, predicting the future from the past?",
        },
        {
          kind: "p",
          text: "A collaborative-filtering recommender on the [MovieLens 25M](https://grouplens.org/datasets/movielens/25m/) dataset (25 million ratings from 162,000 users on 62,000 movies). The point was evaluation rigor rather than a novel architecture: a strong, simple model, compared honestly with the obvious baseline.",
        },
        {
          kind: "stats",
          items: [
            { value: "+0.026", label: "NDCG@10 over popularity", note: "paired 95% CI [0.022, 0.030]" },
            { value: "16×", label: "more of the catalog recommended", note: "coverage@10: 2.7% vs 0.2%" },
            { value: "1.45 ms", label: "p99 serving latency", note: "laptop, 1,000 sequential requests" },
          ],
        },
      ],
    },
    {
      id: "problem",
      title: "Problem",
      blocks: [
        {
          kind: "p",
          text: "Recommenders often look good because of how they are evaluated. A random train/test split lets a model learn from ratings made after the ones it is asked to predict. A single score with no interval can't separate a real improvement from noise. And a model that only recommends the same popular titles can score respectably while being nearly useless.",
        },
      ],
    },
    {
      id: "decisions",
      title: "Key decisions",
      blocks: [
        {
          kind: "grid",
          items: [
            {
              title: "Split by time, not at random",
              text: "Train on interactions before a cutoff, test on those after. Cutoffs come from timestamp quantiles and are written to a manifest that the tests and figures both read.",
            },
            {
              title: "Make leakage a failing test",
              text: "A test fails if a single training timestamp crosses the cutoff — and another test proves that check can fail.",
            },
            {
              title: "One definition of 'liked'",
              text: "A rating of 4.0 or higher is a positive, for training and for test relevance. A two-star rating means watched and disliked, not a signal to recommend more of it.",
            },
            {
              title: "A strong, simple model",
              text: "Implicit ALS: minutes to train on a CPU, a few interpretable knobs, and a well-understood baseline for implicit feedback at this scale.",
            },
          ],
        },
      ],
    },
    {
      id: "approach",
      title: "Approach",
      blocks: [
        {
          kind: "figure",
          figure: "movielens-split",
          caption:
            "The temporal split recorded in the repository's manifest. Hyperparameters were tuned only on the validation window; the test window was reserved for the final comparison.",
        },
        {
          kind: "list",
          items: [
            "**Two arms behind one interface:** a popularity baseline and implicit ALS, so the evaluation harness treats them identically.",
            "**Tuning:** a 27-point grid (factors × regularization × confidence weight α) scored on the validation window. The selected model — 64 factors, regularization 0.001, α = 10 — was retrained on training plus validation data.",
            "**Metrics:** Recall@K and NDCG@K for K = 10 and 20, catalog coverage and popularity bias. Users with no positive training history can't be personalized; the 5,942 of them are excluded and counted in the results file rather than hidden.",
            "**Uncertainty:** per-user metrics with percentile bootstrap intervals (1,000 resamples). Both arms share the same resample indices, so the difference between them is a paired estimate.",
          ],
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          kind: "p",
          text: "On the held-out test window (2018-12-23 to 2019-11-21) — 4,727 users with 110,323 relevant user–movie pairs — ALS improves ranking quality over popularity, and the paired interval on the difference excludes zero.",
        },
        {
          kind: "figure",
          figure: "movielens-headline",
          caption:
            "NDCG@10 on the test window with 95% bootstrap intervals. Source: reports/results/evaluation.json in the repository.",
        },
        {
          kind: "p",
          text: "The tuning sweep shows a real trade-off. Raising the confidence weight α pushes recommendations deeper into the catalog — up to 5.5% coverage — but costs ranking accuracy. α = 10 gave the best NDCG at every factor count.",
        },
        {
          kind: "figure",
          figure: "movielens-sweep",
          caption:
            "All 27 tuning runs, scored on the validation window. Source: the repository's tuning sweep output.",
        },
        {
          kind: "callout",
          title: "Cold start, measured",
          text: "On test items with fewer than five positive training interactions (13,370 relevant pairs across 2,365 users), both models score exactly zero: popularity ranks those items last by definition, and ALS has no signal to learn their factors from. A content arm built on sentence embeddings of plot and metadata text exists to fix this; it is implemented but not yet evaluated.",
        },
      ],
    },
    {
      id: "serving",
      title: "Serving",
      blocks: [
        {
          kind: "p",
          text: "Model artifacts are saved as plain NumPy arrays and JSON — never pickles — so the API runs on NumPy and FastAPI alone, and the Docker image carries no training stack. CI builds the container and smoke-tests every endpoint on each push.",
        },
        {
          kind: "stats",
          items: [
            { value: "1.20 ms", label: "p50 latency" },
            { value: "1.36 ms", label: "p95 latency" },
            { value: "~558", label: "requests per second" },
          ],
        },
        {
          kind: "p",
          text: "Measured on an M4 laptop: 1,000 sequential requests after warm-up, an 80/20 mix of user recommendations and similar-item lookups.",
        },
      ],
    },
    {
      id: "online",
      title: "From offline to online",
      blocks: [
        {
          kind: "p",
          text: "An offline win is a reason to run an experiment, not to ship. The repository includes a written A/B test design for putting ALS behind a \"Recommended for you\" shelf:",
        },
        {
          kind: "list",
          items: [
            "**Randomize by user**, with eligibility limited to users who have history the model can use.",
            "**Primary metric:** whether an exposed user starts at least one playback from the shelf within 14 days — chosen over click-through, which is easy to game, and over watch time, which is too noisy to power quickly.",
            "**Guardrail:** total watch time, so that a better shelf can't win by cannibalizing the rest of the product.",
            "**The decision rule is written before any results.**",
          ],
        },
      ],
    },
    {
      id: "limitations",
      title: "Limitations",
      blocks: [
        {
          kind: "list",
          items: [
            "Offline replay of logged ratings can't see exposure bias: users could only rate what they were shown. Only the online experiment can establish the causal claim.",
            "ALS still concentrates on popular titles — its recommendations sit, on average, in the top 1% of the catalog by popularity. Personalization here mostly means choosing *which* popular titles, not deep-catalog discovery.",
            "One dataset and one temporal split. The machinery is dataset-agnostic; the numbers are specific to MovieLens.",
          ],
        },
        { kind: "pending", note: "Optional: a short \"what I'd do differently\" paragraph in your own words." },
      ],
    },
  ],
};

export const projects: Project[] = [researchNavigator, branchClosure, movieRecommender];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
