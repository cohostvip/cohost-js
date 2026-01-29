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
        'bg-ticketing-surface border border-ticketing-border rounded-lg overflow-hidden',
        className
      )}
    >
      <div className="p-4 border-b border-ticketing-border">
        <h3 className="font-semibold text-ticketing-text">Payment</h3>
      </div>
      <div className="p-4">
        {redacted ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-ticketing-border rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-ticketing-border rounded" />
              <div className="h-3 w-24 bg-ticketing-border rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-ticketing-background rounded flex items-center justify-center border border-ticketing-border">
              <svg
                className="w-6 h-4 text-ticketing-text-muted"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </div>
            <span className="text-ticketing-text">
              {paymentMethod || 'Payment method on file'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentSummary
