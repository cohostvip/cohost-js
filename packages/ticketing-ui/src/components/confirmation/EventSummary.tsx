import { FC } from 'react'
import { clsx } from 'clsx'

export interface EventSummaryProps {
  /**
   * Event name
   */
  name: string

  /**
   * Event date (formatted string)
   */
  date: string

  /**
   * Event time (formatted string)
   */
  time?: string

  /**
   * Venue name
   */
  venue?: string

  /**
   * Venue address
   */
  address?: string

  /**
   * Event image URL
   */
  imageUrl?: string

  /**
   * Additional class name
   */
  className?: string
}

/**
 * EventSummary - Event information for order confirmation
 *
 * @example
 * ```tsx
 * <EventSummary
 *   name="Summer Music Festival"
 *   date="Saturday, March 15, 2026"
 *   time="7:00 PM"
 *   venue="Madison Square Garden"
 *   address="New York, NY"
 * />
 * ```
 */
const EventSummary: FC<EventSummaryProps> = ({
  name,
  date,
  time,
  venue,
  address,
  imageUrl,
  className,
}) => {
  return (
    <div
      className={clsx(
        'ticketing-event-summary',
        className
      )}
    >
      <div className="ticketing-event-summary__header">
        <h3 className="ticketing-event-summary__header-title">Event</h3>
      </div>
      <div className="ticketing-event-summary__content">
        {imageUrl && (
          <div className="ticketing-event-summary__image">
            <img
              src={imageUrl}
              alt={name}
              className="ticketing-event-summary__image-img"
            />
          </div>
        )}
        <div className="ticketing-event-summary__details">
          <h4 className="ticketing-event-summary__event-name">{name}</h4>
          <p className="ticketing-event-summary__date">
            {date}
            {time && ` at ${time}`}
          </p>
          {venue && (
            <p className="ticketing-event-summary__venue">{venue}</p>
          )}
          {address && (
            <p className="ticketing-event-summary__address">{address}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventSummary
