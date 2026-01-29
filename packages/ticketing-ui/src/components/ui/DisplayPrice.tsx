import { FC, ReactNode } from 'react'

/**
 * CurrencyAmount format: "CURRENCY,AMOUNT_IN_CENTS"
 * Example: "USD,5000" represents $50.00 USD
 */
export type CurrencyAmount = string

export interface DisplayPriceProps {
  /**
   * Price in CurrencyAmount format (e.g., "USD,5000" for $50.00)
   */
  price?: CurrencyAmount

  /**
   * Minimum fraction digits to display
   * @default 2
   */
  minimumFractionDigits?: number

  /**
   * Maximum fraction digits to display
   * @default 2
   */
  maximumFractionDigits?: number

  /**
   * Custom class name
   */
  className?: string

  /**
   * Custom label to display when price is zero/free
   * @default 'Free'
   */
  freeLabel?: ReactNode

  /**
   * Content to display after the price
   */
  rightDecorator?: ReactNode

  /**
   * Content to display before the price
   */
  leftDecorator?: ReactNode

  /**
   * Hide component if price is empty/undefined
   * @default false
   */
  hideIfEmpty?: boolean

  /**
   * Hide component if price is zero/free
   * @default false
   */
  hideIfFree?: boolean

  /**
   * Original price to show alongside sale price (for comparison)
   */
  originalPrice?: CurrencyAmount

  /**
   * Whether to show as a sale/discount price
   * @default false
   */
  showAsSale?: boolean
}

const DisplayPrice: FC<DisplayPriceProps> = ({
  price,
  hideIfEmpty = false,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  className = '',
  freeLabel = 'Free',
  rightDecorator,
  leftDecorator,
  hideIfFree = false,
  originalPrice,
  showAsSale = false,
}) => {
  // Handle empty price
  if (!price && hideIfEmpty) {
    return null
  }

  // Parse price (format: "CURRENCY,AMOUNT_IN_CENTS")
  const [currency, amountStr] = (price ?? 'USD,0').split(',')
  const amountInCents = Number(amountStr)
  const majorAmount = amountInCents / 100

  // Handle free price
  if (hideIfFree && majorAmount === 0) {
    return null
  }

  // Create formatter for the currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    currencySign: 'standard',
    useGrouping: true,
    minimumFractionDigits,
    maximumFractionDigits,
  })

  // If price is zero, show free label
  if (majorAmount === 0) {
    return <>{freeLabel}</>
  }

  const formattedPrice = formatter.format(majorAmount)

  // Parse and format original price if provided
  let formattedOriginalPrice: string | null = null
  if (originalPrice) {
    const [origCurrency, origAmountStr] = originalPrice.split(',')
    const origAmountInCents = Number(origAmountStr)
    const origMajorAmount = origAmountInCents / 100

    if (origMajorAmount > 0) {
      const origFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: origCurrency,
        currencyDisplay: 'narrowSymbol',
        currencySign: 'standard',
        useGrouping: true,
        minimumFractionDigits,
        maximumFractionDigits,
      })
      formattedOriginalPrice = origFormatter.format(origMajorAmount)
    }
  }

  return (
    <div className={`ticketing-display-price__wrapper ${className || ''}`}>
      {leftDecorator && (
        <span className="ticketing-display-price__left-decorator">
          {leftDecorator}
        </span>
      )}
      <span
        className={showAsSale || formattedOriginalPrice ? 'ticketing-display-price__price--sale' : 'ticketing-display-price__price'}
      >
        {formattedPrice}
      </span>
      {formattedOriginalPrice && (
        <span className="ticketing-display-price__original-price">
          {formattedOriginalPrice}
        </span>
      )}
      {rightDecorator && (
        <span className="ticketing-display-price__right-decorator">
          {rightDecorator}
        </span>
      )}
    </div>
  )
}

export default DisplayPrice
