import { FC, ReactNode } from 'react'
import { clsx } from 'clsx'

export interface ConfirmationLayoutProps {
  /**
   * Header content (OrderConfirmationHeader)
   */
  header?: ReactNode

  /**
   * Left column content (tickets, customer, payment)
   */
  leftColumn: ReactNode

  /**
   * Right column content (event, summary)
   */
  rightColumn: ReactNode

  /**
   * Additional class name
   */
  className?: string
}

/**
 * ConfirmationLayout - Two-column layout for order confirmation page
 *
 * On mobile: stacks vertically (right column first, then left)
 * On desktop: two columns (left and right side by side)
 *
 * @example
 * ```tsx
 * <ConfirmationLayout
 *   header={<OrderConfirmationHeader orderNumber="ORD-123" />}
 *   leftColumn={
 *     <>
 *       <TicketsSummary tickets={...} />
 *       <CustomerSummary name="John" email="john@example.com" />
 *       <PaymentSummary paymentMethod="Visa ending in 4242" />
 *     </>
 *   }
 *   rightColumn={
 *     <>
 *       <EventSummary name="Concert" date="March 15" />
 *       <OrderTotalsSummary total="USD,14025" />
 *     </>
 *   }
 * />
 * ```
 */
const ConfirmationLayout: FC<ConfirmationLayoutProps> = ({
  header,
  leftColumn,
  rightColumn,
  className,
}) => {
  return (
    <div className={clsx('max-w-5xl mx-auto', className)}>
      {header && <div className="mb-8">{header}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Right column - Event & Summary (shows first on mobile) */}
        <div className="lg:order-2 space-y-6">{rightColumn}</div>

        {/* Left column - Tickets, Customer, Payment */}
        <div className="lg:order-1 space-y-6">{leftColumn}</div>
      </div>
    </div>
  )
}

export default ConfirmationLayout
