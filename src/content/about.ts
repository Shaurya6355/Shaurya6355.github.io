import { pending, type Maybe } from "@/lib/pending";

/**
 * "What I do" (intro) and "About" copy. Written from the site owner's own
 * description of how they work; nothing biographical is invented. Personal
 * interests stay pending until supplied.
 */
export const intro: string[] = [
  "Most of the problems I've worked on started with a decision someone had to make, like whether to close a branch or whether a new model was worth putting into use. I find it helps to start there, with what would change depending on the answer, before picking a method.",
  "I usually reach for the simplest method that can answer the question properly. For questions about cause and effect, that means a causal design rather than a before-and-after comparison. For models, it means beating a strong baseline and reporting results with their uncertainty, not as a single number.",
  "I also care about what happens after the notebook. The work should be reproducible, tested where mistakes would be costly, and easy for someone else to check. I hold LLM systems to the same standard: if one makes a claim, you should be able to see where that claim came from.",
];

export const about: { paragraphs: string[]; interests: Maybe<string[]> } = {
  paragraphs: [
    "The parts of data science I find most interesting are the ones where it's easy to fool yourself, like mistaking a correlation for an effect, or trusting an evaluation that doesn't measure what matters.",
    "I like to understand a problem properly before reaching for a tool, and I pay as much attention to an approach's trade-offs as to the approach itself, including what it can't tell you.",
    "I'm now doing an M.S. in Data Science at the University of Washington in Seattle, after two years as a data scientist at Wells Fargo. Before that, at BITS Pilani, I was a teaching assistant and taught at the campus machine learning club.",
  ],
  interests: pending("A few genuine hobbies or interests outside work: a sentence or a short list"),
};
