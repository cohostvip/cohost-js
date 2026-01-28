import { FC } from 'react'

export interface EventCardProps {
  /**
   * Event name/title
   */
  name: string

  /**
   * Event start date (ISO 8601 string)
   */
  startDate: string

  /**
   * Optional event summary/description
   */
  summary?: string

  /**
   * Optional event image URL
   */
  imageUrl?: string

  /**
   * Optional image alt text
   */
  imageAlt?: string

  /**
   * Optional venue/location name
   */
  venueName?: string

  /**
   * Optional venue address
   */
  venueAddress?: string

  /**
   * Optional timezone for date formatting
   */
  timezone?: string

  /**
   * Whether the event is sold out
   */
  soldOut?: boolean

  /**
   * Optional click handler - makes card clickable
   */
  onClick?: () => void

  /**
   * Optional href - renders as link wrapper
   */
  href?: string

  /**
   * Custom link component (for Next.js Link, etc.)
   */
  LinkComponent?: FC<{ href: string; className?: string; children: React.ReactNode }>

  /**
   * Additional CSS classes
   */
  className?: string
}

function formatEventDate(dateString: string, timezone?: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  })
}

function formatEventTime(dateString: string, timezone?: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  })
}

const EventCard: FC<EventCardProps> = ({
  name,
  startDate,
  summary,
  imageUrl,
  imageAlt,
  venueName,
  venueAddress,
  timezone,
  soldOut,
  onClick,
  href,
  LinkComponent,
  className = '',
}) => {
  const cardClasses = `
    group block overflow-hidden rounded-ticketing-lg border border-ticketing-border
    bg-ticketing-surface transition-all
    ${onClick || href ? 'cursor-pointer hover:border-ticketing-primary hover:shadow-lg' : ''}
    ${soldOut ? 'opacity-60' : ''}
    ${className}
  `.trim()

  const content = (
    <>
      {/* Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden bg-ticketing-surface-hover">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || name}
            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-12 w-12 text-ticketing-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-ticketing-md bg-ticketing-error px-4 py-2 text-sm font-semibold text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Date */}
        <p className="text-sm font-medium text-ticketing-primary">
          {formatEventDate(startDate, timezone)} at {formatEventTime(startDate, timezone)}
        </p>

        {/* Event Name */}
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-ticketing-text group-hover:text-ticketing-primary transition-colors">
          {name}
        </h3>

        {/* Venue */}
        {venueName && (
          <p className="mt-1 flex items-center gap-1 text-sm text-ticketing-text-muted">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">
              {venueName}
              {venueAddress && `, ${venueAddress}`}
            </span>
          </p>
        )}

        {/* Summary */}
        {summary && (
          <p className="mt-2 line-clamp-2 text-sm text-ticketing-text-muted">
            {summary}
          </p>
        )}
      </div>
    </>
  )

  // If href and LinkComponent provided, wrap in custom Link
  if (href && LinkComponent) {
    return (
      <LinkComponent href={href} className={cardClasses}>
        {content}
      </LinkComponent>
    )
  }

  // If href but no LinkComponent, use regular anchor
  if (href) {
    return (
      <a href={href} className={cardClasses}>
        {content}
      </a>
    )
  }

  // If onClick, use div with click handler
  if (onClick) {
    return (
      <div
        className={cardClasses}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
        role="button"
        tabIndex={0}
      >
        {content}
      </div>
    )
  }

  // Default: non-interactive card
  return (
    <div className={cardClasses}>
      {content}
    </div>
  )
}

export default EventCard
