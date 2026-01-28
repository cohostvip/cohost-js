import { FC, ReactNode, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual style variant
   * @default 'default'
   */
  variant?: 'default' | 'elevated' | 'outlined'

  /**
   * Padding size
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg'

  /**
   * Optional header content
   */
  header?: ReactNode

  /**
   * Optional footer content
   */
  footer?: ReactNode

  /**
   * Make card clickable with hover effects
   * @default false
   */
  clickable?: boolean
}

const Card: FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  header,
  footer,
  clickable = false,
  className,
  children,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const variantClasses = {
    default: 'bg-ticketing-surface border border-ticketing-border',
    elevated: 'bg-ticketing-surface shadow-lg',
    outlined: 'bg-ticketing-background border-2 border-ticketing-border',
  }

  return (
    <div
      className={clsx(
        'rounded-lg transition-all',
        variantClasses[variant],
        {
          'hover:shadow-xl hover:scale-[1.02] cursor-pointer': clickable,
        },
        className
      )}
      {...props}
    >
      {header && (
        <div
          className={clsx(
            'border-b border-ticketing-border',
            padding === 'none' ? 'p-4' : paddingClasses[padding]
          )}
        >
          {header}
        </div>
      )}

      <div className={clsx(paddingClasses[padding])}>{children}</div>

      {footer && (
        <div
          className={clsx(
            'border-t border-ticketing-border',
            padding === 'none' ? 'p-4' : paddingClasses[padding]
          )}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
