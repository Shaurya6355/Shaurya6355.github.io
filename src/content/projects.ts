import type { Maybe } from "@/lib/pending";

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
  year?: Maybe<string>;
  /** One or two sentences for the homepage card. */
  summary: string;
  themes: string[];
  role: Maybe<string>;
  stack?: string[];
  links: ProjectLink[];
  sections: CaseSection[];
}

/**
 * Research Navigator's public framing. The owner's résumé presents it with its repository and
 * benchmark results, so implementation progress and the repo link are shown. It is not deployed.
 */
export const SHOW_RESEARCH_NAVIGATOR_PROGRESS = true;

const researchNavigatorRepo = "https://github.com/Shaurya6355/research-navigator";

const researchNavigator: Project = {
  slug: "research-navigator",
  number: "01",
  title: "Research Navigator",
  status: "In development",
  hue: 295,
  year: "2026",
  summary:
    "An LLM tool for exploring research literature. It maps out a field and keeps every claim tied to the passage it came from, so you can check how each suggested research direction was reached.",
  themes: ["LLM systems", "Information retrieval", "Evidence & traceability"],
  role: "Solo project (design and implementation)",
  stack: SHOW_RESEARCH_NAVIGATOR_PROGRESS
    ? ["Python", "Anthropic SDK", "FastAPI", "PostgreSQL + pgvector", "GROBID", "React", "TypeScript"]
    : undefined,
  links: SHOW_RESEARCH_NAVIGATOR_PROGRESS ? [{ label: "Repository", href: researchNavigatorRepo }] : [],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "lead",
          text: "Research Navigator is meant for the early part of research, when you have a question but don't yet know which areas matter, which papers are central or where the open problems are.",
        },
        {
          kind: "p",
          text: SHOW_RESEARCH_NAVIGATOR_PROGRESS
            ? "A research session now runs end to end, from a question to candidate directions, through an API and a web workspace. It's **still in development and isn't deployed publicly**, and the evaluation is at an early baseline. Below is the problem it's meant to solve, how it's designed, and what the first measurements show (and don't)."
            : "It is **in development and has not been released**. This page describes the problem, the design, and what still has to be shown before it is useful to anyone else.",
        },
      ],
    },
    {
      id: "problem",
      title: "Problem",
      blocks: [
        {
          kind: "p",
          text: "Search tools find papers, and language models can summarize them well. Neither helps much with the harder part, which is building a picture of a field that you can defend: how the approaches relate, where results disagree, and which gaps are real rather than artifacts of what you happened to read.",
        },
        {
          kind: "p",
          text: "In research, a fluent summary you can't trace back to a source is a liability. So instead of summaries, Research Navigator builds an evidence base you can audit, and every direction it suggests comes with the reasoning and sources behind it.",
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
              text: "A research direction that can't be traced to evidence doesn't get shown. Extracted quotes are verified verbatim against the source, and unsupported claims are dropped.",
            },
            {
              title: "The model reasons; code does the rest",
              text: "Deduplication, filtering, retries, state and provenance are all ordinary code with tests. The LLM only handles steps that need judgment, and it has to return schema-constrained JSON.",
            },
            {
              title: "One orchestrator, explicit state",
              text: "A single state machine with a tool layer, without an agent swarm or a framework, so any step can be inspected and resumed.",
            },
            {
              title: "Retrieved text is untrusted",
              text: "Paper content is delimited so it can never override instructions, and every structured model output is validated.",
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
            "The research workflow. Exploration repeats until the coverage check passes, and every proposed direction links back through gaps and claims to the evidence.",
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
              builtLabel: "Built so far (not deployed)",
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
                "A fuller evaluation: human judgments, judge calibration and comparison against existing tools",
                "A public deployment",
              ],
            },
          ]
        : [
            {
              kind: "p",
              text: "Implementation is under way. Nothing has been released or deployed, and the work that decides whether the evidence trail can be trusted (evaluating retrieval and claim extraction) is still in progress.",
            },
          ],
    },
    {
      id: "evaluation",
      title: "Evaluation so far",
      blocks: SHOW_RESEARCH_NAVIGATOR_PROGRESS
        ? [
            {
              kind: "p",
              text: "So far there's a first baseline, with a language model acting as the judge. The judge is kept separate from the system and sees only what a human reviewer would (the title and abstract for relevance, the statement and quote for claims), never the ranking or settings that produced them.",
            },
            {
              kind: "stats",
              items: [
                { value: "62 / 62", label: "extracted claims judged genuine", note: "4 sessions, 12 papers" },
                { value: "0.98", label: "share of claims fully supported by their quote", note: "61 of 62; one partial" },
                { value: "175", label: "pooled papers judged for relevance", note: "8 questions, 5 ranking strategies" },
              ],
            },
            {
              kind: "list",
              items: [
                "**Ranking:** over the seven questions with enough relevant papers to compare, semantic-only ranking scored highest on nDCG@10 and BM25-only clearly lowest. Across all eight, the default hybrid ranking did *not* beat the literature sources' own ordering. With so few questions, none of the differences among the top strategies is statistically meaningful.",
                "**Claims:** this run extracted claims from abstracts only, so it says little yet about full-text extraction.",
                "**Not yet done:** human judgments, calibration of the model judge, and comparison with other tools.",
              ],
            },
          ]
        : [
            {
              kind: "list",
              items: [
                "**Retrieval:** does it surface the papers a knowledgeable reader would consider relevant, ranked sensibly?",
                "**Faithfulness:** is each extracted claim actually supported by the passage it cites?",
                "**Directions:** are the proposed directions traceable to evidence, and more than restatements of a single paper?",
              ],
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
  hue: 150,
  summary:
    "A causal estimate of how bank branch closures affected account openings, both in branches and online, which I then turned into a simulator that forecasts the loss from any proposed closure.",
  themes: ["Causal inference", "Uplift modeling", "Decision analysis"],
  role: "Data scientist (causal estimate and closure simulator)",
  links: [],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "lead",
          text: "When a bank closes a branch, what happens to the customers who used it? I estimated how past closures affected account openings, then built that into a tool for deciding which branches to close next.",
        },
        {
          kind: "callout",
          title: "About this case study",
          text: "This was professional work at a large US bank. To keep it confidential, this page covers the reasoning and methods only, with no internal data, documents or figures. The effect sizes are on my résumé.",
        },
      ],
    },
    {
      id: "decision",
      title: "The decision problem",
      blocks: [
        {
          kind: "p",
          text: "Closing a branch saves money, but you can only judge the trade-off if you know what it does to customers. Does new business move to digital channels or nearby branches, or is it simply lost? A before-and-after comparison can't tell you, and the answer shapes decisions about future closures.",
        },
      ],
    },
    {
      id: "why-causal",
      title: "Why it's a causal question",
      blocks: [
        {
          kind: "p",
          text: "Closures aren't random. The things that lead a bank to close a branch, like its performance or how its neighborhood is changing, can also affect how its customers behave. If you simply compare affected customers with everyone else, you mix up the effect of the closure with the reasons it was chosen.",
        },
        {
          kind: "figure",
          figure: "branch-dag",
          caption:
            "A conceptual diagram of the identification problem, not a result. The arrow that matters is the closure's effect on behavior. The shared causes at the top are what make a simple comparison misleading.",
        },
      ],
    },
    {
      id: "approach",
      title: "Approach",
      blocks: [
        {
          kind: "list",
          items: [
            "**Estimand:** the average effect of closure on the branches that actually closed (the ATT), since that's what matters when deciding whether to close similar branches.",
            "**Comparison:** closed branches against comparable branches that stayed open, rather than against their own past.",
            "**Estimator:** T-learner uplift models. Closed and still-open branches each get their own outcome model, so a closed branch's counterfactual comes from the open-branch model applied to the same local characteristics.",
            "**Features:** census block-group and metro-area (CBSA) characteristics of each branch's surroundings.",
            "**Channels:** separate models for in-branch and digital account openings.",
          ],
        },
      ],
    },
    {
      id: "assumptions",
      title: "What the estimate rests on",
      blocks: [
        {
          kind: "p",
          text: "Like any effect estimated from observational data, this one depends on assumptions that can't be fully tested:",
        },
        {
          kind: "grid",
          items: [
            {
              title: "No hidden confounders",
              text: "Given the local features, nothing else that drove closure decisions also drove account openings.",
            },
            {
              title: "Overlap",
              text: "For each kind of closed branch, comparable branches remained open to learn the counterfactual from.",
            },
            {
              title: "No spillovers",
              text: "The comparison branches weren't affected themselves. That's a real risk, since customers of a closed branch may move to a nearby one.",
            },
            {
              title: "A fixed horizon",
              text: "The estimate covers the first year after closure. Longer-run effects could be different.",
            },
          ],
        },
        { kind: "pending", note: "Optional: how you checked these (covariate balance, pre-trends, placebo tests), if you can share it." },
      ],
    },
    {
      id: "findings",
      title: "Interpretation",
      blocks: [
        {
          kind: "p",
          text: "Compared with similar branches that stayed open, account openings fell in the first year after a closure, both in the branch and through digital channels. In this data, closing a branch didn't simply move new accounts online.",
        },
      ],
    },
    {
      id: "decision-tool",
      title: "From estimate to decision tool",
      blocks: [
        {
          kind: "p",
          text: "An estimate tells you what past closures cost. The people making the decision need to know what *this* closure would cost. So I built a national branch network simulator that scores the whole network every quarter and uses gradient-boosted regression to forecast the account-opening loss for any proposed closure.",
        },
        {
          kind: "p",
          text: "The simulator was backtested against realized outcomes and adopted by the team that plans the branch network.",
        },
      ],
    },
    {
      id: "limits",
      title: "Limitations",
      blocks: [
        {
          kind: "list",
          items: [
            "The causal interpretation depends on there being no hidden confounders, and local features can't capture everything behind a closure decision.",
            "Backtesting shows the simulator predicts past closures well. That alone doesn't show its forecasts are causal effects for new ones.",
            "Effects beyond the first year, and on customers' other products, are outside this estimate.",
          ],
        },
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
    "Implicit-ALS matrix factorization compared against a popularity baseline on MovieLens 25M, using a strict temporal split and bootstrapped confidence intervals. A small API serves recommendations in about a millisecond.",
  themes: ["Recommender systems", "Model evaluation", "Uncertainty"],
  role: "Solo project",
  stack: ["Python", "implicit (ALS)", "NumPy / SciPy", "pandas", "FastAPI", "Docker", "GitHub Actions"],
  links: [{ label: "Repository", href: "https://github.com/Shaurya6355/movielens-recommender" }],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "lead",
          text: "Does a personalized model actually beat recommending what's popular, when you evaluate it the way it would really be used: predicting future ratings from past ones?",
        },
        {
          kind: "p",
          text: "A collaborative-filtering recommender built on the [MovieLens 25M](https://grouplens.org/datasets/movielens/25m/) dataset (25 million ratings from 162,000 users on 62,000 movies). The focus is on evaluation rather than architecture: a strong, simple model, compared fairly with the obvious baseline.",
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
          text: "Recommenders often look better than they are because of how they're evaluated. A random train/test split lets a model learn from ratings made after the ones it's asked to predict. A single score without an interval can't separate a real improvement from noise. And a model that keeps recommending the same popular titles can score respectably while being close to useless.",
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
              text: "A test fails if even one training timestamp crosses the cutoff, and a second test checks that the first one can actually fail.",
            },
            {
              title: "One definition of 'liked'",
              text: "A rating of 4.0 or higher is a positive, for training and for test relevance. A two-star rating means watched and disliked, not a signal to recommend more of it.",
            },
            {
              title: "A strong, simple model",
              text: "Implicit ALS trains in minutes on a CPU, has a few interpretable settings, and is a well-understood baseline for implicit feedback at this scale.",
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
            "**Tuning:** a 27-point grid (factors × regularization × confidence weight α) scored on the validation window. The selected model (64 factors, regularization 0.001, α = 10) was then retrained on the training and validation data together.",
            "**Metrics:** Recall@K and NDCG@K for K = 10 and 20, plus catalog coverage and popularity bias. Users with no positive training history can't be personalized, so those 5,942 users are excluded and counted in the results file instead of being dropped silently.",
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
          text: "On the held-out test window (2018-12-23 to 2019-11-21), covering 4,727 users and 110,323 relevant user-movie pairs, ALS ranks better than popularity, and the paired interval on the difference excludes zero.",
        },
        {
          kind: "figure",
          figure: "movielens-headline",
          caption:
            "NDCG@10 on the test window with 95% bootstrap intervals. Source: reports/results/evaluation.json in the repository.",
        },
        {
          kind: "p",
          text: "The tuning sweep shows a real trade-off. Raising the confidence weight α pushes recommendations deeper into the catalog (up to 5.5% coverage) but costs ranking accuracy. α = 10 gave the best NDCG at every factor count.",
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
          text: "On test items with fewer than five positive training interactions (13,370 relevant pairs across 2,365 users), both models score exactly zero. Popularity ranks those items last by definition, and ALS has no signal to learn their factors from. A content arm built on sentence embeddings of plot and metadata text is meant to fix this. It's implemented but not yet evaluated.",
        },
      ],
    },
    {
      id: "serving",
      title: "Serving",
      blocks: [
        {
          kind: "p",
          text: "Model artifacts are saved as plain NumPy arrays and JSON rather than pickles, so the API needs only NumPy and FastAPI, and the Docker image doesn't carry the training stack. CI builds the container and smoke-tests every endpoint on each push.",
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
          text: "An offline win justifies running an experiment, but it isn't enough to ship on. The repository includes a written A/B test design for putting ALS behind a \"Recommended for you\" shelf:",
        },
        {
          kind: "list",
          items: [
            "**Randomize by user**, with eligibility limited to users who have history the model can use.",
            "**Primary metric:** whether an exposed user starts at least one playback from the shelf within 14 days. I chose it over click-through, which is easy to game, and over watch time, which is too noisy to give a clear answer quickly.",
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
            "ALS still leans toward popular titles. On average its recommendations sit in the top 1% of the catalog by popularity, so personalization here mostly means choosing *which* popular titles to show rather than surfacing obscure ones.",
            "This is one dataset and one temporal split. The evaluation code works with any dataset, but the numbers are specific to MovieLens.",
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
