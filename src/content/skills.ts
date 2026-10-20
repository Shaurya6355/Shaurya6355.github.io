import type { ProjectSlug } from "./projects";

/**
 * Methods ↔ projects. Every link carries a sentence saying *how* the method shows
 * up in that project, and only links supported by the case-study content exist.
 * There are deliberately no proficiency ratings.
 */
export interface Method {
  id: string;
  label: string;
}

export interface MethodLink {
  method: string;
  project: ProjectSlug;
  how: string;
}

export const methods: Method[] = [
  { id: "causal", label: "Causal inference" },
  { id: "decision", label: "Decision-focused analysis" },
  { id: "experiments", label: "Experimental design" },
  { id: "uncertainty", label: "Uncertainty & inference" },
  { id: "evaluation", label: "Model evaluation" },
  { id: "ml", label: "Machine learning" },
  { id: "retrieval", label: "Information retrieval & ranking" },
  { id: "llm", label: "LLM systems" },
  { id: "provenance", label: "Evidence & traceability" },
  { id: "engineering", label: "ML engineering" },
];

export const methodLinks: MethodLink[] = [
  // Branch Closure Analysis
  {
    method: "causal",
    project: "branch-closure-analysis",
    how: "The effect of closures on account openings (the ATT), estimated against comparable still-open branches because closures weren't random.",
  },
  {
    method: "ml",
    project: "branch-closure-analysis",
    how: "T-learner uplift models for the counterfactual, and gradient-boosted regression in a simulator that scores the branch network quarterly.",
  },
  {
    method: "evaluation",
    project: "branch-closure-analysis",
    how: "The closure simulator was backtested against realized outcomes before it was adopted.",
  },
  {
    method: "decision",
    project: "branch-closure-analysis",
    how: "Turned a one-time estimate into a tool that forecasts the account-opening loss of any candidate closure.",
  },

  // Movie Recommender
  {
    method: "ml",
    project: "movie-recommender",
    how: "Implicit-feedback ALS matrix factorization, tuned on a 27-point grid over a held-out validation window.",
  },
  {
    method: "retrieval",
    project: "movie-recommender",
    how: "Top-K ranking judged with Recall@K and NDCG@K, plus catalog coverage and popularity bias.",
  },
  {
    method: "evaluation",
    project: "movie-recommender",
    how: "A strict temporal split with a test that fails on leakage, and ranking metrics checked against examples worked out by hand.",
  },
  {
    method: "uncertainty",
    project: "movie-recommender",
    how: "Paired bootstrap confidence intervals (B = 1,000), so the comparison between models comes with an interval instead of two bare numbers.",
  },
  {
    method: "experiments",
    project: "movie-recommender",
    how: "A written A/B test design (randomization unit, primary metric, guardrails) for the causal claim offline replay can't make.",
  },
  {
    method: "causal",
    project: "movie-recommender",
    how: "Offline replay can't see exposure bias, so the case for shipping rests on a randomized experiment, specified in advance.",
  },
  {
    method: "decision",
    project: "movie-recommender",
    how: "The A/B design states its decision rule before any results, separating the selection metric from the success metric.",
  },
  {
    method: "llm",
    project: "movie-recommender",
    how: "A cold-start arm built on sentence embeddings of plot and metadata text. It's implemented but not yet evaluated.",
  },
  {
    method: "engineering",
    project: "movie-recommender",
    how: "FastAPI serving from numpy-only artifacts in a slim Docker image, smoke-tested in CI; p99 latency 1.45 ms on a laptop.",
  },

  // Research Navigator
  {
    method: "llm",
    project: "research-navigator",
    how: "The model is only used where judgment is needed, and its output has to fit a schema. Everything else is ordinary code with tests.",
  },
  {
    method: "retrieval",
    project: "research-navigator",
    how: "Literature discovery across several sources, with a ranking whose individual signals can be inspected.",
  },
  {
    method: "provenance",
    project: "research-navigator",
    how: "Every suggested research direction has to trace back through claims to a passage in a source paper.",
  },
  {
    method: "evaluation",
    project: "research-navigator",
    how: "A first baseline with a separate model judge: 62 of 62 extracted claims genuine, and five ranking strategies compared on nDCG@10.",
  },
  {
    method: "engineering",
    project: "research-navigator",
    how: "A single orchestrator built as an explicit, persisted state machine rather than a swarm of agents, so every run can be inspected and restarted.",
  },
];
