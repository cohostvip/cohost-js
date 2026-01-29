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
        'bg-ticketing-surface border border-ticketing-border rounded-lg overflow-hidden',
        className
      )}
    >
      <div className="p-4 border-b border-ticketing-border">
        <h3 className="font-semibold text-ticketing-text">Tickets</h3>
      </div>
      <div className="divide-y divide-ticketing-border">
        {tickets.map((ticket, index) => (
          <div
            key={`${ticket.name}-${index}`}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <span className="text-ticketing-text">{ticket.name}</span>
              <span className="text-ticketing-text-muted ml-2">
                x {ticket.quantity}
              </span>
            </div>
            <DisplayPrice
              price={ticket.totalPrice}
              className="font-medium text-ticketing-text"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TicketsSummary
