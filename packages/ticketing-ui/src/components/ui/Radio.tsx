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

    return (
      <div className="ticketing-radio__wrapper">
        <div className="ticketing-radio__group">
          <div className="ticketing-radio__input-container">
            <input
              ref={ref}
              type="radio"
              id={inputId}
              className={clsx(
                'ticketing-radio__input',
                `ticketing-radio__input--${size}`,
                {
                  'ticketing-radio__input--error': hasError,
                },
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
                'ticketing-radio__label',
                `ticketing-radio__label--${size}`
              )}
            >
              {label}
            </label>
          )}
        </div>
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="ticketing-radio__error"
          >
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="ticketing-radio__helper"
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
