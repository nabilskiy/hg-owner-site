import { useState } from 'react';

export interface Step {
  title: string;
  points: readonly string[];
}

interface Props {
  label: string;
  steps: readonly Step[];
}

export default function GettingStartedSteps({ label, steps }: Props) {
  const [active, setActive] = useState(0);
  const current = steps[active];

  return (
    <div>
      <div role="tablist" aria-label={label} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            role="tab"
            id={`step-tab-${index}`}
            aria-selected={active === index}
            aria-controls={`step-panel-${index}`}
            className="ring-line inline-flex min-h-11 items-center justify-start gap-3 rounded-md bg-white px-3 text-start font-semibold ring-1"
            onClick={() => setActive(index)}
          >
            <span className="rounded-pill bg-surface inline-flex size-8 items-center justify-center text-sm">
              {index + 1}
            </span>
            {step.title}
          </button>
        ))}
      </div>
      {current ? (
        <div
          role="tabpanel"
          id={`step-panel-${active}`}
          aria-labelledby={`step-tab-${active}`}
          className="shadow-card ring-line mt-6 rounded-lg bg-white p-6 ring-1"
        >
          <h3 className="text-xl font-semibold">{current.title}</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {current.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
