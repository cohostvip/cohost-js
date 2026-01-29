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
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-ticketing-border rounded-full" />
      <div className={clsx('h-4 bg-ticketing-border rounded', width)} />
    </div>
  )

  return (
    <div
      className={clsx(
        'bg-ticketing-surface border border-ticketing-border rounded-lg overflow-hidden',
        className
      )}
    >
      <div className="p-4 border-b border-ticketing-border">
        <h3 className="font-semibold text-ticketing-text">Customer</h3>
      </div>
      <div className="p-4">
        {redacted ? (
          <div className="space-y-3">
            <RedactedRow iconPath="" width="w-28" />
            <RedactedRow iconPath="" width="w-40" />
            <RedactedRow iconPath="" width="w-32" />
          </div>
        ) : (
          <div className="space-y-3">
            {name && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-ticketing-background rounded-full flex items-center justify-center flex-shrink-0 border border-ticketing-border">
                  <svg
                    className="w-4 h-4 text-ticketing-text-muted"
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
                <span className="text-ticketing-text">{name}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-ticketing-background rounded-full flex items-center justify-center flex-shrink-0 border border-ticketing-border">
                  <svg
                    className="w-4 h-4 text-ticketing-text-muted"
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
                <span className="text-ticketing-text">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-ticketing-background rounded-full flex items-center justify-center flex-shrink-0 border border-ticketing-border">
                  <svg
                    className="w-4 h-4 text-ticketing-text-muted"
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
                <span className="text-ticketing-text">{phone}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerSummary
