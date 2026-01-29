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
        'ticketing-ticket-row',
        soldOut && 'ticketing-ticket-row--sold-out',
        onClick && 'ticketing-ticket-row--clickable',
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
      <div className="ticketing-ticket-row__left-content">
        <div className="ticketing-ticket-row__title-group">
          <h4 className="ticketing-ticket-row__title">{name}</h4>
          {soldOut && (
            <span className="ticketing-ticket-row__badge ticketing-ticket-row__badge--sold-out">
              Sold Out
            </span>
          )}
        </div>
        <div className="ticketing-ticket-row__price-section">
          <DisplayPrice
            price={price}
            className={clsx(
              'ticketing-ticket-row__price',
              soldOut ? 'ticketing-ticket-row__price--sold-out' : 'ticketing-ticket-row__price--available'
            )}
            freeLabel={
              <span className="ticketing-ticket-row__price ticketing-ticket-row__price--available">Free</span>
            }
          />
        </div>
        {description && (
          <p className="ticketing-ticket-row__description">
            {description}
          </p>
        )}
      </div>
      {rightContent && (
        <div className="ticketing-ticket-row__right-content">{rightContent}</div>
      )}
    </div>
  )
}

export default TicketRow
