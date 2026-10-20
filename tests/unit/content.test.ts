import { describe, expect, it } from "vitest";

import evaluation from "@/content/data/movielens/evaluation.json";
import sweep from "@/content/data/movielens/sweep.json";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { methodLinks, methods } from "@/content/skills";
import { isPending } from "@/lib/pending";

describe("skill map data", () => {
  const methodIds = new Set(methods.map((m) => m.id));
  const slugs = new Set(projects.map((p) => p.slug));

  it("only links existing methods and projects", () => {
    for (const l of methodLinks) {
      expect(methodIds, l.method).toContain(l.method);
      expect(slugs, l.project).toContain(l.project);
    }
  });
  it("has no duplicate links and every link explains itself", () => {
    const keys = methodLinks.map((l) => `${l.method}|${l.project}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const l of methodLinks) expect(l.how.length).toBeGreaterThan(20);
  });
  it("leaves no method or project unconnected", () => {
    for (const m of methods) expect(methodLinks.some((l) => l.method === m.id), m.id).toBe(true);
    for (const p of projects) expect(methodLinks.some((l) => l.project === p.slug), p.slug).toBe(true);
  });
});

describe("projects", () => {
  it("are numbered 01–03 in the required order", () => {
    expect(projects.map((p) => p.title)).toEqual(["Research Navigator", "Branch Closure Analysis", "Movie Recommender"]);
    expect(projects.map((p) => p.number)).toEqual(["01", "02", "03"]);
  });
  it("only link to https URLs", () => {
    for (const p of projects) for (const l of p.links) expect(l.href).toMatch(/^https:\/\//);
  });
  it("never describe Research Navigator as released or deployed", () => {
    const text = JSON.stringify(projects[0]).toLowerCase();
    expect(text).not.toMatch(/\b(is live|now available|launched|deployed at)\b/);
  });
  it("keep employer figures off the site (they stay in the résumé only)", () => {
    const branch = projects.find((p) => p.slug === "branch-closure-analysis")!;
    const prose = branch.sections
      .flatMap((s) => s.blocks)
      .filter((b) => b.kind !== "pending")
      .map((b) => JSON.stringify(b))
      .join(" ");
    // Descriptive text only (dates and titles are fine): bullets, case-study prose, map explanations.
    const bullets = experience.flatMap((e) => (Array.isArray(e.highlights) ? e.highlights : []));
    const mapText = methodLinks.filter((l) => l.project === "branch-closure-analysis").map((l) => l.how);
    for (const text of [prose, branch.summary, ...bullets, ...mapText]) {
      expect(text).not.toMatch(/\d+(\.\d+)?\s?%|\b\d{3,}\b|\d,\d{3}|\d+(\.\d+)?[KM]\b|\bdoubled\b|\bthird\b/i);
    }
    expect(prose).not.toMatch(/Wells Fargo|LifeSync/);
  });
});

describe("recommender figures quote the results files", () => {
  const movie = JSON.stringify(projects.find((p) => p.slug === "movie-recommender"));
  it("headline difference matches evaluation.json", () => {
    const d = evaluation.warm.paired_diff_vs_popularity.als;
    expect(movie).toContain(`+${d.mean_diff.toFixed(3)}`);
    expect(movie).toContain(`[${d.ci_lo.toFixed(3)}, ${d.ci_hi.toFixed(3)}]`);
    expect(movie).toContain(evaluation.warm.n_users.toLocaleString("en-US"));
  });
  it("sweep claims hold: alpha=10 best at each factor count, max coverage 5.5%", () => {
    for (const f of [32, 64, 128]) {
      const best = sweep.entries.filter((e) => e.factors === f).sort((a, b) => b["ndcg@10"] - a["ndcg@10"])[0];
      expect(best.alpha).toBe(10);
    }
    const maxCov = Math.max(...sweep.entries.map((e) => e["coverage@10"]));
    expect((maxCov * 100).toFixed(1)).toBe("5.5");
    expect(sweep.entries).toHaveLength(27);
  });
});

describe("site links", () => {
  it("are either pending or well-formed", () => {
    for (const [kind, value] of Object.entries(site.links)) {
      if (isPending(value)) continue;
      if (kind === "email") expect(value).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
      else if (kind === "resume") expect(value).toMatch(/^\/.+\.pdf$/);
      else expect(value).toMatch(/^https:\/\//);
    }
  });
});
