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
    ogLine: "Causal analysis · recommender evaluation · evidence-grounded LLM systems",
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
      "I turn ambiguous questions into analyses and ML systems that hold up — from causal questions about customer behavior to recommenders and evidence-grounded LLM tools.",
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
        "Three projects, each written up as a case study: what the problem was, the choices that mattered, and what the evidence does and doesn't support.",
    },
    methods: {
      accent: "Methods",
      rest: "in practice",
      intro: "How the methods I care about connect to the work above. Only connections the case studies support are drawn.",
    },
    experiment: {
      accent: "A small",
      rest: "experiment",
      intro:
        "Every classifier hides a choice: where to draw the line. Move the threshold and watch precision, recall and the two kinds of mistakes trade places.",
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
      text: "If you're working on a problem like these — or want to talk about one of the projects — I'd be glad to hear from you.",
    },
  },

  approachBand: {
    statement:
      "Start from the **decision**. Measure **honestly**, with the uncertainty attached. Build what **holds up** outside the notebook.",
    link: "See how the methods connect to the work",
  },

  projectList: {
    cta: "Read the case study",
  },

  skillMap: {
    methodsLabel: "Methods",
    projectsLabel: "Projects",
    methodCount: "{count} methods",
    emptyEyebrow: "How to read this",
    emptyHeading: "Select a method or a project",
    emptyText:
      "Each line is a place where a method does real work in a project — not a self-rating. Choose a method to see where it appears, or a project to see what it draws on.",
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
      "At {threshold}, nothing is flagged. Every spam email reaches the inbox, and precision is undefined because there are no flagged emails to be right or wrong about.",
    emailSingular: "email",
    emailPlural: "emails",
    precision: "Precision",
    precisionQuestion: "When it flags an email, how often is it right?",
    precisionDetail: "Of the {flagged} flagged, {tp} are really spam.",
    precisionUndefined: "Undefined — nothing is flagged, so there is nothing to be right or wrong about.",
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
      "**The model gives scores; the threshold makes decisions.** Raising the threshold flags fewer emails: precision tends to rise, recall falls, and more spam slips through. Lowering it catches more spam at the cost of burying real email.",
    explanation2:
      "Neither direction is “correct”. The right threshold depends on which mistake is more expensive — for most people a lost real email is worse than one more spam message, which argues for a higher threshold.",
    syntheticLabel: "Synthetic data",
    syntheticNote:
      "40 hand-written example scores (16 spam, 24 real). Illustrative only — not output from a real model and unrelated to any professional work.",
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
      { name: "Progressive exploration", text: "Go deeper into areas — automatically or as the researcher directs." },
      { name: "Evidence analysis", text: "Read a small set in depth; extract claims with verbatim quotes." },
      { name: "Coverage check", text: "Is the evidence sufficient? If not, explore further." },
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
    text: "The link may be out of date. Everything on the site starts from the homepage.",
    action: "Back to the homepage",
  },
} as const;
