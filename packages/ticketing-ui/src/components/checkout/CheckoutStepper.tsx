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
    <div className="ticketing-checkout-stepper">
      <nav aria-label="Progress" className="ticketing-checkout-stepper__nav">
        <div className="relative">
          {/* Background line spanning full width */}
          <div
            className="ticketing-checkout-stepper__background-line"
            aria-hidden="true"
          />

          {/* Progress line */}
          <div
            className="ticketing-checkout-stepper__progress-line"
            style={{
              width:
                steps.length > 1
                  ? `calc(${((currentStepId - 1) / (steps.length - 1)) * 100}% - ${((currentStepId - 1) / (steps.length - 1)) * 8}px)`
                  : '0%',
            }}
            aria-hidden="true"
          />

          <ol className="ticketing-checkout-stepper__steps">
            {steps.map((step) => {
              const isCompleted = step.id < currentStepId
              const isActive = step.id === currentStepId
              const isClickable = allowClickableSteps && isCompleted && onStepClick

              return (
                <li key={step.id} className="ticketing-checkout-stepper__step">
                  {isCompleted ? (
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`ticketing-checkout-stepper__indicator ticketing-checkout-stepper__indicator--completed ${
                        isClickable
                          ? ''
                          : 'ticketing-checkout-stepper__indicator--non-clickable'
                      }`}
                      aria-label={`Go to ${step.title}`}
                    >
                      <svg
                        className="ticketing-checkout-stepper__indicator-icon"
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
                      className="ticketing-checkout-stepper__indicator ticketing-checkout-stepper__indicator--active"
                      aria-current="step"
                    >
                      <span className="ticketing-checkout-stepper__indicator-dot" />
                      <span className="sr-only">{step.title}</span>
                    </div>
                  ) : (
                    <div className="ticketing-checkout-stepper__indicator ticketing-checkout-stepper__indicator--inactive">
                      <span className="ticketing-checkout-stepper__indicator-dot ticketing-checkout-stepper__indicator-dot--hover" />
                      <span className="sr-only">{step.title}</span>
                    </div>
                  )}

                  <div className="ticketing-checkout-stepper__labels">
                    <p className="ticketing-checkout-stepper__title">
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="ticketing-checkout-stepper__description">
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
