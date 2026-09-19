export type StepIndicatorItem = {
  key: string;
  title: string;
  description: string;
  isActive: boolean;
  isDone: boolean;
};

type StepIndicatorListProps = {
  steps: readonly StepIndicatorItem[];
};

export const StepIndicatorList = ({ steps }: StepIndicatorListProps) => (
  <div className="mt-8 grid gap-3">
    {steps.map((step, index) => (
      <div
        key={step.key}
        className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/70 p-3"
        data-active={step.isActive}
      >
        <span
          data-active={step.isActive}
          className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground data-[active=true]:bg-blue-600 data-[active=true]:text-white"
        >
          {step.isDone ? "✓" : index + 1}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{step.title}</p>
          <p className="text-xs text-muted-foreground">{step.description}</p>
        </div>
      </div>
    ))}
  </div>
);
