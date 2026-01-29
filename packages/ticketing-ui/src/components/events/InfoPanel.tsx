import { FC, ReactNode } from 'react'
import { clsx } from 'clsx'

export interface InfoPanelProps {
  /**
   * Icon to display on the left
   */
  icon: ReactNode

  /**
   * Primary text/content
   */
  children: ReactNode

  /**
   * Secondary/subtitle text
   */
  subtitle?: ReactNode

  /**
   * Additional class name
   */
  className?: string
}

/**
 * InfoPanel - Display information with an icon on the left
 *
 * @example
 * ```tsx
 * <InfoPanel
 *   icon={<CalendarIcon />}
 *   subtitle="Thursday"
 * >
 *   March 15, 2026 at 7:00 PM
 * </InfoPanel>
 *
 * <InfoPanel
 *   icon={<MapPinIcon />}
 *   subtitle="123 Main Street, New York, NY"
 * >
 *   Madison Square Garden
 * </InfoPanel>
 * ```
 */
const InfoPanel: FC<InfoPanelProps> = ({
  icon,
  children,
  subtitle,
  className,
}) => {
  return (
    <div className={clsx('ticketing-info-panel', className)}>
      <div className="ticketing-info-panel__icon">
        {icon}
      </div>
      <div className="ticketing-info-panel__content">
        <div className="ticketing-info-panel__text">{children}</div>
        {subtitle && (
          <div className="ticketing-info-panel__subtitle">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoPanel

// Common icons for convenience
export const CalendarIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

export const ClockIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export const MapPinIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
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
)
