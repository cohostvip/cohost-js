import { FC } from 'react'
import { clsx } from 'clsx'

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
  const cardClasses = clsx(
    'ticketing-event-card',
    soldOut && 'ticketing-event-card--sold-out',
    className
  )

  const content = (
    <>
      {/* Image Section */}
      <div className="ticketing-event-card__image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || name}
            className="ticketing-event-card__image"
          />
        ) : (
          <div className="ticketing-event-card__image-placeholder">
            <svg
              className="ticketing-event-card__placeholder-icon"
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
          <div className="ticketing-event-card__sold-out-overlay">
            <span className="ticketing-event-card__sold-out-badge">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="ticketing-event-card__content">
        {/* Date */}
        <p className="ticketing-event-card__date">
          {formatEventDate(startDate, timezone)} at {formatEventTime(startDate, timezone)}
        </p>

        {/* Event Name */}
        <h3 className="ticketing-event-card__title">
          {name}
        </h3>

        {/* Venue */}
        {venueName && (
          <p className="ticketing-event-card__venue">
            <svg
              className="ticketing-event-card__venue-icon"
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
            <span className="ticketing-event-card__venue-text">
              {venueName}
              {venueAddress && `, ${venueAddress}`}
            </span>
          </p>
        )}

        {/* Summary */}
        {summary && (
          <p className="ticketing-event-card__summary">
            {summary}
          </p>
        )}
      </div>
    </>
  )

  // If href and LinkComponent provided, wrap in custom Link
  if (href && LinkComponent) {
    return (
      <LinkComponent href={href} className={clsx(cardClasses, (onClick || href) && 'group')}>
        {content}
      </LinkComponent>
    )
  }

  // If href but no LinkComponent, use regular anchor
  if (href) {
    return (
      <a href={href} className={clsx(cardClasses, 'group')}>
        {content}
      </a>
    )
  }

  // If onClick, use div with click handler
  if (onClick) {
    return (
      <div
        className={clsx(cardClasses, 'group')}
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
