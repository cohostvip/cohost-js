import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Radio label
   */
  label?: ReactNode

  /**
   * Helper text below radio
   */
  helperText?: string

  /**
   * Error message (shows in error state)
   */
  error?: string

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Radio - Radio input with label and error states
 *
 * @example
 * ```tsx
 * <Radio
 *   name="payment"
 *   value="card"
 *   label="Credit Card"
 *   checked={payment === 'card'}
 *   onChange={(e) => setPayment(e.target.value)}
 * />
 *
 * <Radio
 *   name="payment"
 *   value="paypal"
 *   label="PayPal"
 *   checked={payment === 'paypal'}
 *   onChange={(e) => setPayment(e.target.value)}
 * />
 * ```
 */
const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `radio-${Math.random().toString(36).slice(2, 9)}`
    const hasError = !!error

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    }

    return (
      <div className="flex flex-col">
        <div className="flex items-start gap-3">
          <div className="flex items-center h-6">
            <input
              ref={ref}
              type="radio"
              id={inputId}
              className={clsx(
                sizeClasses[size],
                'rounded-full border bg-ticketing-background text-ticketing-primary',
                'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-ticketing-primary/50',
                'transition-colors cursor-pointer',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                hasError ? 'border-ticketing-error' : 'border-ticketing-border',
                className
              )}
              aria-invalid={hasError}
              aria-describedby={
                hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              {...props}
            />
          </div>
          {label && (
            <label
              htmlFor={inputId}
              className={clsx(
                'text-ticketing-text cursor-pointer select-none',
                labelSizeClasses[size]
              )}
            >
              {label}
            </label>
          )}
        </div>
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-ticketing-error ml-8"
          >
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-ticketing-text-muted ml-8"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
