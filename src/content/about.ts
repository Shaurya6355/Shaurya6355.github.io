import { pending, type Maybe } from "@/lib/pending";

/**
 * "What I do" (intro) and "About" copy. Written from the site owner's own
 * description of how they work; nothing biographical is invented. Personal
 * interests stay pending until supplied.
 */
export const intro: string[] = [
  "I work on problems where an analysis or a model has to support a real decision. I start from that decision: what would change if we knew the answer, and what evidence would actually be convincing.",
  "Then I choose the simplest method that can answer the question honestly — a causal design when the question is about effects, a strong baseline before anything elaborate — and report the result with its uncertainty, not just a point estimate.",
  "Finally, I build it so it holds up outside a notebook: reproducible, tested where the risk is, and easy for someone else to question. With LLM systems the same discipline applies — a claim should trace back to its evidence.",
];

export const about: { paragraphs: string[]; interests: Maybe<string[]> } = {
  paragraphs: [
    "I'm most interested in the parts of data science where it's easiest to fool yourself: whether an effect is really causal, whether an evaluation measures what matters, how uncertain an estimate is, and whether a model's output can be explained and checked.",
    "I like understanding a problem from first principles before reaching for a tool, and I care about the trade-offs as much as the method — what an approach buys, what it costs, and what it can't tell you.",
  ],
  interests: pending("A few genuine hobbies or interests outside work — a sentence or a short list"),
};
