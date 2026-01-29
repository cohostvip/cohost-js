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
    <div className="flex justify-between text-sm">
      <span className="text-ticketing-text-muted">{label}</span>
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
        <h3 className="font-semibold text-ticketing-text">Order Summary</h3>
      </div>
      <div className="p-4 space-y-3">
        {redacted ? (
          <>
            <RedactedLine label="Subtotal" width="w-20" />
            <RedactedLine label="Fees" width="w-12" />
            <RedactedLine label="Tax" width="w-14" />
            <div className="flex justify-between pt-3 border-t border-ticketing-border">
              <span className="font-semibold text-ticketing-text">Total</span>
              <div className="h-5 w-24 bg-ticketing-border rounded" />
            </div>
          </>
        ) : (
          <>
            {subtotal && !isFree(subtotal) && (
              <div className="flex justify-between text-sm">
                <span className="text-ticketing-text-muted">Subtotal</span>
                <DisplayPrice price={subtotal} className="text-ticketing-text" />
              </div>
            )}

            {discount && !isFree(discount) && (
              <div className="flex justify-between text-sm">
                <span className="text-ticketing-success">Discount</span>
                <DisplayPrice
                  price={discount}
                  className="text-ticketing-success"
                  leftDecorator="-"
                />
              </div>
            )}

            {fees && !isFree(fees) && (
              <div className="flex justify-between text-sm">
                <span className="text-ticketing-text-muted">Fees</span>
                <DisplayPrice price={fees} className="text-ticketing-text" />
              </div>
            )}

            {tax && !isFree(tax) && (
              <div className="flex justify-between text-sm">
                <span className="text-ticketing-text-muted">Tax</span>
                <DisplayPrice price={tax} className="text-ticketing-text" />
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-ticketing-border">
              <span className="font-semibold text-ticketing-text">Total</span>
              <DisplayPrice
                price={total}
                className="font-semibold text-ticketing-text"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderTotalsSummary
