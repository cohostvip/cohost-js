import { FC } from 'react'
import { clsx } from 'clsx'
import DisplayPrice from '../ui/DisplayPrice'

export interface OrderTotalsSummaryProps {
  /**
   * Subtotal amount
   */
  subtotal?: string

  /**
   * Discount amount
   */
  discount?: string

  /**
   * Fees amount
   */
  fees?: string

  /**
   * Tax amount
   */
  tax?: string

  /**
   * Total amount
   */
  total: string

  /**
   * Whether to show redacted/hidden info (grey boxes)
   * @default false
   */
  redacted?: boolean

  /**
   * Additional class name
   */
  className?: string
}

/**
 * OrderTotalsSummary - Order totals only (no tickets breakdown)
 *
 * @example
 * ```tsx
 * <OrderTotalsSummary
 *   subtotal="USD,12500"
 *   fees="USD,250"
 *   tax="USD,1275"
 *   total="USD,14025"
 * />
 *
 * // Redacted
 * <OrderTotalsSummary total="USD,14025" redacted />
 * ```
 */
const OrderTotalsSummary: FC<OrderTotalsSummaryProps> = ({
  subtotal,
  discount,
  fees,
  tax,
  total,
  redacted = false,
  className,
}) => {
  const isFree = (price?: string) => {
    if (!price) return true
    const [, amount] = price.split(',')
    return Number(amount) === 0
  }

  const RedactedLine: FC<{ label: string; width?: string }> = ({
    label,
    width = 'w-16',
  }) => (
    <div className="ticketing-order-totals-summary__line">
      <span className="ticketing-order-totals-summary__line-label">{label}</span>
      <div className={clsx('ticketing-order-totals-summary__redacted-bar', width)} />
    </div>
  )

  return (
    <div
      className={clsx(
        'ticketing-order-totals-summary',
        className
      )}
    >
      <div className="ticketing-order-totals-summary__header">
        <h3 className="ticketing-order-totals-summary__header-title">Order Summary</h3>
      </div>
      <div className="ticketing-order-totals-summary__content">
        {redacted ? (
          <>
            <RedactedLine label="Subtotal" width="w-20" />
            <RedactedLine label="Fees" width="w-12" />
            <RedactedLine label="Tax" width="w-14" />
            <div className="ticketing-order-totals-summary__total">
              <span className="ticketing-order-totals-summary__total-label">Total</span>
              <div className="ticketing-order-totals-summary__redacted-bar ticketing-order-totals-summary__redacted-bar--large" />
            </div>
          </>
        ) : (
          <>
            {subtotal && !isFree(subtotal) && (
              <div className="ticketing-order-totals-summary__line">
                <span className="ticketing-order-totals-summary__line-label">Subtotal</span>
                <DisplayPrice price={subtotal} className="ticketing-order-totals-summary__line-value" />
              </div>
            )}

            {discount && !isFree(discount) && (
              <div className={clsx('ticketing-order-totals-summary__line', 'ticketing-order-totals-summary__line--discount')}>
                <span className="ticketing-order-totals-summary__line-label">Discount</span>
                <DisplayPrice
                  price={discount}
                  className="ticketing-order-totals-summary__line-value"
                  leftDecorator="-"
                />
              </div>
            )}

            {fees && !isFree(fees) && (
              <div className="ticketing-order-totals-summary__line">
                <span className="ticketing-order-totals-summary__line-label">Fees</span>
                <DisplayPrice price={fees} className="ticketing-order-totals-summary__line-value" />
              </div>
            )}

            {tax && !isFree(tax) && (
              <div className="ticketing-order-totals-summary__line">
                <span className="ticketing-order-totals-summary__line-label">Tax</span>
                <DisplayPrice price={tax} className="ticketing-order-totals-summary__line-value" />
              </div>
            )}

            <div className="ticketing-order-totals-summary__total">
              <span className="ticketing-order-totals-summary__total-label">Total</span>
              <DisplayPrice
                price={total}
                className="ticketing-order-totals-summary__total-value"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderTotalsSummary
