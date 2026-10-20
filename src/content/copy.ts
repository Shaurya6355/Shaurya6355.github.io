/**
 * Interface copy: every sentence and label a visitor reads that isn't part of a
 * project, experience entry or the about text. Components read from here so all
 * wording lives in src/content/ (and `npm run export:text` can export it).
 *
 * Templates use {placeholders}; fill them with `fill()` from src/lib/fill.ts.
 * Inline markup supported where rendered with RichText: **bold**, *italic*, [label](url).
 */
export const copy = {
  meta: {
    /** Appended to the name in the browser tab and social cards. */
    titleSuffix: "Applied data science",
    /** Line on the social sharing image. */
    ogLine: "Case studies in causal inference, recommender evaluation and LLM research tools",
  },

  nav: {
    work: "Work",
    methods: "Methods",
    experiment: "Experiment",
    experience: "Experience",
    about: "About",
    contact: "Contact",
    resume: "Résumé",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipLink: "Skip to content",
  },

  hero: {
    eyebrow: "Applied data science",
    tagline:
      "I'm a data scientist. A lot of my work comes down to two questions: did this actually cause that, and is this model really better than the simple alternative?",
    actionWork: "Selected work",
    actionExperience: "Experience",
    actionContact: "Contact",
  },

  sections: {
    approach: { accent: "What", rest: "I do" },
    work: {
      accent: "Selected",
      rest: "work",
      intro:
        "Three projects, each with a longer write-up of why I made the choices I did and what the results can't tell you.",
    },
    methods: {
      accent: "Methods",
      rest: "in practice",
      intro: "Which methods each project actually used. I've only drawn a line where the case study backs it up.",
    },
    experiment: {
      accent: "A small",
      rest: "experiment",
      intro:
        "A classifier gives you scores, but someone still has to decide where to draw the line. Drag the threshold and see how precision, recall and the two kinds of mistakes shift.",
    },
    experience: {
      accent: "Experience",
      industry: "Industry",
      education: "Education",
      teaching: "Teaching",
    },
    about: { accent: "About", rest: "me", interestsPrefix: "Outside work:" },
    contact: {
      accent: "Get",
      rest: "in touch.",
      text: "If you're working on a similar problem, or you'd like to talk through one of these projects, I'd be glad to hear from you.",
    },
  },

  approachBand: {
    statement:
      "I try to start from the **decision** an analysis is meant to inform, and to report results **with their uncertainty** instead of one convenient number.",
    link: "See which methods each project used",
  },

  projectList: {
    cta: "Read the case study",
  },

  skillMap: {
    methodsLabel: "Methods",
    projectsLabel: "Projects",
    methodCount: "{count} methods",
    emptyEyebrow: "How to read this",
    emptyHeading: "Pick a method or a project",
    emptyText:
      "Each line means a method played a real part in that project. These aren't skill ratings. Pick a method to see where it shows up, or a project to see what went into it.",
    methodEyebrow: "Where it shows up",
    projectEyebrow: "Methods in this project",
    clear: "Clear",
  },

  explorer: {
    thresholdLabel: "Decision threshold",
    lower: "Lower threshold by 0.01",
    raise: "Raise threshold by 0.01",
    presetsLabel: "Presets",
    reset: "Reset",
    legendFlagged: "Flagged as spam (score ≥ threshold)",
    legendNotFlagged: "Not flagged",
    rowSpam: "Actually spam",
    rowSpamNote: "{tp} caught · {fn} missed",
    rowReal: "Actually real email",
    rowRealNote: "{fp} wrongly flagged · {tn} delivered",
    axisLabel: "Spam score assigned by the (synthetic) model",
    summary:
      "At {threshold}, the filter flags {flagged} of {total} emails. It catches {tp} of {spam} spam emails and sends {fp} real {fpNoun} to the spam folder.",
    summaryNothingFlagged:
      "At {threshold}, nothing gets flagged, so every spam email lands in the inbox. Precision isn't defined here: with nothing flagged, there's nothing to be right or wrong about.",
    emailSingular: "email",
    emailPlural: "emails",
    precision: "Precision",
    precisionQuestion: "When it flags an email, how often is it right?",
    precisionDetail: "Of the {flagged} flagged, {tp} are really spam.",
    precisionUndefined: "Not defined: nothing is flagged, so there's nothing to be right or wrong about.",
    recall: "Recall",
    recallQuestion: "Of all the spam, how much does it catch?",
    recallDetail: "Of the {spam} spam emails, {tp} are caught.",
    matrixTitle: "Confusion matrix",
    matrixCaption: "Counts of each outcome at threshold {threshold}",
    matrixFlagged: "Flagged",
    matrixNotFlagged: "Not flagged",
    matrixSpam: "Spam",
    matrixReal: "Real",
    cellCaught: "caught",
    cellMissed: "missed",
    cellWronglyFlagged: "wrongly flagged",
    cellDelivered: "delivered",
    explanation1:
      "**The model only produces scores. The threshold is what turns them into decisions.** Raise it and fewer emails get flagged, so the ones that are flagged are more likely to be spam (higher precision), but more spam gets through (lower recall). Lower it and you catch more spam while sending more real email to the spam folder.",
    explanation2:
      "There's no correct setting in general. It depends on which mistake costs more. For most people, losing a real email is worse than seeing one more spam message, which is a reason to set the threshold higher.",
    syntheticLabel: "Synthetic data",
    syntheticNote:
      "40 example scores I wrote by hand (16 spam, 24 real). They're only for illustration: they don't come from a real model and have nothing to do with my professional work.",
    showTable: "Show the data as a table",
    tableEmail: "Email",
    tableScore: "Score",
    tableOutcome: "Outcome at {threshold}",
    outcomeTp: "Spam, caught",
    outcomeFp: "Real email, wrongly flagged",
    outcomeFn: "Spam, missed",
    outcomeTn: "Real email, delivered",
  },

  caseStudy: {
    back: "All work",
    role: "Role",
    themes: "Themes",
    stack: "Stack",
    links: "Links",
    previous: "Previous project",
    next: "Next project",
  },

  figures: {
    rnWorkflowLoop: "↺ loops back to 05",
    rnWorkflow: [
      { name: "Research question", text: "A question about ML or AI, in plain language." },
      { name: "Scope & plan", text: "Turn it into search intents and limits." },
      { name: "Literature discovery", text: "Search several literature sources and remove duplicates." },
      { name: "Landscape", text: "Rank candidates and group them into named research areas." },
      { name: "Progressive exploration", text: "Go deeper into areas, either automatically or where the researcher points it." },
      { name: "Evidence analysis", text: "Read a few papers in depth and pull out claims along with their exact quotes." },
      { name: "Coverage check", text: "Is there enough evidence yet? If not, keep exploring." },
      { name: "Gaps", text: "Where claims conflict, or where nothing covers a combination of ideas." },
      { name: "Directions", text: "Candidate research directions, each traced back to its evidence." },
    ],
    branchDag: {
      title: "Why a naive comparison misleads",
      description:
        "Branch and local conditions influence both the closure decision and customer behavior. The effect of interest is the arrow from the closure decision to customer behavior.",
      confounder: { title: "Branch & local conditions", sub: "performance, neighborhood trends" },
      treatment: { title: "Closure decision", sub: "chosen, not random" },
      outcome: { title: "Customer behavior", sub: "channels, activity, attrition" },
      effectLabel: "effect of interest",
    },
    movielensHeadline: {
      ndcgSubtitle: "ranking quality, 95% bootstrap interval",
      coverageSubtitle: "share of catalog in anyone's top 10",
      popularity: "Popularity",
      als: "Implicit ALS",
      pairedDifference: "Paired difference, ALS − popularity, NDCG@10:",
      users: "{count} users",
      resamples: "{count} paired resamples",
      showTable: "Show as a table",
    },
    movielensSweep: {
      title: "Coverage vs. ranking quality",
      selected: "selected · 64 factors, α = 10",
      showTable: "Show all 27 runs as a table",
    },
    movielensSplit: {
      train: "Train",
      validation: "Validation (tuning only)",
      test: "Test (final comparison)",
      ratings: "{count}M ratings",
    },
  },

  notFound: {
    eyebrow: "404",
    heading: "This page doesn't exist.",
    text: "The link might be out of date. You can find everything from the homepage.",
    action: "Back to the homepage",
  },
} as const;
