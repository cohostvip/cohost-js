import { FC } from 'react'
import { clsx } from 'clsx'
import Button from './Button'

export interface QuantitySelectorProps {
  /**
   * Current quantity value
   */
  value: number

  /**
   * Called when increment button is clicked
   */
  onIncrement: () => void

  /**
   * Called when decrement button is clicked
   */
  onDecrement: () => void

  /**
   * Minimum allowed value
   * @default 0
   */
  min?: number

  /**
   * Maximum allowed value (undefined = no limit)
   */
  max?: number

  /**
   * Disable all interactions
   * @default false
   */
  disabled?: boolean

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * QuantitySelector - Increment/decrement quantity control using Button components
 *
 * @example
 * ```tsx
 * const [quantity, setQuantity] = useState(0)
 *
 * <QuantitySelector
 *   value={quantity}
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
  size = 'md',
}) => {
  const isDecrementDisabled = disabled || value <= min
  const isIncrementDisabled = disabled || (max !== undefined && value >= max)

  const sizeClasses = {
    sm: 'h-7 w-7 p-0 text-sm',
    md: 'h-8 w-8 p-0',
    lg: 'h-10 w-10 p-0 text-lg',
  }

  return (
    <div className="ticketing-quantity-selector__wrapper">
      <Button
        size="sm"
        variant="secondary"
        onClick={onDecrement}
        disabled={isDecrementDisabled}
        className={sizeClasses[size]}
        aria-label="Decrease quantity"
      >
        -
      </Button>
      <span className={clsx('ticketing-quantity-selector__display', `ticketing-quantity-selector__display--${size}`)}>
        {value}
      </span>
      <Button
        size="sm"
        variant="secondary"
        onClick={onIncrement}
        disabled={isIncrementDisabled}
        className={sizeClasses[size]}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  )
}

export default QuantitySelector
