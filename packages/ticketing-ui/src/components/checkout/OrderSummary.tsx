import { FC } from 'react'
import DisplayPrice from '../ui/DisplayPrice'
import Button from '../ui/Button'

export interface OrderSummaryItem {
  id: string
  name: string
  quantity: number
  totalPrice: string
}

export interface OrderSummaryCosts {
  subtotal?: string
  discount?: string
  fee?: string
  tax?: string
  total?: string
}

export interface OrderSummaryProps {
  /**
   * Items in the order
   */
  items: OrderSummaryItem[]

  /**
   * Cost breakdown
   */
  costs: OrderSummaryCosts

  /**
   * Applied coupon codes
   */
  coupons?: string[]

  /**
   * Show promo code input
   * @default false
   */
  showPromoInput?: boolean

  /**
   * Callback when promo code is applied
   */
  onApplyPromo?: (code: string) => Promise<void>

  /**
   * Show continue button
   * @default false
   */
  showContinueButton?: boolean

  /**
   * Callback when continue is clicked
   */
  onContinue?: () => void

  /**
   * Disable continue button
   * @default false
   */
  continueDisabled?: boolean

  /**
   * Continue button text
   * @default "Continue"
   */
  continueLabel?: string

  /**
   * Additional class names
   */
  className?: string
}

/**
 * OrderSummary - Display order summary with line items, discounts, fees, and total
 *
 * @example
 * ```tsx
 * <OrderSummary
 *   items={[
 *     { id: '1', name: 'General Admission', quantity: 2, totalPrice: 'USD,5000' }
 *   ]}
 *   costs={{
 *     subtotal: 'USD,5000',
 *     fee: 'USD,100',
 *     tax: 'USD,510',
 *     total: 'USD,5610'
 *   }}
 *   showContinueButton
 *   onContinue={() => nextStep()}
 * />
 * ```
 */
const OrderSummary: FC<OrderSummaryProps> = ({
  items,
  costs,
  coupons = [],
  showPromoInput = false,
  onApplyPromo,
  showContinueButton = false,
  onContinue,
  continueDisabled = false,
  continueLabel = 'Continue',
  className = '',
}) => {
  // Helper function to check if a price is free (0)
  const isFree = (price?: string) => {
    if (!price) return true
    const [, amount] = price.split(',')
    return Number(amount) === 0
  }

  const isOrderFree = isFree(costs.subtotal) && isFree(costs.total)

  // Check if cart is empty
  const activeItems = items.filter((item) => item.quantity > 0)
  const isCartEmpty = activeItems.length === 0

  if (isCartEmpty) {
    return (
      <div
        className={`bg-ticketing-surface rounded-lg shadow-sm border border-ticketing-border ${className}`}
      >
        <div className="p-6 text-center">
          <svg
            className="w-12 h-12 text-ticketing-text-muted mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-ticketing-text-muted">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-ticketing-surface rounded-lg shadow-sm border border-ticketing-border ${className}`}
    >
      <div className="p-6 border-b border-ticketing-border">
        <h3 className="text-lg font-semibold text-ticketing-text">
          Order Summary
        </h3>
      </div>

      <div className="p-6">
        {/* Selected Tickets */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-ticketing-text-muted mb-3">
            Selected Tickets
          </h4>
          <div className="space-y-3">
            {activeItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span className="text-ticketing-text">{item.name}</span>
                  <span className="text-ticketing-text-muted ml-2">
                    x {item.quantity}
                  </span>
                </div>
                <DisplayPrice
                  price={item.totalPrice}
                  className="text-ticketing-text"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown - Only show if order has costs */}
        {!isOrderFree && (
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-ticketing-text-muted">Subtotal</span>
              <DisplayPrice
                price={costs.subtotal}
                className="text-ticketing-text"
              />
            </div>
            {coupons.length > 0 && costs.discount && (
              <div className="flex justify-between text-sm">
                <span className="text-ticketing-success">Discount</span>
                <DisplayPrice
                  price={costs.discount}
                  className="text-ticketing-success"
                  leftDecorator="-"
                />
              </div>
            )}
            {costs.fee && !isFree(costs.fee) && (
              <div className="flex justify-between text-sm">
                <span className="text-ticketing-text-muted">Fees</span>
                <DisplayPrice
                  price={costs.fee}
                  className="text-ticketing-text"
                />
              </div>
            )}
            {costs.tax && !isFree(costs.tax) && (
              <div className="flex justify-between text-sm">
                <span className="text-ticketing-text-muted">Tax</span>
                <DisplayPrice
                  price={costs.tax}
                  className="text-ticketing-text"
                />
              </div>
            )}
            <div className="border-t border-ticketing-border pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-ticketing-text">
                  Total
                </span>
                <DisplayPrice
                  price={costs.total}
                  className="text-lg font-semibold text-ticketing-text"
                />
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {showContinueButton && onContinue && (
          <Button
            onClick={onContinue}
            disabled={continueDisabled}
            fullWidth
            size="lg"
          >
            {continueLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default OrderSummary
