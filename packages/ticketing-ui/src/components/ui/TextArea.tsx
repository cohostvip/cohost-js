import { FC, TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
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

  /**
   * Resize behavior
   * @default 'vertical'
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

/**
 * TextArea - Multi-line text input with label, helper text, and error states
 *
 * @example
 * ```tsx
 * <TextArea
 *   label="Message"
 *   placeholder="Enter your message..."
 *   rows={4}
 * />
 *
 * <TextArea
 *   label="Bio"
 *   error="Bio is required"
 *   resize="none"
 * />
 * ```
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      resize = 'vertical',
      className,
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`
    const hasError = !!error

    const resizeClass = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }[resize]

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
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={clsx(
            // Base styles
            'rounded-lg border bg-ticketing-background text-ticketing-text placeholder:text-ticketing-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            resizeClass,

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

TextArea.displayName = 'TextArea'

export default TextArea
