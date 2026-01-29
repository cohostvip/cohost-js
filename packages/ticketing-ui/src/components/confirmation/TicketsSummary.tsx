import { FC } from 'react'
import { clsx } from 'clsx'
import DisplayPrice from '../ui/DisplayPrice'

export interface TicketsSummaryItem {
  /**
   * Ticket name
   */
  name: string

  /**
   * Quantity purchased
   */
  quantity: number

  /**
   * Total price for this line item
   */
  totalPrice: string
}

export interface TicketsSummaryProps {
  /**
   * List of purchased tickets
   */
  tickets: TicketsSummaryItem[]

  /**
   * Additional class name
   */
  className?: string
}

/**
 * TicketsSummary - Purchased tickets summary for order confirmation
 *
 * @example
 * ```tsx
 * <TicketsSummary
 *   tickets={[
 *     { name: 'General Admission', quantity: 2, totalPrice: 'USD,5000' },
 *     { name: 'VIP Experience', quantity: 1, totalPrice: 'USD,7500' },
 *   ]}
 * />
 * ```
 */
const TicketsSummary: FC<TicketsSummaryProps> = ({ tickets, className }) => {
  if (tickets.length === 0) return null

  return (
    <div
      className={clsx(
        'ticketing-tickets-summary',
        className
      )}
    >
      <div className="ticketing-tickets-summary__header">
        <h3 className="ticketing-tickets-summary__header-title">Tickets</h3>
      </div>
      <div className="ticketing-tickets-summary__list">
        {tickets.map((ticket, index) => (
          <div
            key={`${ticket.name}-${index}`}
            className="ticketing-tickets-summary__item"
          >
            <div className="ticketing-tickets-summary__item-info">
              <span className="ticketing-tickets-summary__item-name">{ticket.name}</span>
              <span className="ticketing-tickets-summary__item-quantity">
                x {ticket.quantity}
              </span>
            </div>
            <DisplayPrice
              price={ticket.totalPrice}
              className="ticketing-tickets-summary__item-price"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TicketsSummary
