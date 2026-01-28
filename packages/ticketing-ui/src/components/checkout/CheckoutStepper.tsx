import { FC } from 'react'

export interface CheckoutStep {
  id: number
  title: string
  description?: string
}

export interface CheckoutStepperProps {
  steps: CheckoutStep[]
  currentStepId: number
  onStepClick?: (stepId: number) => void
  allowClickableSteps?: boolean
}

/**
 * CheckoutStepper - Visual stepper component for checkout flow
 *
 * Note: This is a visual component only. Consumers must manage step state themselves.
 *
 * @example
 * ```tsx
 * const steps = [
 *   { id: 1, title: 'Tickets', description: 'Select tickets' },
 *   { id: 2, title: 'Info', description: 'Your details' },
 *   { id: 3, title: 'Payment', description: 'Complete order' }
 * ]
 *
 * <CheckoutStepper
 *   steps={steps}
 *   currentStepId={2}
 *   onStepClick={(id) => goToStep(id)}
 *   allowClickableSteps
 * />
 * ```
 */
const CheckoutStepper: FC<CheckoutStepperProps> = ({
  steps,
  currentStepId,
  onStepClick,
  allowClickableSteps = false,
}) => {
  const handleStepClick = (stepId: number) => {
    if (allowClickableSteps && onStepClick && stepId < currentStepId) {
      onStepClick(stepId)
    }
  }

  return (
    <div className="mb-8 px-8 h-8">
      <nav aria-label="Progress">
        <div className="relative">
          {/* Background line spanning full width */}
          <div
            className="absolute top-2 left-2 right-2 h-0.5 bg-ticketing-border"
            aria-hidden="true"
          />

          {/* Progress line */}
          <div
            className="absolute top-2 left-2 h-0.5 bg-ticketing-primary transition-all duration-300"
            style={{
              width:
                steps.length > 1
                  ? `calc(${((currentStepId - 1) / (steps.length - 1)) * 100}% - ${((currentStepId - 1) / (steps.length - 1)) * 8}px)`
                  : '0%',
            }}
            aria-hidden="true"
          />

          <ol className="flex items-center justify-between w-full relative">
            {steps.map((step) => {
              const isCompleted = step.id < currentStepId
              const isActive = step.id === currentStepId
              const isClickable = allowClickableSteps && isCompleted && onStepClick

              return (
                <li key={step.id} className="relative flex-shrink-0">
                  {isCompleted ? (
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`relative w-4 h-4 flex items-center justify-center bg-ticketing-primary rounded-full transition-colors z-10 ${
                        isClickable
                          ? 'hover:bg-ticketing-primary-hover cursor-pointer'
                          : 'cursor-default'
                      }`}
                      aria-label={`Go to ${step.title}`}
                    >
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">{step.title}</span>
                    </button>
                  ) : isActive ? (
                    <div
                      className="relative w-4 h-4 flex items-center justify-center bg-ticketing-background border-2 border-ticketing-primary rounded-full z-10"
                      aria-current="step"
                    >
                      <span className="h-1 w-1 bg-ticketing-primary rounded-full" />
                      <span className="sr-only">{step.title}</span>
                    </div>
                  ) : (
                    <div className="group relative w-4 h-4 flex items-center justify-center bg-ticketing-background border-2 border-ticketing-border rounded-full hover:border-ticketing-muted z-10">
                      <span className="h-1 w-1 bg-transparent rounded-full group-hover:bg-ticketing-muted" />
                      <span className="sr-only">{step.title}</span>
                    </div>
                  )}

                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center w-20 sm:w-24">
                    <p className="text-xs font-medium text-ticketing-text truncate">
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-ticketing-muted truncate">
                        {step.description}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </div>
  )
}

export default CheckoutStepper
