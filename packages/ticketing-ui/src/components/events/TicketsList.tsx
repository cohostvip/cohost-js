import { FC, useState, useCallback } from 'react'
import { Button, QuantitySelector, DisplayPrice, Modal } from '../ui'

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
   * Ticket price in CurrencyAmount format (e.g., "USD,5000" for $50.00)
   */
  price: string

  /**
   * Optional ticket description (supports HTML)
   */
  description?: string

  /**
   * Ticket availability status
   */
  status?: 'available' | 'sold-out' | 'limited'

  /**
   * Maximum quantity per order
   */
  maxQuantity?: number

  /**
   * Whether fees are included in the price
   */
  includesFees?: boolean

  /**
   * Ticket group ID (for grouped tickets)
   */
  groupId?: string
}

export interface TicketGroup {
  /**
   * Unique group ID
   */
  id: string

  /**
   * Group name
   */
  name: string

  /**
   * Optional group description
   */
  description?: string

  /**
   * Sort order
   */
  sorting?: number
}

export interface TicketQuantities {
  [ticketId: string]: number
}

export interface TicketsListProps {
  /**
   * Array of tickets to display
   */
  tickets: TicketItem[]

  /**
   * Optional ticket groups for organizing tickets
   */
  ticketGroups?: TicketGroup[]

  /**
   * Called when "Get Tickets" button is clicked
   */
  onGetTickets?: (quantities: TicketQuantities) => void

  /**
   * Whether the component is in a loading state
   */
  isLoading?: boolean

  /**
   * Optional title for the list (no title shown by default)
   */
  title?: string

  /**
   * Custom button text (defaults to "Get X Tickets")
   */
  buttonText?: string

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


// Individual ticket row component
interface TicketRowProps {
  ticket: TicketItem
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

const TicketRow: FC<TicketRowProps> = ({ ticket, quantity, onIncrement, onDecrement }) => {
  const [showModal, setShowModal] = useState(false)
  const isSoldOut = ticket.status === 'sold-out'

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    if (typeof document !== 'undefined') {
      const div = document.createElement('div')
      div.innerHTML = html
      return div.textContent || div.innerText || ''
    }
    return html.replace(/<[^>]*>/g, '')
  }

  const plainDescription = ticket.description ? stripHtml(ticket.description) : ''
  const hasLongDescription = plainDescription.length > 150

