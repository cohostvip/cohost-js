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

    return (
      <div className={clsx('ticketing-textarea__wrapper', fullWidth && 'ticketing-textarea__wrapper--full-width')}>
        {label && (
          <label
            htmlFor={inputId}
            className="ticketing-textarea__label"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={clsx(
            'ticketing-textarea__field',
            `ticketing-textarea__field--${size}`,
            `ticketing-textarea__field--resize-${resize}`,
            {
              'ticketing-textarea__field--error': hasError,
              'ticketing-textarea__field--full-width': fullWidth,
            },
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
            className="ticketing-textarea__error"
          >
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="ticketing-textarea__helper"
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
