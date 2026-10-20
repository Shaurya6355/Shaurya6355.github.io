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
    experience: "Experience",
    about: "About",
    contact: "Contact",
    resume: "Résumé",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipLink: "Skip to content",
  },

  hero: {
    liveLabel: "Live hypothesis test",
    liveCaption: "Updates as you read",
    /** Rendered as "H₀" / "H₁" with real subscripts. */
    hypothesisSymbol: "H",
    nullHypothesis: "This is just another data science portfolio.",
    alternative: "This one is worth a closer look.",
    tagline:
      "This site runs a hypothesis test on itself. Every section you read counts as evidence against H₀, and the chart keeps score. Pick how strict you want to be, then scroll.",
    cta: "Start collecting evidence",
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

  hypothesis: {
    alphaLabel: "Significance level",
    readoutHolds: "z = {z}, p = {p}. Not enough evidence yet, so H₀ stands.",
    readoutRejected: "z = {z}, p = {p}, below α = {alpha}. H₀ rejected. Thanks for looking around.",
    chartLabel: "Null distribution for H₀, with the rejection region for the chosen significance level and the current test statistic",
    chartRetain: "H₀ stands",
    chartReject: "reject H₀",
    chartObserved: "you are here",
    tagPending: "Reading this counts as evidence against H₀",
    tagCollected: "+{weight} evidence against H₀",
    tagCasePending: "Opening this case study counts as evidence against H₀",
    mapHint: "Clicking a method or a project also counts as evidence (+{weight}).",
    badgeTitle: "Live hypothesis test",
    badgeHolds: "H₀ stands · p = {p}",
    badgeRejected: "H₀ rejected · p = {p}",
    badgeProgress: "z = {z} of {critical} needed at α = {alpha}",
    badgeProgressRejected: "Rejected at α = {alpha}",
    badgeDetails: "Show details",
    toastEvidence: "+{weight} evidence · {label}",
    nudge: "Everything you read here is being counted as evidence against H₀. Open this to follow the test.",
    nudgeDismiss: "Got it",
    verdictTitle: "H₀ rejected",
    verdictText: "At α = {alpha}, the evidence says this isn't just another data science portfolio.",
    panelTitle: "Live hypothesis test",
    panelHypothesis: "H₀: This is just another data science portfolio.",
    panelIntro: "Each part of the site you explore counts as evidence against it. Pick how much evidence it takes.",
    evidenceHeading: "Evidence so far",
    evidenceMissing: "not yet",
    caseEvidence: "Opened the {title} case study",
    disclaimer:
      "Just for fun, not real statistics. The evidence is only what you've looked at, and it's kept in this browser tab, nowhere else.",
    reset: "Start over",
    close: "Close",
    announceRejected: "H₀ rejected at α = {alpha}.",
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
