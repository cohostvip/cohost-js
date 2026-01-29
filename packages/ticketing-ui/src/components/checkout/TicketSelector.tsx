import { FC, useState } from 'react'
import DisplayPrice from '../ui/DisplayPrice'
import QuantitySelector from '../ui/QuantitySelector'

export interface TicketSelectorItem {
  id: string
  name: string
  description?: string
  price: string
  quantity: number
  totalPrice?: string
  maxQuantity?: number
  minQuantity?: number
  soldOut?: boolean
}

interface TicketDetailsModalProps {
  item: TicketSelectorItem
  isOpen: boolean
  onClose: () => void
}

const TicketDetailsModal: FC<TicketDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="ticketing-ticket-modal">
      {/* Backdrop */}
      <button
        type="button"
        className="ticketing-ticket-modal__backdrop"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="ticketing-ticket-modal__content">
        {/* Header */}
        <div className="ticketing-ticket-modal__header">
          <div className="ticketing-ticket-modal__header-flex">
            <div className="ticketing-ticket-modal__header-info">
              <h3 className="ticketing-ticket-modal__title">
                {item.name}
              </h3>
              <div className="ticketing-ticket-modal__price-container">
                <DisplayPrice
                  price={item.price}
                  className="text-lg font-semibold text-ticketing-text"
                  rightDecorator={
                    <span className="text-sm text-ticketing-text-muted ml-1 font-normal">
                      per ticket
                    </span>
                  }
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="ticketing-ticket-modal__close-button"
              aria-label="Close"
            >
              <svg
                className="ticketing-ticket-modal__close-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="ticketing-ticket-modal__body">
          {item.description && (
            <div
              className="ticketing-ticket-modal__description"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          )}

          {/* Additional Info */}
          {item.maxQuantity !== undefined && item.maxQuantity < 10 && (
            <div className="ticketing-ticket-modal__info-box">
              <p className="ticketing-ticket-modal__info-text">
                <strong className="ticketing-ticket-modal__info-label">
                  Maximum Quantity:
                </strong>{' '}
                {item.maxQuantity} per order
              </p>
            </div>
          )}

          {item.minQuantity !== undefined && item.minQuantity > 1 && (
            <div className="ticketing-ticket-modal__info-box">
              <p className="ticketing-ticket-modal__info-text">
                <strong className="ticketing-ticket-modal__info-label">
                  Minimum Quantity:
                </strong>{' '}
                {item.minQuantity}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ticketing-ticket-modal__footer">
          <button
            onClick={onClose}
            className="ticketing-ticket-modal__footer-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export interface TicketSelectorProps {
  /**
   * List of ticket items
   */
  items: TicketSelectorItem[]

  /**
   * Called when quantity is incremented
   */
  onIncrement: (itemId: string) => void

  /**
   * Called when quantity is decremented
   */
  onDecrement: (itemId: string) => void

  /**
   * Additional class names
   */
  className?: string
}

/**
 * TicketSelector - Display and select tickets with quantities
 *
 * @example
 * ```tsx
 * <TicketSelector
 *   items={[
 *     { id: '1', name: 'General Admission', price: 'USD,2500', quantity: 0 },
 *     { id: '2', name: 'VIP', price: 'USD,7500', quantity: 0 }
 *   ]}
 *   onIncrement={(id) => handleIncrement(id)}
 *   onDecrement={(id) => handleDecrement(id)}
 * />
 * ```
 */
const TicketSelector: FC<TicketSelectorProps> = ({
  items,
  onIncrement,
  onDecrement,
  className = '',
}) => {
  const [selectedItem, setSelectedItem] = useState<TicketSelectorItem | null>(
    null
  )

  return (
    <>
      <div className={`ticketing-ticket-selector ${className}`}>
        <div className="ticketing-ticket-selector__header">
          <h3 className="ticketing-ticket-selector__title">
            Select Tickets
          </h3>
          <p className="ticketing-ticket-selector__description">
            Choose the number of tickets you&apos;d like to purchase
          </p>
        </div>

        <div className="ticketing-ticket-selector__content">
          <div className="ticketing-ticket-selector__items">
            {items.map((item) => {
              const isSoldOut = item.soldOut || item.maxQuantity === 0

              return (
                <div
                  key={item.id}
                  className={`ticketing-ticket-selector__item ${
                    isSoldOut ? 'ticketing-ticket-selector__item--sold-out' : ''
                  }`}
                >
                  <div className="ticketing-ticket-selector__item-header">
                    <div className="ticketing-ticket-selector__item-info">
                      <div className="ticketing-ticket-selector__item-title-area">
                        <h4 className="ticketing-ticket-selector__item-name">
                          {item.name}
                        </h4>
                        {isSoldOut && (
                          <span className="ticketing-ticket-selector__sold-out-badge">
                            Sold Out
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="ticketing-ticket-selector__details-link"
                        >
                          See Details
                        </button>
                      )}
                      <div className="ticketing-ticket-selector__item-price">
                        <DisplayPrice
                          price={item.price}
                          className="text-lg font-semibold text-ticketing-text"
                          rightDecorator={
                            <span className="ticketing-ticket-selector__item-price-decorator">
                              per ticket
                            </span>
                          }
                          freeLabel="Free"
                        />
                      </div>
                    </div>

                    <div className="ticketing-ticket-selector__item-controls">
                      {/* Quantity Selector */}
                      <QuantitySelector
                        value={item.quantity}
                        onIncrement={() => onIncrement(item.id)}
                        onDecrement={() => onDecrement(item.id)}
                        min={0}
                        max={item.maxQuantity}
                        disabled={isSoldOut}
                      />
                      {item.quantity > 0 && item.totalPrice && (
                        <div className="ticketing-ticket-selector__item-subtotal">
                          <span className="ticketing-ticket-selector__item-subtotal-label">
                            Subtotal
                          </span>
                          <DisplayPrice
                            price={item.totalPrice}
                            className="ticketing-ticket-selector__item-subtotal-value"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show offering constraints if any */}
                  {item.maxQuantity !== undefined && item.maxQuantity < 10 && !isSoldOut && (
                    <div className="ticketing-ticket-selector__item-constraints">
                      Maximum {item.maxQuantity} per order
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {items.length === 0 && (
            <div className="ticketing-ticket-selector__empty">
              <svg
                className="ticketing-ticket-selector__empty-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="ticketing-ticket-selector__empty-message">No tickets available</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <TicketDetailsModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}

export default TicketSelector
