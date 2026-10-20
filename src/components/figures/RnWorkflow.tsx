import { copy } from "@/content/copy";

const LOOP_STEP = 6; // "Coverage check" loops back to exploration
const steps = copy.figures.rnWorkflow.map((step, i) => ({
  ...step,
  loop: i === LOOP_STEP,
  end: i === copy.figures.rnWorkflow.length - 1,
}));

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
                {copy.figures.rnWorkflowLoop}
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
