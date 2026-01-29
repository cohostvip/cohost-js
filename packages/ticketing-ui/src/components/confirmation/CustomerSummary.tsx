import { FC } from 'react'
import { clsx } from 'clsx'

export interface CustomerSummaryProps {
  /**
   * Customer name
   */
  name?: string

  /**
   * Customer email
   */
  email?: string

  /**
   * Customer phone
   */
  phone?: string

  /**
   * Whether to show redacted/hidden customer info (grey boxes)
   * @default false
   */
  redacted?: boolean

  /**
   * Additional class name
   */
  className?: string
}

/**
 * CustomerSummary - Customer information for order confirmation
 *
 * @example
 * ```tsx
 * <CustomerSummary
 *   name="John Smith"
 *   email="john@example.com"
 *   phone="+1 (555) 123-4567"
 * />
 *
 * // Redacted variant (grey boxes)
 * <CustomerSummary redacted />
 * ```
 */
const CustomerSummary: FC<CustomerSummaryProps> = ({
  name,
  email,
  phone,
  redacted = false,
  className,
}) => {
  const hasInfo = name || email || phone

  if (!hasInfo && !redacted) return null

  const RedactedRow: FC<{ iconPath: string; width?: string }> = ({
    iconPath,
    width = 'w-32',
  }) => (
    <div className="ticketing-customer-summary__info-row">
      <div className="ticketing-customer-summary__redacted-icon" />
      <div className={clsx('ticketing-customer-summary__redacted-bar', width)} />
    </div>
  )

  return (
    <div
      className={clsx(
        'ticketing-customer-summary',
        className
      )}
    >
      <div className="ticketing-customer-summary__header">
        <h3 className="ticketing-customer-summary__header-title">Customer</h3>
      </div>
      <div className="ticketing-customer-summary__content">
        {redacted ? (
          <div className="ticketing-customer-summary__info-list">
            <RedactedRow iconPath="" width="w-28" />
            <RedactedRow iconPath="" width="w-40" />
            <RedactedRow iconPath="" width="w-32" />
          </div>
        ) : (
          <div className="ticketing-customer-summary__info-list">
            {name && (
              <div className="ticketing-customer-summary__info-row">
                <div className="ticketing-customer-summary__info-icon">
                  <svg
                    className="ticketing-customer-summary__info-icon-svg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="ticketing-customer-summary__info-text">{name}</span>
              </div>
            )}
            {email && (
              <div className="ticketing-customer-summary__info-row">
                <div className="ticketing-customer-summary__info-icon">
                  <svg
                    className="ticketing-customer-summary__info-icon-svg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="ticketing-customer-summary__info-text">{email}</span>
              </div>
            )}
            {phone && (
              <div className="ticketing-customer-summary__info-row">
                <div className="ticketing-customer-summary__info-icon">
                  <svg
                    className="ticketing-customer-summary__info-icon-svg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="ticketing-customer-summary__info-text">{phone}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerSummary
