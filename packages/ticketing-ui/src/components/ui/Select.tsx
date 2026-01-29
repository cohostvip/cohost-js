import { FC, SelectHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Select label
   */
  label?: string

  /**
   * Helper text below select
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
   * Full width select
   * @default false
   */
  fullWidth?: boolean

  /**
   * Options to display
   */
  options: SelectOption[]

  /**
   * Placeholder option (value will be empty string)
   */
  placeholder?: string
}

/**
 * Select - Dropdown select with label, helper text, and error states
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   placeholder="Select a country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 * />
 * ```
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      options,
      placeholder,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `select-${Math.random().toString(36).slice(2, 9)}`
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={clsx(
              // Base styles
              'appearance-none rounded-lg border bg-ticketing-background text-ticketing-text',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'transition-colors cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'pr-10', // Space for chevron

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
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-ticketing-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
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

Select.displayName = 'Select'

export default Select
