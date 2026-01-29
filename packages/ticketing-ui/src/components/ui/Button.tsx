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
        'ticketing-button',
        `ticketing-button--${variant}`,
        `ticketing-button--${size}`,
        {
          'ticketing-button--full-width': fullWidth,
          'ticketing-button--disabled': isDisabled,
        },
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="ticketing-button__spinner"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            style={{ opacity: 0.25 }}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            style={{ opacity: 0.75 }}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && iconLeft && <span className="ticketing-button__icon">{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span className="ticketing-button__icon">{iconRight}</span>}
    </button>
  )
}

export default Button
