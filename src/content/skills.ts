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
    how: "Estimating what branch closures did to customer behavior, when closures were chosen rather than randomly assigned.",
  },
  {
    method: "decision",
    project: "branch-closure-analysis",
    how: "Framed around a business decision: what closing a branch means for the customers who used it.",
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
    how: "A strict temporal split guarded by a leakage test; ranking metrics unit-tested against hand-computed examples.",
  },
  {
    method: "uncertainty",
    project: "movie-recommender",
    how: "Paired bootstrap confidence intervals (B = 1,000) so the model comparison is a difference with an interval, not two point estimates.",
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
    how: "A cold-start arm built on sentence embeddings of plot and metadata text — implemented, evaluation pending.",
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
    how: "Designed so the language model reasons only where judgment is needed; everything else is ordinary, testable code.",
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
    how: "Open work: measuring whether retrieval finds the right papers and whether extracted claims are faithful to their sources.",
  },
  {
    method: "engineering",
    project: "research-navigator",
    how: "One orchestrator as an explicit, persisted state machine instead of a swarm of agents — inspectable and restartable.",
  },
];
