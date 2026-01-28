import { FC } from 'react'
import TicketCard from './TicketCard'

export interface TicketItem {
  /**
   * Unique ticket ID
   */
  id: string

  /**
   * Ticket name/title
   */
  name: string

  /**
   * Ticket price in cents
   */
  price: number

  /**
   * Currency code
   */
  currency?: string

  /**
   * Optional ticket description (supports HTML)
   */
  description?: string

  /**
   * Ticket availability status
   */
  status?: 'available' | 'sold-out' | 'limited'

  /**
   * Optional quantity available
   */
  quantityAvailable?: number

  /**
   * Whether fees are included in the price
   */
  includesFees?: boolean
}

export interface TicketsListProps {
  /**
   * Array of tickets to display
   */
  tickets: TicketItem[]

  /**
   * Optional title for the list
   */
  title?: string

  /**
   * Callback when a ticket is selected
   */
  onSelectTicket?: (ticket: TicketItem) => void

  /**
   * ID of the currently selected ticket
   */
  selectedTicketId?: string

  /**
   * Show empty state when no tickets
   */
  showEmptyState?: boolean

  /**
   * Custom empty state message
   */
  emptyMessage?: string

  /**
   * Additional CSS classes
   */
  className?: string
}

const TicketsList: FC<TicketsListProps> = ({
  tickets,
  title = 'Available Tickets',
  onSelectTicket,
  selectedTicketId,
  showEmptyState = true,
  emptyMessage = 'No tickets available at this time.',
  className = '',
}) => {
  if (tickets.length === 0 && showEmptyState) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <svg
          className="mx-auto h-12 w-12 text-ticketing-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
        <p className="mt-4 text-ticketing-text-muted">{emptyMessage}</p>
      </div>
    )
  }

  if (tickets.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="mb-4 text-2xl font-bold text-ticketing-text">{title}</h2>
      )}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            name={ticket.name}
            price={ticket.price}
            currency={ticket.currency}
            description={ticket.description}
            status={ticket.status}
            quantityAvailable={ticket.quantityAvailable}
            includesFees={ticket.includesFees}
            onSelect={onSelectTicket ? () => onSelectTicket(ticket) : undefined}
            className={
              selectedTicketId === ticket.id
                ? 'ring-2 ring-ticketing-primary'
                : ''
            }
          />
        ))}
      </div>
    </div>
  )
}

export default TicketsList
