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
        'bg-ticketing-surface border border-ticketing-border rounded-lg overflow-hidden',
        className
      )}
    >
      <div className="p-4 border-b border-ticketing-border">
        <h3 className="font-semibold text-ticketing-text">Event</h3>
      </div>
      <div className="p-4 flex gap-4">
        {imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-ticketing-text truncate">{name}</h4>
          <p className="text-sm text-ticketing-text-muted mt-1">
            {date}
            {time && ` at ${time}`}
          </p>
          {venue && (
            <p className="text-sm text-ticketing-text-muted mt-1">{venue}</p>
          )}
          {address && (
            <p className="text-xs text-ticketing-text-muted">{address}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventSummary
