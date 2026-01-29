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
      className="w-16 h-16"
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
    <div className={clsx('text-center', className)}>
      <div className="text-ticketing-success mb-4 flex justify-center">
        {icon || defaultIcon}
      </div>
      <h1 className="text-2xl font-bold text-ticketing-text mb-2">{title}</h1>
      <p className="text-ticketing-text-muted mb-4">
        Order #{orderNumber}
      </p>
      {subtitle && (
        <p className="text-sm text-ticketing-text-muted">{subtitle}</p>
      )}
    </div>
  )
}

export default OrderConfirmationHeader
