import { FC } from 'react'
import { clsx } from 'clsx'
import DisplayPrice from '../ui/DisplayPrice'

export interface PaymentSummaryProps {
  /**
   * Payment method (e.g., "Visa ending in 4242")
   */
  paymentMethod?: string

  /**
   * Card brand icon (visa, mastercard, amex, etc.)
   */
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic'

  /**
   * Whether to show redacted/hidden payment info (grey boxes)
   * @default false
   */
  redacted?: boolean

  /**
   * Additional class name
   */
  className?: string
}

/**
 * PaymentSummary - Payment method display for order confirmation
 *
 * @example
 * ```tsx
 * <PaymentSummary
 *   paymentMethod="Visa ending in 4242"
 *   cardBrand="visa"
 * />
 *
 * // Redacted variant (grey boxes)
 * <PaymentSummary redacted />
 * ```
 */
const PaymentSummary: FC<PaymentSummaryProps> = ({
  paymentMethod,
  cardBrand = 'generic',
  redacted = false,
  className,
}) => {
  return (
    <div
      className={clsx(
        'ticketing-payment-summary',
        className
      )}
    >
      <div className="ticketing-payment-summary__header">
        <h3 className="ticketing-payment-summary__header-title">Payment</h3>
      </div>
      <div className="ticketing-payment-summary__content">
        {redacted ? (
          <div className="ticketing-payment-summary__payment-row">
            <div className="ticketing-payment-summary__redacted-card" />
            <div className="ticketing-payment-summary__payment-info">
              <div className="ticketing-payment-summary__redacted-bar ticketing-payment-summary__redacted-bar--primary" />
              <div className="ticketing-payment-summary__redacted-bar ticketing-payment-summary__redacted-bar--secondary" />
            </div>
          </div>
        ) : (
          <div className="ticketing-payment-summary__payment-row">
            <div className="ticketing-payment-summary__card-icon">
              <svg
                className="ticketing-payment-summary__card-icon-svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </div>
            <span className="ticketing-payment-summary__payment-method">
              {paymentMethod || 'Payment method on file'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentSummary
