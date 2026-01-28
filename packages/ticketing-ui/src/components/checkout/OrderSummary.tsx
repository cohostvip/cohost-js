import { FC } from 'react'
import { useCohostCheckout } from '@cohostvip/cohost-react'
import DisplayPrice from '../ui/DisplayPrice'
import PromoCodeInput from './PromoCodeInput'

export interface OrderSummaryProps {
  showContinueButton?: boolean
  onContinue?: () => void
  continueDisabled?: boolean
  className?: string
}

/**
 * OrderSummary - Display order summary with line items, discounts, fees, and total
 *
 * Requires Cohost SDK context (CohostCheckoutProvider).
 *
 * @example
 * ```tsx
 * <CohostCheckoutProvider cartSessionId="...">
 *   <OrderSummary
 *     showContinueButton
 *     onContinue={() => nextStep()}
 *     continueDisabled={!isStepComplete}
 *   />
 * </CohostCheckoutProvider>
 * ```
 */
const OrderSummary: FC<OrderSummaryProps> = ({
  showContinueButton = false,
  onContinue,
  continueDisabled = false,
  className = '',
}) => {
  const { cartSession, applyCoupon } = useCohostCheckout()
  const items = cartSession!.items

  // Helper function to check if a price is free (0)
  const isFree = (price?: string) => {
    if (!price) return true
    const [, amount] = price.split(',')
    return Number(amount) === 0
  }

  const isOrderFree =
    isFree(cartSession!.costs?.subtotal) && isFree(cartSession!.costs?.total)

  // Check if cart is empty
  const isCartEmpty = !items.some((item) => item.quantity > 0)

  if (isCartEmpty) {
    return (
      <div
        className={`bg-ticketing-surface rounded-lg shadow-sm border border-ticketing-border ${className}`}
      >
        <div className="p-6 text-center">
          <svg
            className="w-12 h-12 text-ticketing-muted mx-auto mb-4"
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
          <p className="text-ticketing-muted">Your cart is empty</p>
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
          <h4 className="text-sm font-medium text-ticketing-muted mb-3">
            Selected Tickets
          </h4>
          <div className="space-y-3">
            {items
              .filter((item) => item.quantity > 0)
              .map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <span className="text-ticketing-text">
                      {item.offering?.name || 'Ticket'}
                    </span>
                    <span className="text-ticketing-muted ml-2">
                      x {item.quantity}
                    </span>
                  </div>
                  <DisplayPrice
                    price={item.costs!.total}
                    className="text-ticketing-text"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Promo Code - Only show if order has costs */}
        {!isOrderFree && (
          <PromoCodeInput
            onApply={async (code) => {
              await applyCoupon(code)
            }}
          />
        )}

        {/* Price Breakdown - Only show if order has costs */}
        {!isOrderFree && (
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-ticketing-muted">Subtotal</span>
              <DisplayPrice
                price={cartSession!.costs?.subtotal}
                className="text-ticketing-text"
              />
            </div>
            {(cartSession!.coupons?.length || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ticketing-success">Discount</span>
                <DisplayPrice
                  price={cartSession!.costs?.discount}
                  className="text-ticketing-success"
                  leftDecorator="-"
                />
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-ticketing-muted">Fees</span>
              <DisplayPrice
                price={cartSession!.costs?.fee}
                className="text-ticketing-text"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ticketing-muted">Tax</span>
              <DisplayPrice
                price={cartSession!.costs?.tax}
                className="text-ticketing-text"
              />
            </div>
            <div className="border-t border-ticketing-border pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-ticketing-text">
                  Total
                </span>
                <DisplayPrice
                  price={cartSession!.costs?.total}
                  className="text-lg font-semibold text-ticketing-text"
                />
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {showContinueButton && onContinue && (
          <button
            onClick={onContinue}
            disabled={continueDisabled}
            className="w-full bg-ticketing-primary hover:bg-ticketing-primary-hover disabled:bg-ticketing-muted disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}

export default OrderSummary
