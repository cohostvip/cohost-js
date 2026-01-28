import { FC } from 'react'
import { clsx } from 'clsx'

export interface DisplayDateProps {
  /**
   * Date to display (Date object or ISO string)
   */
  date: string | Date

  /**
   * Optional end date for date ranges
   */
  endDate?: string | Date

  /**
   * Timezone for display (IANA timezone identifier)
   */
  timezone?: string

  /**
   * Display format
   * - 'full': Full date with time (e.g., "Monday, January 28, 2026, 7:00 PM")
   * - 'short': Short date (e.g., "Jan 28, 2026")
   * - 'time': Time only (e.g., "7:00 PM")
   * - 'relative': Relative time (e.g., "in 2 days")
   * @default 'full'
   */
  format?: 'full' | 'short' | 'time' | 'relative'

  /**
   * Display mode
   * - 'inline': Inline text display
   * - 'block': Block display with calendar icon
   * @default 'inline'
   */
  mode?: 'inline' | 'block'

  /**
   * Show time in addition to date (ignored if format is 'time' or 'relative')
   * @default true
   */
  showTime?: boolean

  /**
   * Custom class name
   */
  className?: string
}

const DisplayDate: FC<DisplayDateProps> = ({
  date,
  endDate,
  timezone,
  format = 'full',
  mode = 'inline',
  showTime = true,
  className,
}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const endDateObj = endDate
    ? typeof endDate === 'string'
      ? new Date(endDate)
      : endDate
    : undefined

  // Helper to format relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 0) return `in ${diffDays} days`
    return `${Math.abs(diffDays)} days ago`
  }

  // Helper to get formatted date based on format type
  const getFormattedDate = (): string => {
    const timeZoneOption = timezone ? { timeZone: timezone } : {}

    if (format === 'relative') {
      return getRelativeTime(dateObj)
    }

    if (format === 'time') {
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        ...timeZoneOption,
      })
      return timeFormatter.format(dateObj)
    }

    if (format === 'short') {
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...timeZoneOption,
      })
      return dateFormatter.format(dateObj)
    }

    // Full format
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(showTime && {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      ...timeZoneOption,
    }

    return new Intl.DateTimeFormat('en-US', dateTimeOptions).format(dateObj)
  }

  // Helper to get time range if endDate is provided
  const getTimeRange = (): string | null => {
    if (!endDateObj) return null

    const timeZoneOption = timezone ? { timeZone: timezone } : {}
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...timeZoneOption,
    })

    const startTime = timeFormatter.format(dateObj)
    const endTime = timeFormatter.format(endDateObj)

    return `${startTime} - ${endTime}`
  }

  // Inline mode - simple text display
  if (mode === 'inline') {
    return <span className={className}>{getFormattedDate()}</span>
  }

  // Block mode - with calendar icon
  const iconDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: timezone || undefined,
  })

  const iconParts = iconDateFormatter.formatToParts(dateObj)
  const month = iconParts.find((part) => part.type === 'month')?.value || ''
  const day = iconParts.find((part) => part.type === 'day')?.value || ''
  const timeRange = getTimeRange()

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone || undefined,
  })

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone || undefined,
  })

  const formattedDate = dateFormatter.format(dateObj)
  const startTime = timeFormatter.format(dateObj)

  return (
    <div className={clsx('flex items-center gap-4', className)}>
      {/* Calendar Icon */}
      <div className="flex-shrink-0 w-16 h-16 bg-ticketing-surface border-2 border-ticketing-border rounded-lg overflow-hidden">
        <div className="bg-ticketing-primary text-white text-xs font-semibold text-center py-1">
          {month}
        </div>
        <div className="text-ticketing-text text-2xl font-bold text-center py-1">
          {day}
        </div>
      </div>

      {/* Date & Time Info */}
      <div className="text-sm flex flex-col gap-1">
        <div className="text-ticketing-text font-medium">{formattedDate}</div>
        {showTime && (
          <div className="text-ticketing-text-muted">
            {timeRange || startTime}
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayDate
