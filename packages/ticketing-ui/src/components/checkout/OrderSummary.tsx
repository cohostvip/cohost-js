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
      <div className={`ticketing-order-summary ${className}`}>
        <div className="ticketing-order-summary__empty">
          <svg
            className="ticketing-order-summary__empty-icon"
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
          <p className="ticketing-order-summary__empty-message">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`ticketing-order-summary ${className}`}>
      <div className="ticketing-order-summary__header">
        <h3 className="ticketing-order-summary__title">
          Order Summary
        </h3>
      </div>

      <div className="ticketing-order-summary__content">
        {/* Selected Tickets */}
        <div className="ticketing-order-summary__section">
          <h4 className="ticketing-order-summary__section-label">
            Selected Tickets
          </h4>
          <div className="ticketing-order-summary__items">
            {activeItems.map((item) => (
              <div key={item.id} className="ticketing-order-summary__item">
                <div className="ticketing-order-summary__item-name">
                  <span className="ticketing-order-summary__item-primary">{item.name}</span>
                  <span className="ticketing-order-summary__item-quantity">
                    x {item.quantity}
                  </span>
                </div>
                <DisplayPrice
                  price={item.totalPrice}
                  className="ticketing-order-summary__item-price"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown - Only show if order has costs */}
        {!isOrderFree && (
          <div className="ticketing-order-summary__breakdown">
            <div className="ticketing-order-summary__breakdown-row">
              <span className="ticketing-order-summary__breakdown-label">Subtotal</span>
              <DisplayPrice
                price={costs.subtotal}
                className="ticketing-order-summary__breakdown-value"
              />
            </div>
            {coupons.length > 0 && costs.discount && (
              <div className="ticketing-order-summary__breakdown-row">
                <span className="ticketing-order-summary__breakdown-label ticketing-order-summary__breakdown-label--success">Discount</span>
                <DisplayPrice
                  price={costs.discount}
                  className="ticketing-order-summary__breakdown-value ticketing-order-summary__breakdown-value--success"
                  leftDecorator="-"
                />
              </div>
            )}
            {costs.fee && !isFree(costs.fee) && (
              <div className="ticketing-order-summary__breakdown-row">
                <span className="ticketing-order-summary__breakdown-label">Fees</span>
                <DisplayPrice
                  price={costs.fee}
                  className="ticketing-order-summary__breakdown-value"
                />
              </div>
            )}
            {costs.tax && !isFree(costs.tax) && (
              <div className="ticketing-order-summary__breakdown-row">
                <span className="ticketing-order-summary__breakdown-label">Tax</span>
                <DisplayPrice
                  price={costs.tax}
                  className="ticketing-order-summary__breakdown-value"
                />
              </div>
            )}
            <div className="ticketing-order-summary__total-section">
              <div className="ticketing-order-summary__total-row">
                <span className="ticketing-order-summary__total-label">
                  Total
                </span>
                <DisplayPrice
                  price={costs.total}
                  className="ticketing-order-summary__total-value"
                />
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {showContinueButton && onContinue && (
          <div className="ticketing-order-summary__button-area">
            <Button
              onClick={onContinue}
              disabled={continueDisabled}
              fullWidth
              size="lg"
            >
              {continueLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderSummary
