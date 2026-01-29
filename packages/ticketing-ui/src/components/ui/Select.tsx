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
      <div className={clsx('ticketing-select__wrapper', fullWidth && 'ticketing-select__wrapper--full-width')}>
        {label && (
          <label
            htmlFor={inputId}
            className="ticketing-select__label"
          >
            {label}
          </label>
        )}
        <div className="ticketing-select__field-wrapper">
          <select
            ref={ref}
            id={inputId}
            className={clsx(
              'ticketing-select__field',
              `ticketing-select__field--${size}`,
              {
                'ticketing-select__field--error': hasError,
                'ticketing-select__field--full-width': fullWidth,
              },
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
          <div className="ticketing-select__chevron">
            <svg
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
            className="ticketing-select__error"
          >
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="ticketing-select__helper"
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
