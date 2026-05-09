import { CheckSmIcon } from '@/components/ui/Icons'

type StepStatus = 'completed' | 'active' | 'pending'

interface Step {
  label: string
  status: StepStatus
}

interface StepBreadcrumbProps {
  steps: Step[]
}

const STEPS: Step['label'][] = ['Inicio', 'Registro', 'Cuestionario', 'Resultado']

type CurrentStep = 'registro' | 'cuestionario' | 'resultado'

function getStepStatus(
  index: number,
  currentIndex: number,
  completedUpToIndex: number,
): StepStatus {
  if (index < currentIndex || index <= completedUpToIndex) return 'completed'
  if (index === currentIndex) return 'active'
  return 'pending'
}


export function StepBreadcrumb({ steps }: StepBreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-0"
      aria-label="Pasos del proceso"
    >
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-0">
          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            {step.status === 'completed' && (
              <span className="flex size-[14px] items-center justify-center text-teal">
                <CheckSmIcon />
              </span>
            )}
            {step.status === 'active' && (
              <span className="size-[7px] rounded-[3.5px] bg-primary" />
            )}
            {step.status === 'pending' && (
              <span className="size-[7px] rounded-[3.5px] bg-border" />
            )}

            <span
              className={`text-[12.5px] ${
                step.status === 'completed'
                  ? 'text-teal'
                  : step.status === 'active'
                    ? 'font-medium text-primary'
                    : 'text-text-muted'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Divider between steps */}
          {i < steps.length - 1 && (
            <span
              className={`mx-3 h-px w-7 ${
                step.status === 'completed' ? 'bg-teal/25' : 'bg-border'
              }`}
              aria-hidden
            />
          )}
        </div>
      ))}
    </nav>
  )
}

/* Convenience factory to build steps from a current step name */
export function buildSteps(current: CurrentStep): Step[] {
  const map: Record<string, number> = {
    inicio: 0,
    registro: 1,
    cuestionario: 2,
    resultado: 3,
  }
  const currentIndex = map[current]

  return STEPS.map((label, i) => ({
    label,
    status: getStepStatus(i, currentIndex, currentIndex - 1),
  }))
}