  return (
    <>
      <div className={`py-4 ${isSoldOut ? 'opacity-60' : ''}`}>
        {/* First row: name+price left, qty right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-ticketing-text">{ticket.name}</h4>
              {isSoldOut && (
                <span className="rounded-full bg-ticketing-error/20 px-2 py-0.5 text-xs font-medium text-ticketing-error">
                  Sold Out
                </span>
              )}
              {ticket.status === 'limited' && (
                <span className="rounded-full bg-ticketing-warning/20 px-2 py-0.5 text-xs font-medium text-ticketing-warning">
                  Limited
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <DisplayPrice
                price={ticket.price}
                className={`text-sm ${isSoldOut ? 'text-ticketing-text-muted' : 'text-ticketing-primary'}`}
              />
              {ticket.includesFees && (
                <span className="text-xs text-ticketing-text-muted">(incl. fees)</span>
              )}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="shrink-0">
            <QuantitySelector
              value={quantity}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              min={0}
              max={ticket.maxQuantity}
              disabled={isSoldOut}
              size="sm"
            />
          </div>
        </div>

        {/* Second row: description snippet */}
        {ticket.description && (
          <div className="mt-1">
            <p className="text-xs text-ticketing-text-muted line-clamp-2">
              {plainDescription}
            </p>
            {hasLongDescription && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-0.5 text-xs text-ticketing-primary hover:underline"
              >
                View more
              </button>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        header={ticket.name}
      >
        {ticket.description && (
          <div
            className="prose prose-invert max-w-none text-ticketing-text-muted"
            dangerouslySetInnerHTML={{ __html: ticket.description }}
          />
        )}
      </Modal>
    </>
  )
}

// Group section component
interface TicketGroupSectionProps {
  group?: TicketGroup
  tickets: TicketItem[]
  quantities: TicketQuantities
  onIncrement: (ticketId: string) => void
  onDecrement: (ticketId: string) => void
}

const TicketGroupSection: FC<TicketGroupSectionProps> = ({
  group,
  tickets,
  quantities,
  onIncrement,
  onDecrement,
}) => {
  if (tickets.length === 0) return null

  return (
    <div>
      {group && (
        <div className="border-b border-ticketing-border pb-2 mb-2">
          <h3 className="font-semibold text-ticketing-text">{group.name}</h3>
          {group.description && (
            <p className="text-sm text-ticketing-text-muted">{group.description}</p>
          )}
        </div>
      )}
      <div className="divide-y divide-ticketing-border">
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            quantity={quantities[ticket.id] || 0}
            onIncrement={() => onIncrement(ticket.id)}
            onDecrement={() => onDecrement(ticket.id)}
          />
        ))}
      </div>
    </div>
  )
}

const TicketsList: FC<TicketsListProps> = ({
  tickets,
  ticketGroups,
  onGetTickets,
  isLoading = false,
  title,
  buttonText,
  showEmptyState = true,
  emptyMessage = 'No tickets available at this time.',
  className = '',
}) => {
  const [quantities, setQuantities] = useState<TicketQuantities>({})

  const handleIncrement = useCallback((ticketId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: (prev[ticketId] || 0) + 1,
    }))
  }, [])

  const handleDecrement = useCallback((ticketId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max((prev[ticketId] || 0) - 1, 0),
    }))
  }, [])

  const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  const hasAvailableTickets = tickets.some((t) => t.status !== 'sold-out')

  const handleGetTickets = () => {
    onGetTickets?.(quantities)
  }

  // Render grouped or flat list
  const renderTickets = () => {
    if (ticketGroups && ticketGroups.length > 0) {
      const sortedGroups = [...ticketGroups].sort((a, b) => (a.sorting ?? 0) - (b.sorting ?? 0))

      const groupedTickets = sortedGroups.map((group) => ({
        group,
        tickets: tickets.filter((t) => t.groupId === group.id),
      }))

      // Ungrouped tickets
      const ungroupedTickets = tickets.filter(
        (t) => !ticketGroups.some((g) => g.id === t.groupId)
      )

      return (
        <div className="space-y-6">
          {groupedTickets.map(({ group, tickets: groupTickets }) => (
            <TicketGroupSection
              key={group.id}
              group={group}
              tickets={groupTickets}
              quantities={quantities}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          ))}
          {ungroupedTickets.length > 0 && (
            <TicketGroupSection
              tickets={ungroupedTickets}
              quantities={quantities}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          )}
        </div>
      )
    }

    // No groups - render flat list
    return (
      <div className="divide-y divide-ticketing-border">
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            quantity={quantities[ticket.id] || 0}
            onIncrement={() => handleIncrement(ticket.id)}
            onDecrement={() => handleDecrement(ticket.id)}
          />
        ))}
      </div>
    )
  }

  // Empty state
  if (tickets.length === 0) {
    if (!showEmptyState) return null

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

  // Get button text
  const getButtonText = () => {
    if (buttonText) return buttonText
    if (isLoading) return 'Loading...'
    if (!hasAvailableTickets) return 'Sold Out'
    if (totalQuantity === 0) return 'Select Tickets'
    return `Get ${totalQuantity} Ticket${totalQuantity !== 1 ? 's' : ''}`
  }

  return (
    <div className={className}>
      {/* Optional header */}
      {title && (
        <h2 className="text-lg font-bold text-ticketing-text mb-2">{title}</h2>
      )}

      {/* Tickets list */}
      {renderTickets()}

      {/* Optional Get Tickets button */}
      {onGetTickets && (
        <div className="pt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={handleGetTickets}
            disabled={isLoading || !hasAvailableTickets || totalQuantity === 0}
          >
            {getButtonText()}
          </Button>
        </div>
      )}
    </div>
  )
}

export default TicketsList
