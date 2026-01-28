import { FC, useState } from 'react'

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

  const cardClasses = `
    rounded-ticketing-lg border bg-ticketing-surface p-4 transition-all
    ${isSoldOut ? 'border-ticketing-border opacity-60' : 'border-ticketing-border'}
    ${isClickable ? 'cursor-pointer hover:border-ticketing-primary hover:shadow-md' : ''}
    ${className}
  `.trim()

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
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-ticketing-text">{name}</h4>
            {isSoldOut && (
              <span className="rounded-full bg-ticketing-error/20 px-2 py-0.5 text-xs font-medium text-ticketing-error">
                Sold Out
              </span>
            )}
            {isLimited && quantityAvailable !== undefined && quantityAvailable > 0 && (
              <span className="rounded-full bg-ticketing-warning/20 px-2 py-0.5 text-xs font-medium text-ticketing-warning">
                Only {quantityAvailable} left
              </span>
            )}
          </div>
          <p
            className={`mt-1 text-lg font-semibold ${
              isSoldOut ? 'text-ticketing-text-muted' : 'text-ticketing-accent'
            }`}
          >
            {formatPrice(price, currency)}
            {includesFees && price > 0 && (
              <span className="ml-1 text-sm font-normal text-ticketing-text-muted">
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
            className="text-sm text-ticketing-accent hover:underline"
            type="button"
          >
            {showDetails ? 'Hide details' : 'View details'}
          </button>
        )}
      </div>

      {showDetails && description && (
        <div
          className="mt-3 border-t border-ticketing-border pt-3 text-sm text-ticketing-text-muted prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  )
}

export default TicketCard
