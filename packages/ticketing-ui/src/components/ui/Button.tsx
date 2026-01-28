import { FC, ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Shows loading spinner and disables interaction
   * @default false
   */
  loading?: boolean

  /**
   * Icon to display before children
   */
  iconLeft?: ReactNode

  /**
   * Icon to display after children
   */
  iconRight?: ReactNode

  /**
   * Make button full width
   * @default false
   */
  fullWidth?: boolean
}

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Variant styles
        {
          // Primary
          'bg-ticketing-primary text-white hover:bg-ticketing-primary-hover focus:ring-ticketing-primary/50':
            variant === 'primary',

          // Secondary
          'bg-ticketing-surface text-ticketing-text hover:bg-ticketing-surface-hover focus:ring-ticketing-primary/50':
            variant === 'secondary',

          // Outline
          'border border-ticketing-border bg-transparent text-ticketing-text hover:bg-ticketing-surface focus:ring-ticketing-primary/50':
            variant === 'outline',

          // Ghost
          'bg-transparent text-ticketing-text hover:bg-ticketing-surface focus:ring-ticketing-primary/50':
            variant === 'ghost',

          // Destructive
          'bg-ticketing-error text-white hover:opacity-90 focus:ring-ticketing-error/50':
            variant === 'destructive',
        },

        // Size styles
        {
          'px-3 py-1.5 text-sm rounded-md gap-1.5': size === 'sm',
          'px-4 py-2 text-base rounded-lg gap-2': size === 'md',
          'px-6 py-3 text-lg rounded-lg gap-2.5': size === 'lg',
        },

        // Full width
        {
          'w-full': fullWidth,
        },

        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && iconLeft && <span className="inline-flex">{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span className="inline-flex">{iconRight}</span>}
    </button>
  )
}

export default Button
