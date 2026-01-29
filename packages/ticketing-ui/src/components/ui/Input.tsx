import { FC, InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: string

  /**
   * Helper text below input
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

  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean
}

/**
 * Input - Text input with label, helper text, and error states
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   helperText="We'll never share your email"
 * />
 *
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`
    const hasError = !!error

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ticketing-text mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            // Base styles
            'rounded-lg border bg-ticketing-background text-ticketing-text placeholder:text-ticketing-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',

            // Size variants
            {
              'px-3 py-1.5 text-sm': size === 'sm',
              'px-4 py-2 text-base': size === 'md',
              'px-4 py-3 text-lg': size === 'lg',
            },

            // Error/normal state
            hasError
              ? 'border-ticketing-error focus:ring-ticketing-error/50'
              : 'border-ticketing-border focus:ring-ticketing-primary/50 focus:border-ticketing-primary',

            fullWidth && 'w-full',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-ticketing-error"
          >
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-ticketing-text-muted"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
