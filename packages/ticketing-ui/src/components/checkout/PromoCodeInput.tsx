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
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-ticketing-muted mb-2">
        Promo Code
      </label>
      <div className="flex space-x-2">
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
          className={`flex-1 px-3 py-2 border rounded-lg bg-ticketing-background text-ticketing-text focus:ring-2 focus:ring-ticketing-primary focus:border-transparent transition-colors ${
            error
              ? 'border-ticketing-error'
              : 'border-ticketing-border'
          }`}
          disabled={applied || disabled}
        />
        {applied ? (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-ticketing-surface text-ticketing-text rounded-lg hover:bg-ticketing-surface-hover transition-colors"
            aria-label="Clear promo code"
          >
            Clear
          </button>
        ) : (
          <button
            onClick={handleApply}
            disabled={!code.trim() || isApplying || disabled}
            className="px-4 py-2 bg-ticketing-surface text-ticketing-text rounded-lg hover:bg-ticketing-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-ticketing-error mt-2">
          {error}
        </p>
      )}
      {applied && !error && (
        <p className="text-sm text-ticketing-success mt-2">
          ✓ Promo code applied!
        </p>
      )}
    </div>
  )
}

export default PromoCodeInput
