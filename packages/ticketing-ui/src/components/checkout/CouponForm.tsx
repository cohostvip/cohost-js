import { FC, useState } from 'react'
import Button from '../ui/Button'

export interface AppliedCoupon {
  /**
   * Coupon code
   */
  code: string

  /**
   * Discount description (e.g., "20% off", "$10 off")
   */
  discount?: string
}

export interface CouponFormProps {
  /**
   * Currently applied coupon
   */
  appliedCoupon?: AppliedCoupon

  /**
   * Called when applying a coupon
   */
  onApply: (code: string) => Promise<void>

  /**
   * Called when removing applied coupon
   */
  onRemove?: () => void

  /**
   * Disable the form
   * @default false
   */
  disabled?: boolean

  /**
   * Additional class name
   */
  className?: string
}

/**
 * CouponForm - Coupon input with applied state and edit functionality
 *
 * @example
 * ```tsx
 * <CouponForm
 *   appliedCoupon={{ code: 'SAVE20', discount: '20% off' }}
 *   onApply={async (code) => await applyCoupon(code)}
 *   onRemove={() => removeCoupon()}
 * />
 * ```
 */
const CouponForm: FC<CouponFormProps> = ({
  appliedCoupon,
  onApply,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const handleApply = async () => {
    if (!code.trim() || disabled) return

    setIsApplying(true)
    setError('')

    try {
      await onApply(code)
      setCode('')
      setIsEditing(false)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Invalid promo code. Please try again.'
      )
    } finally {
      setIsApplying(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setCode('')
    setError('')
    setIsEditing(false)
  }

  // Show applied coupon state
  if (appliedCoupon && !isEditing) {
    return (
      <div className={className}>
        <div className="ticketing-coupon-form__applied">
          <div className="ticketing-coupon-form__applied-content">
            <svg
              className="ticketing-coupon-form__applied-icon"
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
            <div className="ticketing-coupon-form__applied-text">
              <span className="ticketing-coupon-form__applied-code">
                {appliedCoupon.code}
              </span>
              {appliedCoupon.discount && (
                <span className="ticketing-coupon-form__applied-discount">
                  ({appliedCoupon.discount})
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove || handleEdit}
            className="ticketing-coupon-form__action-button"
          >
            {onRemove ? 'Remove' : 'Edit'}
          </button>
        </div>
      </div>
    )
  }

  // Show input form
  return (
    <div className={className}>
      <div className="ticketing-coupon-form__inputs">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleApply()
            }
          }}
          placeholder="Enter promo code"
          disabled={disabled || isApplying}
          className="ticketing-coupon-form__input"
        />
        <Button
          variant="secondary"
          onClick={handleApply}
          disabled={!code.trim() || isApplying || disabled}
          loading={isApplying}
        >
          Apply
        </Button>
        {isEditing && (
          <Button variant="ghost" onClick={handleCancel} disabled={isApplying}>
            Cancel
          </Button>
        )}
      </div>
      {error && (
        <p className="ticketing-coupon-form__error">{error}</p>
      )}
    </div>
  )
}

export default CouponForm
