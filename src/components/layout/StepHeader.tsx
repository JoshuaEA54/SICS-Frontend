import { buildSteps, StepBreadcrumb } from "./StepBreadcrumb";

type CurrentStep = Parameters<typeof buildSteps>[0];

interface StepHeaderProps {
  current: CurrentStep;
}

export function StepHeader({ current }: StepHeaderProps) {
  return (
    <div className="sticky top-[64.8px] z-10 border-b border-border bg-white">
      <div className="mx-auto flex h-12 max-w-[1108px] items-center justify-center">
        <StepBreadcrumb steps={buildSteps(current)} />
      </div>
    </div>
  );
}
