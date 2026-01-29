import { FC, InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Checkbox label
   */
  label?: string

  /**
   * Helper text below checkbox
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
 * Checkbox - Checkbox input with label and error states
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="I agree to the terms and conditions"
 *   checked={agreed}
 *   onChange={(e) => setAgreed(e.target.checked)}
 * />
 *
 * <Checkbox
 *   label="Subscribe to newsletter"
 *   helperText="We'll send you updates about new events"
 * />
 * ```
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
    const inputId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`
    const hasError = !!error

    return (
      <div className="ticketing-checkbox__wrapper">
        <div className="ticketing-checkbox__group">
          <div className="ticketing-checkbox__input-container">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              className={clsx(
                'ticketing-checkbox__input',
                `ticketing-checkbox__input--${size}`,
                {
                  'ticketing-checkbox__input--error': hasError,
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
                'ticketing-checkbox__label',
                `ticketing-checkbox__label--${size}`
              )}
            >
              {label}
            </label>
          )}
        </div>
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="ticketing-checkbox__error"
          >
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="ticketing-checkbox__helper"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
