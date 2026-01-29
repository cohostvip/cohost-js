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
  return (
    <div
      className={clsx(
        'ticketing-card',
        `ticketing-card--${variant}`,
        `ticketing-card--padding-${padding}`,
        {
          'ticketing-card--clickable': clickable,
        },
        className
      )}
      {...props}
    >
      {header && (
        <div className="ticketing-card__header" style={{ padding: padding === 'none' ? '1rem' : undefined }}>
          {header}
        </div>
      )}

      <div className="ticketing-card__content">{children}</div>

      {footer && (
        <div className="ticketing-card__footer" style={{ padding: padding === 'none' ? '1rem' : undefined }}>
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
