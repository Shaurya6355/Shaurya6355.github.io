const steps = [
  { name: "Research question", text: "A question about ML or AI, in plain language." },
  { name: "Scope & plan", text: "Turn it into search intents and limits." },
  { name: "Literature discovery", text: "Search several literature sources and remove duplicates." },
  { name: "Landscape", text: "Rank candidates and group them into named research areas." },
  { name: "Progressive exploration", text: "Go deeper into areas — automatically or as the researcher directs." },
  { name: "Evidence analysis", text: "Read a small set in depth; extract claims with verbatim quotes." },
  { name: "Coverage check", text: "Is the evidence sufficient? If not, explore further.", loop: true },
  { name: "Gaps", text: "Where claims conflict, or where nothing covers a combination of ideas." },
  { name: "Directions", text: "Candidate research directions, each traced back to its evidence.", end: true },
];

/** The designed Research Navigator workflow as an ordered list of stages. */
export function RnWorkflow() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.name} className={`relative p-5 ${step.end ? "hue-soft bg-surface" : "bg-surface"}`}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[0.75rem] tabular-nums hue-text">{String(i + 1).padStart(2, "0")}</span>
            {step.loop ? (
              <span className="hue-border rounded-full border px-2 py-0.5 text-[0.6875rem] text-ink-2">
                ↺ loops back to 05
              </span>
            ) : null}
          </div>
          <p className="mt-2 font-semibold tracking-[-0.01em] text-ink">{step.name}</p>
          <p className="mt-1 text-[0.875rem] leading-snug text-ink-2">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
