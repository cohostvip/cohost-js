import { FC, useState } from 'react'

export interface PromoCodeInputProps {
  onApply: (code: string) => Promise<void>
  disabled?: boolean
  className?: string
}

/**
 * PromoCodeInput - Standalone promo code input with loading, success, and error states
 *
 * @example
 * ```tsx
 * <PromoCodeInput
 *   onApply={async (code) => {
 *     await applyCoupon(code)
 *   }}
 * />
 * ```
 */
const PromoCodeInput: FC<PromoCodeInputProps> = ({
  onApply,
  disabled = false,
  className = '',
}) => {
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim() || disabled) return

    setIsApplying(true)
    setError('')

    try {
      await onApply(code)
      setApplied(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid promo code. Please check and try again.')
      setApplied(false)
    } finally {
      setIsApplying(false)
    }
  }

  const handleClear = () => {
    setCode('')
    setApplied(false)
    setError('')
  }

  return (
    <div className={`ticketing-promo-code-input ${className}`}>
      <label className="ticketing-promo-code-input__label">
        Promo Code
      </label>
      <div className="ticketing-promo-code-input__container">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApply()
            }
          }}
          placeholder="Enter code"
          className={`ticketing-promo-code-input__input ${
            error
              ? 'ticketing-promo-code-input__input--error'
              : ''
          }`}
          disabled={applied || disabled}
        />
        {applied ? (
          <button
            onClick={handleClear}
            className="ticketing-promo-code-input__button"
            aria-label="Clear promo code"
          >
            Clear
          </button>
        ) : (
          <button
            onClick={handleApply}
            disabled={!code.trim() || isApplying || disabled}
            className="ticketing-promo-code-input__button"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        )}
      </div>
      {error && (
        <p className="ticketing-promo-code-input__error">
          {error}
        </p>
      )}
      {applied && !error && (
        <p className="ticketing-promo-code-input__success">
          ✓ Promo code applied!
        </p>
      )}
    </div>
  )
}

export default PromoCodeInput
