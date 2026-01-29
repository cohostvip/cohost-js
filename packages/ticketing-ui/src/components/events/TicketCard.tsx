import { FC, useState } from 'react'
import { clsx } from 'clsx'

export interface TicketCardProps {
  /**
   * Ticket name/title
   */
  name: string

  /**
   * Ticket price in cents (e.g., 2500 for $25.00)
   * Set to 0 for free tickets
   */
  price: number

  /**
   * Currency code (default: 'USD')
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
   * Optional quantity available (for "limited" status)
   */
  quantityAvailable?: number

  /**
   * Whether fees are included in the price
   */
  includesFees?: boolean

  /**
   * Optional click handler for selection
   */
  onSelect?: () => void

  /**
   * Additional CSS classes
   */
  className?: string
}

function formatPrice(cents: number, currency: string = 'USD'): string {
  if (cents === 0) {
    return 'Free'
  }

  const dollars = cents / 100
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(dollars)
}

const TicketCard: FC<TicketCardProps> = ({
  name,
  price,
  currency = 'USD',
  description,
  status = 'available',
  quantityAvailable,
  includesFees = false,
  onSelect,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false)

  const isSoldOut = status === 'sold-out'
  const isLimited = status === 'limited'
  const isClickable = onSelect && !isSoldOut

  const cardClasses = clsx(
    'ticketing-ticket-card',
    isSoldOut && 'ticketing-ticket-card--sold-out',
    isClickable && 'ticketing-ticket-card--clickable',
    className
  )

  return (
    <div
      className={cardClasses}
      onClick={isClickable ? onSelect : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.()
              }
            }
          : undefined
      }
    >
      <div className="ticketing-ticket-card__header">
        <div className="ticketing-ticket-card__left-section">
          <div className="ticketing-ticket-card__title-group">
            <h4 className="ticketing-ticket-card__title">{name}</h4>
            {isSoldOut && (
              <span className="ticketing-ticket-card__badge ticketing-ticket-card__badge--sold-out">
                Sold Out
              </span>
            )}
            {isLimited && quantityAvailable !== undefined && quantityAvailable > 0 && (
              <span className="ticketing-ticket-card__badge ticketing-ticket-card__badge--limited">
                Only {quantityAvailable} left
              </span>
            )}
          </div>
          <p
            className={clsx(
              'ticketing-ticket-card__price',
              isSoldOut ? 'ticketing-ticket-card__price--sold-out' : 'ticketing-ticket-card__price--available'
            )}
          >
            {formatPrice(price, currency)}
            {includesFees && price > 0 && (
              <span className="ticketing-ticket-card__price-note">
                (incl. fees)
              </span>
            )}
          </p>
        </div>

        {description && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(!showDetails)
            }}
            className="ticketing-ticket-card__details-button"
            type="button"
          >
            {showDetails ? 'Hide details' : 'View details'}
          </button>
        )}
      </div>

      {showDetails && description && (
        <div
          className="ticketing-ticket-card__description prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  )
}

export default TicketCard
