import { FC, ReactNode } from 'react'
import { clsx } from 'clsx'
import DisplayPrice from '../ui/DisplayPrice'

export interface TicketRowProps {
  /**
   * Ticket name
   */
  name: string

  /**
   * Ticket price in CurrencyAmount format (e.g., "USD,2500")
   */
  price: string

  /**
   * Whether ticket is sold out
   * @default false
   */
  soldOut?: boolean

  /**
   * Optional description
   */
  description?: string

  /**
   * Right side content (e.g., quantity selector)
   */
  rightContent?: ReactNode

  /**
   * Additional class name
   */
  className?: string

  /**
   * Click handler for the row
   */
  onClick?: () => void
}

/**
 * TicketRow - Compact ticket display row (without container)
 *
 * @example
 * ```tsx
 * <TicketRow
 *   name="General Admission"
 *   price="USD,2500"
 *   rightContent={<QuantitySelector ... />}
 * />
 *
 * <TicketRow
 *   name="VIP Experience"
 *   price="USD,7500"
 *   soldOut
 * />
 * ```
 */
const TicketRow: FC<TicketRowProps> = ({
  name,
  price,
  soldOut = false,
  description,
  rightContent,
  className,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        'flex items-start justify-between gap-4 py-4',
        soldOut && 'opacity-60',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-ticketing-text">{name}</h4>
          {soldOut && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
              Sold Out
            </span>
          )}
        </div>
        <div className="mt-1">
          <DisplayPrice
            price={price}
            className={clsx(
              'text-sm',
              soldOut ? 'text-ticketing-text-muted' : 'text-ticketing-accent'
            )}
            freeLabel={
              <span className="text-sm text-ticketing-accent">Free</span>
            }
          />
        </div>
        {description && (
          <p className="mt-1 text-xs text-ticketing-text-muted line-clamp-2">
            {description}
          </p>
        )}
      </div>
      {rightContent && (
        <div className="flex-shrink-0">{rightContent}</div>
      )}
    </div>
  )
}

export default TicketRow
