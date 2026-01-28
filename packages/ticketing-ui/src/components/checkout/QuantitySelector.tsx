import { FC } from 'react'

export interface QuantitySelectorProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  min?: number
  max?: number
  disabled?: boolean
}

/**
 * QuantitySelector - Standalone quantity control with increment/decrement buttons
 *
 * @example
 * ```tsx
 * <QuantitySelector
 *   value={2}
 *   onIncrement={() => setQuantity(q => q + 1)}
 *   onDecrement={() => setQuantity(q => q - 1)}
 *   min={0}
 *   max={10}
 * />
 * ```
 */
const QuantitySelector: FC<QuantitySelectorProps> = ({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max,
  disabled = false,
}) => {
  const isDecrementDisabled = disabled || value <= min
  const isIncrementDisabled = disabled || (max !== undefined && value >= max)

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onDecrement}
        disabled={isDecrementDisabled}
        className="w-8 h-8 rounded-full bg-ticketing-surface flex items-center justify-center text-ticketing-text hover:bg-ticketing-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="w-8 text-center font-medium text-ticketing-text">
        {value}
      </span>
      <button
        onClick={onIncrement}
        disabled={isIncrementDisabled}
        className="w-8 h-8 rounded-full bg-ticketing-surface flex items-center justify-center text-ticketing-text hover:bg-ticketing-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector
