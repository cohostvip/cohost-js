import { FC, ReactNode } from 'react'
import { clsx } from 'clsx'

export interface OrderConfirmationHeaderProps {
  /**
   * Order number/ID to display
   */
  orderNumber: string

  /**
   * Main title
   * @default "Thank you for your order!"
   */
  title?: string

  /**
   * Subtitle/description
   */
  subtitle?: string

  /**
   * Custom icon (defaults to checkmark)
   */
  icon?: ReactNode

  /**
   * Additional class name
   */
  className?: string
}

/**
 * OrderConfirmationHeader - Header with order number and thank you message
 *
 * @example
 * ```tsx
 * <OrderConfirmationHeader
 *   orderNumber="ORD-12345"
 *   subtitle="A confirmation email has been sent to your inbox."
 * />
 * ```
 */
const OrderConfirmationHeader: FC<OrderConfirmationHeaderProps> = ({
  orderNumber,
  title = 'Thank you for your order!',
  subtitle,
  icon,
  className,
}) => {
  const defaultIcon = (
    <svg
      className="ticketing-order-confirmation-header__icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )

  return (
    <div className={clsx('ticketing-order-confirmation-header', className)}>
      <div className="ticketing-order-confirmation-header__icon-wrapper">
        {icon || defaultIcon}
      </div>
      <h1 className="ticketing-order-confirmation-header__title">{title}</h1>
      <p className="ticketing-order-confirmation-header__order-number">
        Order #{orderNumber}
      </p>
      {subtitle && (
        <p className="ticketing-order-confirmation-header__subtitle">{subtitle}</p>
      )}
    </div>
  )
}

export default OrderConfirmationHeader
